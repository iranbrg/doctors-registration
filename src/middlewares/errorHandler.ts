import { NextFunction, Request, Response } from "express";
import { Http } from "../utils/constants";
import { HttpException } from "../utils/errors";

export default function errorHandler(
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(err.stack);

    const status = "error";
    let code = Http.InternalServerError;
    let message = "Internal Server Error";

    if (err instanceof HttpException) {
        code = err.statusCode;
        message = err.message;
    }

    res.status(code).json({
        status,
        code,
        message
    });
}
