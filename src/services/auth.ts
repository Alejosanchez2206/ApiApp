import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

const registerNewUser = async ({ codigo, password, name }: User) => {
  const checkIs = await UserModel.findOne({ codigo });
  if (checkIs) return {status : 200 , message : "ALREADY_USER"};
  const passHash = await encrypt(password); 
  const registerNewUser = await UserModel.create({
    codigo,
    password: passHash,
    name,
  });
  
  return {status : 200 , message : "CREATED_USER"};
};

const loginUser = async ({ codigo, password }: Auth) => {
  const checkIs = await UserModel.findOne({ codigo });
  if (!checkIs) return "NOT_FOUND_USER";

  const passwordHash = checkIs.password; 
  const isCorrect = await verified(password, passwordHash);

  if (!isCorrect) return "PASSWORD_INCORRECT";

  const token = generateToken(checkIs.codigo);
  const data = {
    token,
    user: checkIs,
  };
  return data;
};

export { registerNewUser, loginUser };
