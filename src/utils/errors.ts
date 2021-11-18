import { Http } from "./constants";

// Base error class for HTTP response errors
export class HttpException extends Error {
    public readonly name: string;

    public statusCode: Http;

    public constructor(message: string, statusCode: Http) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

// Error class for business logic errors
export class ApiError extends HttpException {
    public readonly name: string;

    public constructor(message: string, statusCode: Http = 400) {
        super(message, statusCode);
        this.name = this.constructor.name;
    }
}

export class AuthError extends HttpException {
    public readonly name: string;

    public constructor(
        message: string,
        statusCode: Http.Forbidden | Http.Unauthorized = Http.Unauthorized
    ) {
        super(message, statusCode);
        this.name = this.constructor.name;
    }
}
