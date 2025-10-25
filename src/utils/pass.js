import bcrypt from 'bcrypt'

//hashear password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5));

//validar password
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password);

