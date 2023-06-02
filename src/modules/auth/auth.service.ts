import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SignInDto } from './dto/auth.signin.dto'
import { validatePwd } from '../../common/utils/encryption'
import { SignUpDto } from './dto/auth.signup.dto'
import idUtils from '../../common/utils/idUtils'
import { getSalt, hashPassword } from '../../common/utils/encryption'
import { PrismaService } from '../../common/database/prisma.service'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  /**
   * 登陆方法
   * @param dto 登陆参数
   */
  async signin(dto: SignInDto) {
    const user = await this.prismaService.user.findFirst({
      where: { userAcct: dto.userAcct },
    })
    if (user == null) {
      throw new HttpException('用户信息不存在', HttpStatus.BAD_REQUEST)
    }
    if (!validatePwd(dto.password, user.password)) {
      throw new HttpException('账号密码错误', HttpStatus.BAD_REQUEST)
    }

    return user
  }

  /**
   * 注册方法
   * @param dto 注册参数
   */
  async signup(dto: SignUpDto) {
    const user = await this.prismaService.user.findFirst({
      where: { userAcct: dto.userAcct },
    })
    if (user !== null) {
      throw new HttpException('用户信息已存在', HttpStatus.BAD_REQUEST)
    }
    const salt = getSalt()
    const newPwd = hashPassword(dto.password, salt)
    await this.prismaService.user.create({
      data: {
        id: idUtils.nextId(),
        nickName: dto.nickName,
        userAcct: dto.userAcct,
        password: newPwd,
        salt: salt,
      },
    })
  }
}
