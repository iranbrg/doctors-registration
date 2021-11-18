import { PrismaClient } from "@prisma/client";
import IDatabase from "./IDatabase";

export type LogLevel = "info" | "query" | "warn" | "error";

export default class PrismaDatabase implements IDatabase<PrismaClient> {
    private prisma: PrismaClient;

    public constructor() {
        const config =
            process.env.NODE_ENV !== "test"
                ? { log: ["query", "info", "warn", "error"] as LogLevel[] }
                : { log: [] as LogLevel[] };

        this.prisma = new PrismaClient(config);
    }

    public async connect(): Promise<PrismaClient> {
        await this.prisma.$connect();
        return this.prisma;
    }

    public async close(): Promise<void> {
        await this.prisma.$disconnect();
    }

    public getClient(): PrismaClient {
        return this.prisma;
    }

    public async truncate(): Promise<void> {
        const deleteDoctors = this.prisma.doctor.deleteMany();

        await this.prisma.$transaction([deleteDoctors]);
    }
}
