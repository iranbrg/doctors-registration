import { inject, injectable } from "tsyringe";
import DoctorDTO from "../dto/DoctorDTO";
import IDoctor from "../models/Doctor/IDoctor";
import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";
import { ApiError } from "../utils/errors";

@injectable()
export default class CreateDoctorService {
    public constructor(
        @inject("DoctorRepository")
        private doctorRepository: IDoctorRepository
    ) { }

    public async execute({
        name,
        crm,
        landline,
        phoneNumber,
        zipCode,
        specialties
    }: DoctorDTO): Promise<IDoctor> {
        const isCrmRegistered = !!await this.doctorRepository.findByCrm(crm);

        if (isCrmRegistered) {
            throw new ApiError("CRM already registered");
        }

        const isPhoneNumberRegistered = !!await this.doctorRepository.findByPhoneNumber(phoneNumber);

        if (isPhoneNumberRegistered) {
            throw new ApiError("Phone number already registered");
        }

        const newDoctor = await this.doctorRepository.create(
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties
        );

        return newDoctor;
    }
}
