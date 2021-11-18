import { Router } from "express";
import { container } from "tsyringe";
import DoctorController from "../../controllers/DoctorController";
import validate from "../../middlewares/validate";
import { doctorSchema } from "../../utils/validationSchemas";

const router = Router();

router.post("/", validate(doctorSchema, "body"), async (req, res) => {
    const doctorController = container.resolve(DoctorController);
    await doctorController.create(req, res);
});

// router.get("/", async (req, res) => {
//     const doctorController = container.resolve(DoctorController);
//     await doctorController.index(req, res);
// });

export default router;
