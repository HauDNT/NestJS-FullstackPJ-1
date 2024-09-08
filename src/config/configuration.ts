export default () => ({
    port: parseInt(process.env.PORT),
    secret_key: process.env.SECRET_KEY,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME, 
});