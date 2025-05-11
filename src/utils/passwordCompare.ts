import bcrypt from "bcrypt"
import Usuario from "../database/models/User"

export default async function passwordCompare(password: string, user: Usuario): Promise<boolean> {
    return  await bcrypt.compare(password, user.password_hash)
}