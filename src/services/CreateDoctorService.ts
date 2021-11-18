import axios from "axios";
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
    ) {}

    public async execute({
        name,
        crm,
        landline,
        phoneNumber,
        zipCode,
        specialties
    }: DoctorDTO): Promise<IDoctor & { zipCodeInfo: { [k: string]: string } }> {
        const isCrmRegistered = !!(await this.doctorRepository.findByCrm(crm));

        if (isCrmRegistered) {
            throw new ApiError("CRM already registered");
        }

        const isPhoneNumberRegistered =
            !!(await this.doctorRepository.findByPhoneNumber(phoneNumber));

        if (isPhoneNumberRegistered) {
            throw new ApiError("Phone number already registered");
        }

        let response: any;

        try {
            response = await axios.get(
                `https://viacep.com.br/ws/${zipCode}/json/`
            );
        } catch (err) {
            throw new ApiError("Invalid ZIP Code provided");
        }

        const zipCodeInfo = response.data;

        const newDoctor = await this.doctorRepository.create(
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties
        );

        return { ...newDoctor, zipCodeInfo };
    }
}
