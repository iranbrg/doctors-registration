export default interface IDoctor {
    id: string;
    name: string;
    crm: string;
    landline: string;
    phoneNumber: string;
    zipCode: string;
    specialties: string[];
    createdAt: Date;
    updatedAt: Date;
}
