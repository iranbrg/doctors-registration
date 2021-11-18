import IDoctor from "../../models/Doctor/IDoctor";
import IDoctorRepository from "./IDoctorRepository";

export default class FakeDoctorRepository implements IDoctorRepository {
    private doctor: IDoctor[] = [];

    public async create(
        name: string,
        crm: string,
        landline: string,
        phoneNumber: string,
        zipCode: string,
        specialties: string[]
    ): Promise<IDoctor> {
        const newDoctor: IDoctor = {
            id: String(Math.floor(Math.random() * 100000000)),
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.doctor.push(newDoctor);

        return newDoctor;
    }

    public async findAll(): Promise<IDoctor[]> {
        return this.doctor;
    }

    public async findByCrm(crm: string): Promise<IDoctor | null> {
        const foundDoctor = this.doctor.find(user => user.crm === crm);

        return foundDoctor || null;
    }

    public async findByPhoneNumber(
        phoneNumber: string
    ): Promise<IDoctor | null> {
        const foundDoctor = this.doctor.find(
            user => user.phoneNumber === phoneNumber
        );

        return foundDoctor || null;
    }
}
