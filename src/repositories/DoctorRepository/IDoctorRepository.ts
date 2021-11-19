import IDoctor from "../../models/Doctor/IDoctor";

export default interface IDoctorRepository {
    create(
        name: string,
        crm: string,
        landline: string,
        phoneNumber: string,
        zipCode: string,
        specialties: string[]
    ): Promise<IDoctor>;
    findByCrm(crm: string): Promise<IDoctor | null>;
    findByPhoneNumber(phoneNumber: string): Promise<IDoctor | null>;
    findById(doctorId: string): Promise<IDoctor | null>;
    findAll(): Promise<IDoctor[]>;
    update(
        doctorId: string,
        name: string,
        crm: string,
        landline: string,
        phoneNumber: string,
        zipCode: string,
        specialties: string[]
    ): Promise<IDoctor>;
}
