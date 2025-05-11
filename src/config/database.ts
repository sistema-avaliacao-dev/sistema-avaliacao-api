import dotenv from "dotenv"

dotenv.config();

const configDatabase =  {
    getDatabaseConfig: () => ({
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "3306")
    })
}

export default configDatabase;