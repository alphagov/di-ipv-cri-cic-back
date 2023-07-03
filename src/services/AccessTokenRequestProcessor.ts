import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { CicService } from "./CicService";
import { KmsJwtAdapter } from "../utils/KmsJwtAdapter";
import { AppError } from "../utils/AppError";
import { HttpCodesEnum } from "../utils/HttpCodesEnum";
import { createDynamoDbClient } from "../utils/DynamoDBFactory";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Response } from "../utils/Response";
import { AccessTokenRequestValidationHelper } from "../utils/AccessTokenRequestValidationHelper";
import { ISessionItem } from "../models/ISessionItem";
import { absoluteTimeNow } from "../utils/DateTimeUtils";
import { Constants } from "../utils/Constants";
import { MessageCodes } from "../models/enums/MessageCodes";

const SESSION_TABLE = process.env.SESSION_TABLE;
const KMS_KEY_ARN = process.env.KMS_KEY_ARN;
const ISSUER = process.env.ISSUER;

export class AccessTokenRequestProcessor {
    private static instance: AccessTokenRequestProcessor;

    private readonly logger: Logger;

    private readonly metrics: Metrics;

    private readonly accessTokenRequestValidationHelper: AccessTokenRequestValidationHelper;

    private readonly cicService: CicService;

    private readonly kmsJwtAdapter: KmsJwtAdapter;

    constructor(logger: Logger, metrics: Metrics) {
    	if (!SESSION_TABLE || !KMS_KEY_ARN || !ISSUER) {
    		logger.error("Environment variable SESSION_TABLE or KMS_KEY_ARN or ISSUER is not configured", {
    			messageCode: MessageCodes.MISSING_CONFIGURATION,
    		});
    		throw new AppError("Service incorrectly configured, missing some environment variables.", HttpCodesEnum.SERVER_ERROR);
    	}
    	this.logger = logger;
    	this.kmsJwtAdapter = new KmsJwtAdapter(KMS_KEY_ARN);
    	this.accessTokenRequestValidationHelper = new AccessTokenRequestValidationHelper();
    	this.metrics = metrics;
    	this.cicService = CicService.getInstance(SESSION_TABLE, this.logger, createDynamoDbClient());
    }

    static getInstance(logger: Logger, metrics: Metrics): AccessTokenRequestProcessor {
    	if (!AccessTokenRequestProcessor.instance) {
    		AccessTokenRequestProcessor.instance = new AccessTokenRequestProcessor(logger, metrics);
    	}
    	return AccessTokenRequestProcessor.instance;
    }

    async processRequest(event: APIGatewayProxyEvent): Promise<Response> {
    	try {
    		const requestPayload = this.accessTokenRequestValidationHelper.validatePayload(event.body);
    		let session :ISessionItem | undefined;
    		try {
    			session = await this.cicService.getSessionByAuthorizationCode(requestPayload.code);
    			if (!session) {
    				this.logger.error("No session found", {
    					messageCode: MessageCodes.SESSION_NOT_FOUND,
    				});
    				return new Response(HttpCodesEnum.UNAUTHORIZED, `No session found by authorization code: ${requestPayload.code}`);
    			}
    			this.logger.appendKeys({ sessionId: session.sessionId });
    		} catch (error) {
    			this.logger.error("Error while retrieving the session", {
    				messageCode: MessageCodes.SESSION_NOT_FOUND,
    				error,
    			});
    			return new Response(HttpCodesEnum.UNAUTHORIZED, "Error while retrieving the session");
    		}

    		this.accessTokenRequestValidationHelper.validateTokenRequestToRecord(session, requestPayload.redirectUri);
    		// Generate access token
    		const jwtPayload = {
    			sub: session.sessionId,
    			aud: ISSUER,
    			iss: ISSUER,
    			exp: absoluteTimeNow() + Constants.TOKEN_EXPIRY_SECONDS,
    		};
    		let accessToken;
    		try {
    			accessToken = await this.kmsJwtAdapter.sign(jwtPayload);
    		} catch (error) {
    			this.logger.error("Failed to sign the accessToken Jwt", {
    				messageCode: MessageCodes.FAILED_SIGNING_JWT,
    				error,
    			});
    			return new Response( HttpCodesEnum.SERVER_ERROR, "Failed to sign the accessToken Jwt" );
    		}

    		// Update the sessionTable with accessTokenExpiryDate and AuthSessionState.
    		await this.cicService.updateSessionWithAccessTokenDetails(session.sessionId, jwtPayload.exp);

    		this.logger.info({ message: "Access token generated successfully" });

    		return {
    			statusCode: HttpCodesEnum.OK,
    			body: JSON.stringify({
    				access_token: accessToken,
    				token_type: Constants.BEARER,
    				expires_in: Constants.TOKEN_EXPIRY_SECONDS,
    			}),
    		};
    	} catch (error: any) {
    		this.logger.error({ message: "Error while trying to create access token ", error, messageCode: MessageCodes.FAILED_CREATING_ACCESS_TOKEN });
    		return new Response(error.statusCode, error.message);
    	}
    }
}
