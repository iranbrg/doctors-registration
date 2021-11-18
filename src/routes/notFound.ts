import { Router } from "express";
import { HttpException } from "../utils/errors";
import { Http } from "../utils/constants";

const router = Router();

router.use((req, res) => {
    throw new HttpException("Not Found", Http.NotFound);
});

export default router;
