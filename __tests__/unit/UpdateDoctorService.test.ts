import IDoctorRepository from "../../src/repositories/DoctorRepository/IDoctorRepository";
import FakeDoctorRepository from "../../src/repositories/DoctorRepository/FakeDoctorRepository";
import UpdateDoctorService from "../../src/services/UpdateDoctorService";
import DoctorDTO from "../../src/dto/DoctorDTO";
import { ApiError } from "../../src/utils/errors";
import generateRandomProps from "../utils/generateRandomProps";
import { Specialty } from "../../src/utils/constants";

describe("UpdateDoctorService", () => {
    let doctorRepository: IDoctorRepository;
    let updateDoctorService: UpdateDoctorService;

    beforeEach(() => {
        doctorRepository = new FakeDoctorRepository();
        updateDoctorService = new UpdateDoctorService(doctorRepository);
    });

    test("Should update a doctor's data", async () => {
        const doctorProps: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor = await doctorRepository.create(
            doctorProps.name,
            doctorProps.crm,
            doctorProps.landline,
            doctorProps.phoneNumber,
            doctorProps.zipCode,
            doctorProps.specialties
        );

        const updatedDoctorProps: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            specialties: [
                Specialty.ChildrensCardiology,
                Specialty.CardiacSurgery
            ]
        };

        const updatedDoctor = await updateDoctorService.execute({
            doctorId: doctor.id,
            ...updatedDoctorProps
        });

        expect(updatedDoctor.id).toEqual(doctor.id);
        expect(updatedDoctor).toMatchObject(updatedDoctorProps);
    });

    test("Shouldn't update a doctor's data if the provided ID doesn't match any record", async () => {
        const updatedDoctorProps: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            specialties: [
                Specialty.ChildrensCardiology,
                Specialty.CardiacSurgery
            ]
        };

        await expect(
            updateDoctorService.execute({
                doctorId: String(Math.floor(Math.random() * 100000000)),
                ...updatedDoctorProps
            })
        ).rejects.toEqual(new ApiError("Doctor doesn't exist"));
    });

    test("Shouldn't update a doctor's data if the CRM provided is already in use", async () => {
        const doctorProps1: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor1 = await doctorRepository.create(
            doctorProps1.name,
            doctorProps1.crm,
            doctorProps1.landline,
            doctorProps1.phoneNumber,
            doctorProps1.zipCode,
            doctorProps1.specialties
        );

        const doctorProps2: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor2 = await doctorRepository.create(
            doctorProps2.name,
            doctorProps2.crm,
            doctorProps2.landline,
            doctorProps2.phoneNumber,
            doctorProps2.zipCode,
            doctorProps2.specialties
        );

        const updatedDoctorProps: DoctorDTO = {
            name: "Mira Doe",
            ...generateRandomProps(),
            crm: doctor1.crm,
            specialties: [
                Specialty.ChildrensCardiology,
                Specialty.CardiacSurgery
            ]
        };

        await expect(
            updateDoctorService.execute({
                doctorId: doctor2.id,
                ...updatedDoctorProps
            })
        ).rejects.toEqual(new ApiError("CRM already registered"));
    });

    test("Shouldn't update a doctor's data if the phone number provided is already in use", async () => {
        const doctorProps1: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor1 = await doctorRepository.create(
            doctorProps1.name,
            doctorProps1.crm,
            doctorProps1.landline,
            doctorProps1.phoneNumber,
            doctorProps1.zipCode,
            doctorProps1.specialties
        );

        const doctorProps2: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor2 = await doctorRepository.create(
            doctorProps2.name,
            doctorProps2.crm,
            doctorProps2.landline,
            doctorProps2.phoneNumber,
            doctorProps2.zipCode,
            doctorProps2.specialties
        );

        const updatedDoctorProps: DoctorDTO = {
            name: "Mira Doe",
            ...generateRandomProps(),
            phoneNumber: doctor1.phoneNumber,
            specialties: [
                Specialty.ChildrensCardiology,
                Specialty.CardiacSurgery
            ]
        };

        await expect(
            updateDoctorService.execute({
                doctorId: doctor2.id,
                ...updatedDoctorProps
            })
        ).rejects.toEqual(new ApiError("Phone number already registered"));
    });
});
