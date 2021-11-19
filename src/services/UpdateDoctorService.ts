import { inject, injectable } from "tsyringe";
import DoctorDTO from "../dto/DoctorDTO";
import IDoctor from "../models/Doctor/IDoctor";
import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";
import { ApiError } from "../utils/errors";

@injectable()
export default class UpdateDoctorService {
    public constructor(
        @inject("DoctorRepository")
        private doctorRepository: IDoctorRepository
    ) { }

    public async execute({
        doctorId,
        name,
        crm,
        landline,
        phoneNumber,
        zipCode,
        specialties,
    }: DoctorDTO & { doctorId: string }): Promise<IDoctor> {
        const doctor = await this.doctorRepository.findById(doctorId);

        if (!doctor) throw new ApiError("Doctor doesn't exist");

        const isCrmRegistered = !!(await this.doctorRepository.findByCrm(crm));

        if (isCrmRegistered && crm !== doctor.crm) {
            throw new ApiError("CRM already registered");
        }

        const isPhoneNumberRegistered =
            !!(await this.doctorRepository.findByPhoneNumber(phoneNumber));

        if (isPhoneNumberRegistered && phoneNumber !== doctor.phoneNumber) {
            throw new ApiError("Phone number already registered");
        }

        const updatedDoctor = this.doctorRepository.update(
            doctorId,
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties,
        );

        return updatedDoctor;
    }
}
