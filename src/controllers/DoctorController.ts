import { Request, Response } from "express";
import { injectable } from "tsyringe";
import DoctorSearchQueryDTO from "../dto/DoctorSearchQueryDTO";
import CreateDoctorService from "../services/CreateDoctorService";
import DeleteDoctorService from "../services/DeleteDoctorService";
import ListDoctorsService from "../services/ListDoctorsService";
import UpdateDoctorService from "../services/UpdateDoctorService";
import { Http } from "../utils/constants";
import IController from "./IController";

@injectable()
export default class DoctorController implements IController {
    public constructor(
        private createDoctorService: CreateDoctorService,
        private updateDoctorService: UpdateDoctorService,
        private listDoctorsService: ListDoctorsService,
        private deleteDoctorService: DeleteDoctorService
    ) { }

    public async create(req: Request, res: Response): Promise<void> {
        const { name, crm, landline, phoneNumber, zipCode, specialties } =
            req.body;

        const doctor = await this.createDoctorService.execute({
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties
        });

        res.status(Http.Created).json({
            status: "success",
            data: { doctor }
        });
    }

    public async index(req: Request, res: Response): Promise<void> {
        const { name, crm, landline, "phone-number": phoneNumber, "zip-code": zipCode, specialties } = req.query;

        const doctorSearchQuery: DoctorSearchQueryDTO = {};

        // TODO: refactor this to reduce the use of `if` statements
        if (typeof name === "string") doctorSearchQuery.name = name;
        if (typeof crm === "string") doctorSearchQuery.crm = crm;
        if (typeof landline === "string") doctorSearchQuery.landline = landline;
        if (typeof phoneNumber === "string") doctorSearchQuery.phoneNumber = phoneNumber;
        if (typeof zipCode === "string") doctorSearchQuery.zipCode = zipCode;
        if (typeof specialties === "string") doctorSearchQuery.specialties = specialties.split(",");

        const doctors = await this.listDoctorsService.execute(doctorSearchQuery);

        res.status(Http.Ok).json({
            status: "success",
            data: { doctors }
        });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { doctorId } = req.params;

        const { name, crm, landline, phoneNumber, zipCode, specialties } =
            req.body;

        const doctor = await this.updateDoctorService.execute({
            doctorId,
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties
        });

        res.status(Http.Ok).json({
            status: "success",
            data: { doctor }
        });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { doctorId } = req.params;

        await this.deleteDoctorService.execute({ doctorId });

        res.status(Http.Ok).json({
            status: "success",
            data: null
        });
    }
}
