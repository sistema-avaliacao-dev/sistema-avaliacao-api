import dotenv from "dotenv"

dotenv.config();

export const auth = {
    secret: String(process.env.SECRET)
};