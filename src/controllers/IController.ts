import { Request, Response } from "express";

export default interface IController {
    create?(req: Request, res: Response): Promise<void>;
    index?(req: Request, res: Response): Promise<void>;
    show?(req: Request, res: Response): Promise<void>;
    update?(req: Request, res: Response): Promise<void>;
    delete?(req: Request, res: Response): Promise<void>;
}
