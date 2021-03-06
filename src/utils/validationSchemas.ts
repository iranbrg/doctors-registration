import * as yup from "yup";
import { Specialty } from "./constants";

const specialties = Object.values(Specialty);

export const doctorSchema = {
    name: yup.string().max(120).trim().required(),
    crm: yup
        .string()
        .matches(/^[0-9]*$/, {
            message: "Must be only digits",
            excludeEmptyString: true
        })
        .max(7)
        .trim()
        .required(),
    landline: yup
        .string()
        .matches(/^[0-9]*$/, {
            message: "Must be only digits",
            excludeEmptyString: true
        })
        .trim()
        .required(),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]*$/, {
            message: "Must be only digits",
            excludeEmptyString: true
        })
        .trim()
        .required(),
    zipCode: yup
        .string()
        .matches(/^[0-9]*$/, {
            message: "Must be only digits",
            excludeEmptyString: true
        })
        .trim()
        .required(),
    specialties: yup
        .array(yup.string().trim().lowercase().oneOf(specialties))
        .min(2)
        .required()
};

export const doctorIdSchema = {
    doctorId: yup.string().uuid().required()
};
