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
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorProps2: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                crm: doctorProps1.crm,
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

    describe("GET /v1/doctors", () => {
        test("Should list all registered doctors", async () => {
            const doctorProps1: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorProps2: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorsToBeCreated = [doctorProps1, doctorProps2];

            await Promise.all(
                doctorsToBeCreated.map(d =>
                    request(app).post("/v1/doctors").send(d)
                )
            );

            const response = await request(app).get("/v1/doctors");

            const { doctors } = response.body.data;

            expect(response.status).toEqual(Http.Ok);
            expect(response.body).toHaveProperty("status", "success");
            expect(doctors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(doctorsToBeCreated[0]),
                    expect.objectContaining(doctorsToBeCreated[1])
                ])
            );
        });
    });

    describe("PUT /v1/doctors/:doctorId", () => {
        test("Should update a doctor's data", async () => {
            const doctorProps1: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorResponse1 = await request(app)
                .post("/v1/doctors")
                .send(doctorProps1);

            const { doctor } = doctorResponse1.body.data;

            const updatedDoctorProps: DoctorDTO = {
                name: "Mira Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [
                    Specialty.ChildrensCardiology,
                    Specialty.CardiacSurgery
                ]
            };

            const response = await request(app)
                .put(`/v1/doctors/${doctor.id}`)
                .send(updatedDoctorProps);

            const { doctor: updatedDoctor } = response.body.data;

            expect(response.status).toEqual(Http.Ok);
            expect(response.body).toHaveProperty("status", "success");
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

            const doctorId = "6eeaee26-f3e1-45c0-b454-56f3ec10a916";

            const response = await request(app)
                .put(`/v1/doctors/${doctorId}`)
                .send(updatedDoctorProps);

            expect(response.status).toEqual(Http.BadRequest);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty(
                "message",
                "Doctor doesn't exist"
            );
        });

        test("Shouldn't update a doctor's data if the CRM provided is already in use", async () => {
            const doctorProps1: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorProps2: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorsToBeCreated = [doctorProps1, doctorProps2];

            const [doctorResponse1, doctorResponse2] = await Promise.all(
                doctorsToBeCreated.map(d =>
                    request(app).post("/v1/doctors").send(d)
                )
            );

            const { doctor: doctor1 } = doctorResponse1.body.data;
            const { doctor: doctor2 } = doctorResponse2.body.data;

            const updatedDoctorProps: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                crm: doctor1.crm,
                specialties: [
                    Specialty.ChildrensCardiology,
                    Specialty.CardiacSurgery
                ]
            };

            const response = await request(app)
                .put(`/v1/doctors/${doctor2.id}`)
                .send(updatedDoctorProps);

            expect(response.status).toEqual(Http.BadRequest);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty(
                "message",
                "CRM already registered"
            );
        });

        test("Shouldn't update a doctor's data if the phone number provided is already in use", async () => {
            const doctorProps1: DoctorDTO = {
                name: "John Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorProps2: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorsToBeCreated = [doctorProps1, doctorProps2];

            const [doctorResponse1, doctorResponse2] = await Promise.all(
                doctorsToBeCreated.map(d =>
                    request(app).post("/v1/doctors").send(d)
                )
            );

            const { doctor: doctor1 } = doctorResponse1.body.data;
            const { doctor: doctor2 } = doctorResponse2.body.data;

            const updatedDoctorProps: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                phoneNumber: doctor1.phoneNumber,
                specialties: [
                    Specialty.ChildrensCardiology,
                    Specialty.CardiacSurgery
                ]
            };

            const response = await request(app)
                .put(`/v1/doctors/${doctor2.id}`)
                .send(updatedDoctorProps);

            expect(response.status).toEqual(Http.BadRequest);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty(
                "message",
                "Phone number already registered"
            );
        });
    });

    describe("DELETE /v1/doctors/:doctorId", () => {
        test("Should delete a doctor by it's ID", async () => {
            const doctorProps: DoctorDTO = {
                name: "Jane Doe",
                ...generateRandomProps(),
                zipCode: "04576020",
                specialties: [Specialty.Allergology, Specialty.Angiology]
            };

            const doctorResponse = await request(app)
                .post("/v1/doctors")
                .send(doctorProps);

            const { doctor } = doctorResponse.body.data;

            const response = await request(app).delete(
                `/v1/doctors/${doctor.id}`
            );

            const nullData = response.body.data;

            expect(response.status).toEqual(Http.Ok);
            expect(response.body).toHaveProperty("status", "success");
            expect(nullData).toBeNull();
        });

        test("Shouldn't delete a doctor if the provided ID doesn't match any record", async () => {
            const doctorId = "6eeaee26-f3e1-45c0-b454-56f3ec10a916";

            const response = await request(app).delete(
                `/v1/doctors/${doctorId}`
            );

            expect(response.status).toEqual(Http.BadRequest);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty(
                "message",
                "Doctor doesn't exist"
            );
        });
    });
});
