import { Request, Response } from "express";
import { injectable } from "tsyringe";
import CreateDoctorService from "../services/CreateDoctorService";
import { Http } from "../utils/constants";
import IController from "./IController";

@injectable()
export default class DoctorController implements IController {
    public constructor(
        private createDoctorService: CreateDoctorService
    ) { }

    public async create(req: Request, res: Response): Promise<void> {
        const {
            name,
            crm,
            landline,
            phoneNumber,
            zipCode,
            specialties
        } = req.body;

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
}
