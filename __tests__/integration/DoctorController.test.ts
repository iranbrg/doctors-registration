import request from "supertest";
import app from "../../src/app";
import db from "../../src/database";
import DoctorDTO from "../../src/dto/DoctorDTO";
import { Http, Specialty } from "../../src/utils/constants";
import generateRandomProps from "../utils/generateRanndomProps";

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
                specialties: [Specialty.Allergology, Specialty.Angiology]

            };
            const res = await request(app)
                .post("/v1/doctors")
                .send(doctorProps)

            const { doctor } = res.body.data;

            expect(res.status).toEqual(Http.Created);
            expect(res.body).toHaveProperty("status", "success");
            expect(doctor).toMatchObject(doctorProps);
        });

        test("Shouldn't create a new doctor whith a CRM already registered", async () => {
            const doctorProps1: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                crm: "123456",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorProps2: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                crm: "123456",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            await request(app)
                .post("/v1/doctors")
                .send(doctorProps1)

            const res = await request(app)
                .post("/v1/doctors")
                .send(doctorProps2)

            expect(res.status).toEqual(Http.BadRequest);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty(
                "message",
                "CRM already registered"
            );
        });
    });

    test("Shouldn't create a new doctor whith a phone number already registered", async () => {
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

        await request(app)
            .post("/v1/doctors")
            .send(doctorProps1)

        const res = await request(app)
            .post("/v1/doctors")
            .send(doctorProps2)

        expect(res.status).toEqual(Http.BadRequest);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty(
            "message",
            "Phone number already registered"
        );
    });
});
