import bcrypt from 'bcrypt'

export default async function passwordHash(password: string): Promise<string>{
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    return passwordHash
}