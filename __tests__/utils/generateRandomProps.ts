interface RandomProps {
    crm: string;
    landline: string;
    phoneNumber: string;
    zipCode: string;
}

export default function generateRandomProps(): RandomProps {
    return {
        crm: String(Math.floor(Math.random() * 10000000)),
        landline: String(Math.floor(Math.random() * 10000000)),
        phoneNumber: String(Math.floor(Math.random() * 10000000)),
        zipCode: String(Math.floor(Math.random() * 10000000))
    };
}
