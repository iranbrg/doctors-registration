import { inject, injectable } from "tsyringe";
import DoctorSearchQueryDTO from "../dto/DoctorSearchQueryDTO";
import IDoctor from "../models/Doctor/IDoctor";
import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";

@injectable()
export default class ListDoctorsService {
    public constructor(
        @inject("DoctorRepository")
        private doctorRepository: IDoctorRepository
    ) { }

    public async execute({ name, crm, landline, phoneNumber, zipCode, specialties }: DoctorSearchQueryDTO): Promise<IDoctor[]> {
        const doctors = await this.doctorRepository.findAll(name, crm, landline, phoneNumber, zipCode, specialties);

        return doctors;
    }
}
