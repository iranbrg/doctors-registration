import { inject, injectable } from "tsyringe";
import DoctorSearchQueryDTO from "../dto/DoctorSearchQueryDTO";
import IDoctor from "../models/Doctor/IDoctor";
import ICacheProvider from "../providers/CacheProvider/ICacheProvider";
import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";

@injectable()
export default class ListDoctorsService {
    public constructor(
        @inject("DoctorRepository")
        private doctorRepository: IDoctorRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider
    ) { }

    public async execute({
        name,
        crm,
        landline,
        phoneNumber,
        zipCode,
        specialties
    }: DoctorSearchQueryDTO): Promise<IDoctor[]> {
        let doctors = await this.cacheProvider.get<IDoctor[]>("doctors");

        if (!doctors) {
            doctors = await this.doctorRepository.findAll(
                name,
                crm,
                landline,
                phoneNumber,
                zipCode,
                specialties
            );

            await this.cacheProvider.set("doctors", doctors);
        }

        return doctors;
    }
}
