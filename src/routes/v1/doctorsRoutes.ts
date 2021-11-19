import { Router } from "express";
import { container } from "tsyringe";
import DoctorController from "../../controllers/DoctorController";
import validate from "../../middlewares/validate";
import { doctorIdSchema, doctorSchema } from "../../utils/validationSchemas";

const router = Router();

router.post("/", validate(doctorSchema, "body"), async (req, res) => {
    const doctorController = container.resolve(DoctorController);
    await doctorController.create(req, res);
});

router.get("/", async (req, res) => {
    const doctorController = container.resolve(DoctorController);
    await doctorController.index(req, res);
});

router.put("/:doctorId", validate(doctorIdSchema, "params"), validate(doctorSchema, "body"), async (req, res) => {
    const doctorController = container.resolve(DoctorController);
    await doctorController.update(req, res);
});

export default router;
