import * as yup from "yup";
import { Specialty } from "../utils/constants";

const specialties = Object.values(Specialty);

export const doctorSchema = {
    name: yup.string().max(120).trim().lowercase().required(),
    crm: yup.string().matches(/^[0-9]*$/, { message: "Must be only digits", excludeEmptyString: true }).max(7).trim().lowercase().required(),
    landline: yup.string().matches(/^[0-9]*$/, { message: "Must be only digits", excludeEmptyString: true }).trim().lowercase().required(),
    phoneNumber: yup.string().matches(/^[0-9]*$/, { message: "Must be only digits", excludeEmptyString: true }).trim().lowercase().required(),
    zipCode: yup.string().matches(/^[0-9]*$/, { message: "Must be only digits", excludeEmptyString: true }).trim().lowercase().required(),
    specialties: yup.array(yup.string().trim().lowercase().oneOf(specialties)).min(2).required()
};
