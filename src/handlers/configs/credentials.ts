export interface SchemaRegistryCredencials {
    host: string,
    auth: {
        username: string,
        password: string,
    },
    clientId?: string,
}