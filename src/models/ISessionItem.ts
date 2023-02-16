export interface ICicSession {
	fullName: string;
	dateOfBirth: string;
	documentSelected: string;
	dateOfExpiry: string;
}

export interface ISessionItem extends ICicSession {
	sessionId: string;
	clientId: string;
	clientSessionId: string;
	authorizationCode: string;
	authorizationCodeExpiryDate: number;
	redirectUri: string;
	accessToken: string;
	accessTokenExpiryDate: number;
	expiryDate: number;
	createdDate: number;
	state: string;
	subject: string;
	persistentSessionId: string;
	clientIpAddress: string;
	attemptCount: number;
}
