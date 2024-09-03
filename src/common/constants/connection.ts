export const connection: Connection = {
    CONNECTION_STRING: "http://localhost:8080",
    DB: "MYSQL",
    DBNAME: "TEST",
};

export type Connection = {
    CONNECTION_STRING: string,
    DB: string,
    DBNAME: string,
};