import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import db from "../../database";
import IDoctor from "../../models/Doctor/IDoctor";
import IDoctorRepository from "./IDoctorRepository";

@injectable()
export default class PrismaDoctorRepository implements IDoctorRepository {
    private db: PrismaClient;

    public constructor() {
        this.db = db.getClient();
    }

    public async create(
        name: string,
        crm: string,
        landline: string,
        phoneNumber: string,
        zipCode: string,
        specialties: string[]
    ): Promise<IDoctor> {
        return this.db.doctor.create({
            data: {
                name,
                crm,
                landline,
                phoneNumber,
                zipCode,
                specialties
            }
        });
    }

    public async findAll(): Promise<IDoctor[]> {
        return this.db.doctor.findMany();
    }

    public async findByCrm(crm: string): Promise<IDoctor | null> {
        return this.db.doctor.findUnique({
            where: {
                crm
            }
        });
    }

    public async findByPhoneNumber(
        phoneNumber: string
    ): Promise<IDoctor | null> {
        return this.db.doctor.findUnique({
            where: {
                phoneNumber
            }
        });
    }

    public async findById(doctorId: string): Promise<IDoctor | null> {
        return this.db.doctor.findUnique({
            where: {
                id: doctorId
            }
        });
    }

    public async update(
        doctorId: string,
        name: string,
        crm: string,
        landline: string,
        phoneNumber: string,
        zipCode: string,
        specialties: string[]
    ): Promise<IDoctor> {
        return this.db.doctor.update({
            where: {
                id: doctorId
            },
            data: {
                name,
                crm,
                landline,
                phoneNumber,
                zipCode,
                specialties
            }
        });
    }
}
