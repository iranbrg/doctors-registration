import { container } from "tsyringe";

import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";
import PrismaDoctorRepository from "../repositories/DoctorRepository/PrismaDoctorRepository";

container.registerSingleton<IDoctorRepository>(
    "DoctorRepository",
    PrismaDoctorRepository
);
