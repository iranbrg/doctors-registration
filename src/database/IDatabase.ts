export default interface IDatabase<Client> {
    connect(): Promise<Client>;
    close(): Promise<void>;
    getClient(): Client;
    truncate(): Promise<void>;
}
