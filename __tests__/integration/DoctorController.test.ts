import request from "supertest";
import app from "../../src/app";
import db from "../../src/database";
import DoctorDTO from "../../src/dto/DoctorDTO";
import { Http, Specialty } from "../../src/utils/constants";
import generateRandomProps from "../utils/generateRandomProps";

describe("DoctorController", () => {
    beforeAll(async () => {
        await db.connect();
    });

    beforeEach(async () => {
        await db.truncate();
    });

    afterAll(async () => {
        await db.close();
    });

    describe("POST /v1/doctors", () => {
        test("Should create a new doctor", async () => {
            const doctorProps: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };
            const response = await request(app)
                .post("/v1/doctors")
                .send(doctorProps);

            const { doctor } = response.body.data;

            expect(response.status).toEqual(Http.Created);
            expect(response.body).toHaveProperty("status", "success");
            expect(doctor).toMatchObject(doctorProps);
        });

        test("Shouldn't create a new doctor with a CRM already registered", async () => {
            const doctorProps1: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                crm: "123456",
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorProps2: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                crm: "123456",
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            await request(app).post("/v1/doctors").send(doctorProps1);

            const response = await request(app)
                .post("/v1/doctors")
                .send(doctorProps2);

            expect(response.status).toEqual(Http.BadRequest);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty(
                "message",
                "CRM already registered"
            );
        });
    });

    test("Shouldn't create a new doctor with a phone number already registered", async () => {
        const doctorProps1: DoctorDTO = {
            name: "John Doe",
            ...generateRandomProps(),
            phoneNumber: "123456",
            zipCode: "04576020",
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const doctorProps2: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            phoneNumber: "123456",
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        await request(app).post("/v1/doctors").send(doctorProps1);

        const response = await request(app)
            .post("/v1/doctors")
            .send(doctorProps2);

        expect(response.status).toEqual(Http.BadRequest);
        expect(response.body).toHaveProperty("status", "error");
        expect(response.body).toHaveProperty(
            "message",
            "Phone number already registered"
        );
    });

    test("Shouldn't create a new doctor with a invalid ZIP Code provided", async () => {
        const doctorProps: DoctorDTO = {
            name: "Jane Doe",
            ...generateRandomProps(),
            phoneNumber: "123456",
            specialties: [Specialty.Allergology, Specialty.Angiology]
        };

        const response = await request(app)
            .post("/v1/doctors")
            .send(doctorProps);

        expect(response.status).toEqual(Http.BadRequest);
        expect(response.body).toHaveProperty("status", "error");
        expect(response.body).toHaveProperty(
            "message",
            "Invalid ZIP Code provided"
        );
    });
});
