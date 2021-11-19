import { inject, injectable } from "tsyringe";
import IDoctor from "../models/Doctor/IDoctor";
import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";

@injectable()
export default class ListDoctorsService {
    public constructor(
        @inject("DoctorRepository")
        private doctorRepository: IDoctorRepository
    ) {}

    public async execute(): Promise<IDoctor[]> {
        const doctors = await this.doctorRepository.findAll();

        return doctors;
    }
}
