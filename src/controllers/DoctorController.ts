import { Request, Response } from "express";
import { injectable } from "tsyringe";
import CreateDoctorService from "../services/CreateDoctorService";
import UpdateDoctorService from "../services/UpdateDoctorService";
import { Http } from "../utils/constants";
import IController from "./IController";

@injectable()
export default class DoctorController implements IController {
    public constructor(private createDoctorService: CreateDoctorService, private updateDoctorService: UpdateDoctorService) { }

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

    // public async index(req: Request, res: Response): Promise<void> {
    //     const doctors = await this.listDoctorsService.execute();

    //     res.status(Http.Ok).json({
    //         status: "success",
    //         data: { doctors }
    //     });
    // }


    public async update(req: Request, res: Response): Promise<void> {
        const { doctorId } = req.params;

        const {
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties
        } = req.body;

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
}
