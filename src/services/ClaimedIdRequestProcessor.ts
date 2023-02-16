import { CicSession } from "../models/CicSession";
import { Response } from "../utils/Response";
import { CicService } from "./CicService";
import { Metrics, MetricUnits } from "@aws-lambda-powertools/metrics";
import { randomUUID } from "crypto";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { ValidationHelper } from "../utils/ValidationHelper";
import { CicResponse } from "../utils/CicResponse";
import { AppError } from "../utils/AppError";
import { HttpCodesEnum } from "../utils/HttpCodesEnum";
import { absoluteTimeNow } from "../utils/DateTimeUtils";
import { createDynamoDbClient } from "../utils/DynamoDBFactory";

const SESSION_TABLE = process.env.SESSION_TABLE;

export class ClaimedIdRequestProcessor {
	private static instance: ClaimedIdRequestProcessor;

	private readonly logger: Logger;

	private readonly metrics: Metrics;

	private readonly validationHelper: ValidationHelper;

	private readonly cicService: CicService;

	constructor(logger: Logger, metrics: Metrics) {
		if (!SESSION_TABLE) {
			logger.error("Environment variable SESSION_TABLE is not configured");
			throw new AppError( "Service incorrectly configured", 500);
		}
		this.logger = logger;
		this.validationHelper = new ValidationHelper();
		this.metrics = metrics;
		this.cicService = CicService.getInstance(SESSION_TABLE, this.logger, createDynamoDbClient());
	}

	static getInstance(logger: Logger, metrics: Metrics): ClaimedIdRequestProcessor {
		if (!ClaimedIdRequestProcessor.instance) {
			ClaimedIdRequestProcessor.instance = new ClaimedIdRequestProcessor(logger, metrics);
		}
		return ClaimedIdRequestProcessor.instance;
	}

	async processRequest(event: APIGatewayProxyEvent, sessionId: string): Promise<Response> {
		let cicSession;
		try {
			this.logger.debug("IN processRequest");
			const bodyParsed = JSON.parse(event.body as string);
			cicSession = new CicSession(bodyParsed);
			await this.validationHelper.validateModel(cicSession, this.logger);
			this.logger.debug({ message: "CIC Session is", cicSession });
		} catch (error) {
			return new Response(HttpCodesEnum.BAD_REQUEST, "Missing mandatory fields in the request payload");
		}

		const session = await this.cicService.getSessionById(sessionId);

		if (session != null) {
			const fullName = session.fullName;
			if (session.expiryDate < absoluteTimeNow()) {
				return new Response(HttpCodesEnum.UNAUTHORIZED, `Session with session id: ${sessionId} has expired`);
			}

			this.logger.info({ message: "fullName ", fullName });
			this.logger.info({ message: "found session", session });
			this.metrics.addMetric("found session", MetricUnits.Count, 1);
			await this.cicService.saveCICData(sessionId, cicSession);
			const authCode = randomUUID();
			await this.cicService.setAuthorizationCode(sessionId, authCode);
			const cicResp = new CicResponse({
				authorizationCode: authCode,
				redirect_uri: session?.redirectUri,
				state: session?.state,
			});

			return new Response(HttpCodesEnum.OK, JSON.stringify(cicResp));
		} else {
			return new Response(HttpCodesEnum.UNAUTHORIZED, `No session found with the session id: ${sessionId}`);
		}
	}
}
