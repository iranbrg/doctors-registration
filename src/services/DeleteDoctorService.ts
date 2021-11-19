import { inject, injectable } from "tsyringe";
import IDoctorRepository from "../repositories/DoctorRepository/IDoctorRepository";
import { ApiError } from "../utils/errors";

@injectable()
export default class DeleteDoctorService {
    public constructor(
        @inject("DoctorRepository")
        private doctorRepository: IDoctorRepository
    ) {}

    public async execute({ doctorId }: { doctorId: string }): Promise<void> {
        const doctor = await this.doctorRepository.findById(doctorId);

        if (!doctor) throw new ApiError("Doctor doesn't exist");

        await this.doctorRepository.delete(doctorId);
    }
}
