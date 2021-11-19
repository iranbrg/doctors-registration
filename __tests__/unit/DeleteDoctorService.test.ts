import IDoctorRepository from "../../src/repositories/DoctorRepository/IDoctorRepository";
import FakeDoctorRepository from "../../src/repositories/DoctorRepository/FakeDoctorRepository";
import DeleteDoctorService from "../../src/services/DeleteDoctorService";
import DoctorDTO from "../../src/dto/DoctorDTO";
import { ApiError } from "../../src/utils/errors";
import generateRandomProps from "../utils/generateRandomProps";
import { Specialty } from "../../src/utils/constants";

describe("DeleteDoctorService", () => {
    let doctorRepository: IDoctorRepository;
    let deleteDoctorService: DeleteDoctorService;

    beforeEach(() => {
        doctorRepository = new FakeDoctorRepository();
        deleteDoctorService = new DeleteDoctorService(doctorRepository);
    });

    test("Should delete a doctor by it's ID", async () => {
        const doctorProps: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor = await doctorRepository.create(
            doctorProps.name,
            doctorProps.crm,
            doctorProps.landline,
            doctorProps.zipCode,
            doctorProps.phoneNumber,
            doctorProps.specialties
        );

        const deleteMock = jest.spyOn(doctorRepository, "delete");

        await deleteDoctorService.execute({ doctorId: doctor.id });

        const inexistentDoctor = await doctorRepository.findById(doctor.id);

        expect(inexistentDoctor).toBeNull();
        expect(deleteMock).toHaveBeenCalled();
    });

    test("Shouldn't delete a doctor if the provided ID doesn't match any record", async () => {
        const doctorId = String(Math.floor(Math.random() * 100000000));

        await expect(deleteDoctorService.execute({ doctorId })).rejects.toEqual(
            new ApiError("Doctor doesn't exist")
        );
    });
});
