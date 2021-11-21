import DoctorDTO from "../../src/dto/DoctorDTO";
import FakeDoctorRepository from "../../src/repositories/DoctorRepository/FakeDoctorRepository";
import IDoctorRepository from "../../src/repositories/DoctorRepository/IDoctorRepository";
import ListDoctorsService from "../../src/services/ListDoctorsService";
import generateRandomProps from "../utils/generateRandomProps";
import { Specialty } from "../../src/utils/constants";

describe("ListDoctorsService", () => {
    let doctorRepository: IDoctorRepository;
    let listDoctorsService: ListDoctorsService;

    beforeEach(() => {
        doctorRepository = new FakeDoctorRepository();
        listDoctorsService = new ListDoctorsService(doctorRepository);
    });

    test("Should list all doctors", async () => {
        const doctorProps1: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctorProps2: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctorsToBeCreated = [doctorProps1, doctorProps2];

        await Promise.all(
            doctorsToBeCreated.map(d =>
                doctorRepository.create(
                    d.name,
                    d.crm,
                    d.landline,
                    d.phoneNumber,
                    d.zipCode,
                    d.specialties
                )
            )
        );

        const doctors = await listDoctorsService.execute({});

        expect(doctors).toEqual(
            expect.arrayContaining([
                expect.objectContaining(doctorsToBeCreated[0]),
                expect.objectContaining(doctorsToBeCreated[1])
            ])
        );
    });
});
