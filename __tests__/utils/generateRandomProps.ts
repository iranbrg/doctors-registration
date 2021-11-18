export default function generateRandomProps() {
    return {
        crm: String(Math.floor(Math.random() * 10000000)),
        landline: String(Math.floor(Math.random() * 10000000)),
        phoneNumber: String(Math.floor(Math.random() * 10000000)),
        zipCode: String(Math.floor(Math.random() * 10000000)),
    }
}

