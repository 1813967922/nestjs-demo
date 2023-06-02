import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { SaveUserDto } from './dto/save.user.dto'
import idUtils from '../../common/utils/idUtils'
import { getSalt, hashPassword } from '../../common/utils/encryption'
import { PrismaService } from '../../common/database/prisma.service'

@Injectable()
export class UserService {
  // 默认状态
  private static DEFAULT_STATUS = 0
  // 冻结状态
  private static FREEZE_STATUS = 1
  // 删除状态
  private static DELETE_STATUS = 2

  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany()
  }

  async findOne(id: string) {
    return await this.prismaService.user.findFirst({ where: { id } })
  }

  /**
   * 添加用户信息
   * @param dto 添加用户参数
   */
  async save(dto: SaveUserDto) {
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
