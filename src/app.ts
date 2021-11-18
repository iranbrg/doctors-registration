/* eslint-disable import/first, import/newline-after-import */
import dotenv from "dotenv";
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import "reflect-metadata";
import "express-async-errors";
import "./di";
import express from "express";
import cors from "cors";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

class App {
    public express: express.Application;

    public constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
        this.errorHandling(); // Must be the last
    }

    private middlewares(): void {
        this.express.use(
            cors({
                origin: "*",
                optionsSuccessStatus: 204
            })
        );
        this.express.use(express.json());
    }

    private routes(): void {
        this.express.use(routes);
    }

    private errorHandling(): void {
        this.express.use(errorHandler);
    }
}

export default new App().express;
