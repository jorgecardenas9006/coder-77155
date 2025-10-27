import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {env} from '../config/index.js'

//hashear password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5));

//validar password
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) =>
  jwt.sign({ user }, env.SECRET, { expiresIn: "1h" });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

