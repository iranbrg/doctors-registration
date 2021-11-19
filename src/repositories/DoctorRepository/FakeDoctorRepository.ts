import IDoctor from "../../models/Doctor/IDoctor";
import IDoctorRepository from "./IDoctorRepository";

export default class FakeDoctorRepository implements IDoctorRepository {
    private doctors: IDoctor[] = [];

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

        this.doctors.push(newDoctor);

        return newDoctor;
    }

    public async findAll(): Promise<IDoctor[]> {
        return this.doctors;
    }

    public async findByCrm(crm: string): Promise<IDoctor | null> {
        const foundDoctor = this.doctors.find(user => user.crm === crm);

        return foundDoctor || null;
    }

    public async findByPhoneNumber(
        phoneNumber: string
    ): Promise<IDoctor | null> {
        const foundDoctor = this.doctors.find(
            user => user.phoneNumber === phoneNumber
        );

        return foundDoctor || null;
    }

    public async findById(
        doctorId: string
    ): Promise<IDoctor | null> {
        const foundDoctor = this.doctors.find(
            user => user.id === doctorId
        );

        return foundDoctor || null;
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
        const foundDoctor = this.doctors.find(
            doctor => doctor.id === doctorId
        );

        if (!foundDoctor) throw new Error("Rocord not found");

        foundDoctor.name = name;
        foundDoctor.crm = crm;
        foundDoctor.landline = landline;
        foundDoctor.phoneNumber = phoneNumber;
        foundDoctor.zipCode = zipCode;
        foundDoctor.specialties = specialties;

        return foundDoctor;
    }

}
