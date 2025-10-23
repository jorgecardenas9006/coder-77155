import bcrypt from 'bcrypt';

// hashear contraseña
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

//validar contraseña
export const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

