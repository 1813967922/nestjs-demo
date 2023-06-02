import * as bcrypt from 'bcryptjs';

/**
 * 生成盐
 * @param rounds 轮数，推荐10
 */
export const getSalt = (rounds: number = 10) => {
  return bcrypt.genSaltSync(rounds);
};

/**
 * 加密密码
 * @param pwd 明文密码
 * @param salt 盐值
 * @returns 加密后的密码
 */
export const hashPassword = (pwd: string, salt: string | number) => {
  return bcrypt.hashSync(pwd, salt);
};

/**
 * 验证密码
 * @param a 明文密码
 * @param b 加密密码
 * @returns 
 */
export const validatePwd = (a: string, b: string) => {
    return bcrypt.compareSync(a, b)
};
