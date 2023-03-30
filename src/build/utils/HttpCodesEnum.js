"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCodesEnum = void 0;
var HttpCodesEnum;
(function (HttpCodesEnum) {
    HttpCodesEnum[HttpCodesEnum["OK"] = 200] = "OK";
    HttpCodesEnum[HttpCodesEnum["CREATED"] = 201] = "CREATED";
    HttpCodesEnum[HttpCodesEnum["ACCEPTED"] = 202] = "ACCEPTED";
    HttpCodesEnum[HttpCodesEnum["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpCodesEnum[HttpCodesEnum["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    HttpCodesEnum[HttpCodesEnum["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    HttpCodesEnum[HttpCodesEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCodesEnum[HttpCodesEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpCodesEnum[HttpCodesEnum["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HttpCodesEnum[HttpCodesEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpCodesEnum[HttpCodesEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCodesEnum[HttpCodesEnum["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpCodesEnum[HttpCodesEnum["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HttpCodesEnum[HttpCodesEnum["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    HttpCodesEnum[HttpCodesEnum["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HttpCodesEnum[HttpCodesEnum["CONFLICT"] = 409] = "CONFLICT";
    HttpCodesEnum[HttpCodesEnum["GONE"] = 410] = "GONE";
    HttpCodesEnum[HttpCodesEnum["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HttpCodesEnum[HttpCodesEnum["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
    HttpCodesEnum[HttpCodesEnum["URI_TOO_LONG"] = 414] = "URI_TOO_LONG";
    HttpCodesEnum[HttpCodesEnum["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    HttpCodesEnum[HttpCodesEnum["RANGE_NOT_SATISFIABLE"] = 416] = "RANGE_NOT_SATISFIABLE";
    HttpCodesEnum[HttpCodesEnum["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    HttpCodesEnum[HttpCodesEnum["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
    HttpCodesEnum[HttpCodesEnum["PAGE_EXPIRED"] = 419] = "PAGE_EXPIRED";
    HttpCodesEnum[HttpCodesEnum["ENHANCE_YOUR_CALM"] = 420] = "ENHANCE_YOUR_CALM";
    HttpCodesEnum[HttpCodesEnum["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
    HttpCodesEnum[HttpCodesEnum["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpCodesEnum[HttpCodesEnum["LOCKED"] = 423] = "LOCKED";
    HttpCodesEnum[HttpCodesEnum["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    HttpCodesEnum[HttpCodesEnum["TOO_EARLY"] = 425] = "TOO_EARLY";
    HttpCodesEnum[HttpCodesEnum["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
    HttpCodesEnum[HttpCodesEnum["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    HttpCodesEnum[HttpCodesEnum["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpCodesEnum[HttpCodesEnum["REQUEST_HEADER_FIELDS_TOO_LARGE_SHOPIFY"] = 430] = "REQUEST_HEADER_FIELDS_TOO_LARGE_SHOPIFY";
    HttpCodesEnum[HttpCodesEnum["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    HttpCodesEnum[HttpCodesEnum["RETRY_WITH"] = 449] = "RETRY_WITH";
    HttpCodesEnum[HttpCodesEnum["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    HttpCodesEnum[HttpCodesEnum["RESTRICTED_CLIENT"] = 463] = "RESTRICTED_CLIENT";
    HttpCodesEnum[HttpCodesEnum["REQUEST_HEADER_TOO_LARGE"] = 494] = "REQUEST_HEADER_TOO_LARGE";
    HttpCodesEnum[HttpCodesEnum["SSL_CERTIFICATE_REQUIRED"] = 496] = "SSL_CERTIFICATE_REQUIRED";
    HttpCodesEnum[HttpCodesEnum["HTTP_REQUEST_SENT_TO_HTTPS_PORT"] = 497] = "HTTP_REQUEST_SENT_TO_HTTPS_PORT";
    HttpCodesEnum[HttpCodesEnum["CLIENT_CLOSED"] = 499] = "CLIENT_CLOSED";
    HttpCodesEnum[HttpCodesEnum["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    HttpCodesEnum[HttpCodesEnum["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpCodesEnum[HttpCodesEnum["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpCodesEnum[HttpCodesEnum["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpCodesEnum[HttpCodesEnum["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpCodesEnum[HttpCodesEnum["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    HttpCodesEnum[HttpCodesEnum["VARIANT_ALSO_NEGOTIATES"] = 506] = "VARIANT_ALSO_NEGOTIATES";
    HttpCodesEnum[HttpCodesEnum["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
    HttpCodesEnum[HttpCodesEnum["LOOP_DETECTED"] = 508] = "LOOP_DETECTED";
    HttpCodesEnum[HttpCodesEnum["BANDWIDTH_LIMIT_EXCEEDED"] = 509] = "BANDWIDTH_LIMIT_EXCEEDED";
    HttpCodesEnum[HttpCodesEnum["NOT_EXTENDED"] = 510] = "NOT_EXTENDED";
    HttpCodesEnum[HttpCodesEnum["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
    HttpCodesEnum[HttpCodesEnum["UNKNOWN_ERROR"] = 520] = "UNKNOWN_ERROR";
    HttpCodesEnum[HttpCodesEnum["ORIGIN_UNREACHABLE"] = 523] = "ORIGIN_UNREACHABLE";
    HttpCodesEnum[HttpCodesEnum["INVALID_SSL_CERTIFICATE"] = 526] = "INVALID_SSL_CERTIFICATE";
    HttpCodesEnum[HttpCodesEnum["RAILGUN_ERROR"] = 527] = "RAILGUN_ERROR";
    HttpCodesEnum[HttpCodesEnum["SITE_IS_FROZEN"] = 530] = "SITE_IS_FROZEN";
    HttpCodesEnum[HttpCodesEnum["ELB_UNAUTHORIZED"] = 561] = "ELB_UNAUTHORIZED";
})(HttpCodesEnum = exports.HttpCodesEnum || (exports.HttpCodesEnum = {}));
