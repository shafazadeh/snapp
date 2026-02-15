import bcrypt from 'bcryptjs';

export const generate = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return { password, salt, hash };
};

export const validate = async (
  password: string,
  salt: string,
  hash: string,
) => {
  try {
    const _hash = await bcrypt.hash(password, salt);
    if (hash == _hash) return true;
    else return false;
  } catch (e) {
    return false;
  }
};

export const test = (password: string) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/.test(
    password,
  );
};
