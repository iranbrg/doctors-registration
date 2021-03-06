import axios from "axios";
import DoctorDTO from "../../src/dto/DoctorDTO";
import FakeDoctorRepository from "../../src/repositories/DoctorRepository/FakeDoctorRepository";
import IDoctorRepository from "../../src/repositories/DoctorRepository/IDoctorRepository";
import CreateDoctorService from "../../src/services/CreateDoctorService";
import { Specialty } from "../../src/utils/constants";
import { ApiError } from "../../src/utils/errors";
import generateRandomProps from "../utils/generateRandomProps";

jest.mock("axios");

describe("CreateDoctorService", () => {
    let doctorRepository: IDoctorRepository;
    let createDoctorService: CreateDoctorService;

    beforeEach(() => {
        doctorRepository = new FakeDoctorRepository();
        createDoctorService = new CreateDoctorService(doctorRepository);
    });

    (axios as jest.Mocked<typeof axios>).get.mockImplementation(() =>
        Promise.resolve({ data: { foo: "foo" } })
    );

    test("Should create a new doctor", async () => {
        const doctorProps: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctor = await createDoctorService.execute(doctorProps);

        expect(axios.get).toHaveBeenCalled();
        expect(doctor).toHaveProperty("id");
        expect(doctor).toMatchObject(doctorProps);
    });

    test("Shouldn't create a doctor with a CRM already registered", async () => {
        const doctorProps: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        await createDoctorService.execute(doctorProps);
        await expect(createDoctorService.execute(doctorProps)).rejects.toEqual(
            new ApiError("CRM already registered")
        );
    });

    test("Shouldn't create a doctor with a phone number already registered", async () => {
        const doctorProps1: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            phoneNumber: "123456",
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctorProps2: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            phoneNumber: "123456",
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        await createDoctorService.execute(doctorProps1);

        await expect(createDoctorService.execute(doctorProps2)).rejects.toEqual(
            new ApiError("Phone number already registered")
        );
    });

    test("Shouldn't create a new doctor with a invalid ZIP Code provided", async () => {
        (axios as jest.Mocked<typeof axios>).get.mockImplementation(() =>
            Promise.reject(new ApiError("Invalid ZIP Code provided"))
        );

        const doctorProps: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            phoneNumber: "123456",
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        await expect(createDoctorService.execute(doctorProps)).rejects.toEqual(
            new ApiError("Invalid ZIP Code provided")
        );
    });
});
