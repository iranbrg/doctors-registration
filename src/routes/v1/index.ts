import { Router } from "express";
import doctorsRoutes from "./doctorsRoutes";

const router = Router();

router.use("/doctors", doctorsRoutes);

export default router;
