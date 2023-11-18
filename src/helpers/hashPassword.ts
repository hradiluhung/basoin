import { genSalt, hash } from "bcrypt-ts"

export const hashPassword = async (unhashPassword: string) => {
  const saltRound = 10
  const salt = await genSalt(saltRound)
  return await hash(unhashPassword, salt)
}
