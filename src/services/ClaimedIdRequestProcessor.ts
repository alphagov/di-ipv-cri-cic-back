import { CicSession } from "../models/CicSession";
import { Response } from "../utils/Response";
import { CicService } from "./CicService";
import { Metrics, MetricUnits } from "@aws-lambda-powertools/metrics";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { ValidationHelper } from "../utils/ValidationHelper";
import { AppError } from "../utils/AppError";
import { HttpCodesEnum } from "../utils/HttpCodesEnum";
import { absoluteTimeNow } from "../utils/DateTimeUtils";
import { createDynamoDbClient } from "../utils/DynamoDBFactory";
import { AuthSessionState } from "../models/enums/AuthSessionState";

const SESSION_TABLE = process.env.SESSION_TABLE;
const PERSON_IDENTITY_TABLE_NAME = process.env.PERSON_IDENTITY_TABLE_NAME;

export class ClaimedIdRequestProcessor {
	private static instance: ClaimedIdRequestProcessor;

	private readonly logger: Logger;

	private readonly metrics: Metrics;

	private readonly validationHelper: ValidationHelper;

	private readonly cicService: CicService;

	constructor(logger: Logger, metrics: Metrics) {
		if (!SESSION_TABLE || !PERSON_IDENTITY_TABLE_NAME) {
			logger.error("Environment variable SESSION_TABLE or PERSON_IDENTITY_TABLE_NAME is not configured");
			throw new AppError("Service incorrectly configured", 500);
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
			console.log("EVENTBODY:",event.body)
			console.log("BODYPARSED:",bodyParsed)

			// Convert given_names and family_names string into string[]
			// Need to somehow perform the split after 
			bodyParsed.given_names = bodyParsed.given_names.split(" ");
			bodyParsed.family_names = bodyParsed.family_names.split(" ");
			cicSession = new CicSession(bodyParsed);
			console.log("AFTERSPLIT:", bodyParsed)
			console.log("CICSESSION:", cicSession)
			await this.validationHelper.validateModel(cicSession, this.logger);
			this.logger.debug({ message: "CIC Session is", cicSession });
		} catch (error) {
			return new Response(HttpCodesEnum.BAD_REQUEST, "Missing mandatory fields in the request payload");
		}

		const session = await this.cicService.getSessionById(sessionId);

		if (session != null) {
			if (session.expiryDate < absoluteTimeNow()) {
				return new Response(HttpCodesEnum.UNAUTHORIZED, `Session with session id: ${sessionId} has expired`);
			}

			this.logger.info({ message: "found session", session });
			this.metrics.addMetric("Found session", MetricUnits.Count, 1);

			if (session.authSessionState !== AuthSessionState.CIC_SESSION_CREATED) {
				this.logger.warn(`Session is in the wrong state: ${session.authSessionState}, expected state should be ${AuthSessionState.CIC_SESSION_CREATED}`);
				return new Response(HttpCodesEnum.UNAUTHORIZED, `Session is in the wrong state: ${session.authSessionState}`);
			}
			await this.cicService.saveCICData(sessionId, cicSession, session.expiryDate);
			return new Response(HttpCodesEnum.OK, "");
		} else {
			return new Response(HttpCodesEnum.UNAUTHORIZED, `No session found with the session id: ${sessionId}`);
		}
	}
}
