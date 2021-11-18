import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { Http } from "../utils/constants";

type ValdationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

type FailDataWrapper = {
    [k: string]: string;
};

export default function validate(
    shape: ObjectShape,
    path: "body" | "query" | "params"
): ValdationMiddleware {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const schema = yup.object().shape(shape);

        try {
            const validData = await schema.validate(req[path], {
                abortEarly: false
            });

            req[path] = validData;

            next();
        } catch (err) {
            console.error((err as Error).stack);

            const data = (err as yup.ValidationError).inner.reduce(
                (acc, error) => {
                    if (error.path) acc[error.path] = error.message;
                    return acc;
                },
                {} as FailDataWrapper
            );

            res.status(Http.UnprocessableEntity).json({ status: "fail", data });
        }
    };
}
