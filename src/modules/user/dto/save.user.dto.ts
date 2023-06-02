import { ApiPropertyOptional } from '@nestjs/swagger'

export class SaveUserDto {
  @ApiPropertyOptional({ name: 'userAcct', description: '账号' })
  userAcct: string
  @ApiPropertyOptional({ name: 'password', description: '密码' })
  password: string
  @ApiPropertyOptional({ name: 'nickName', description: '昵称' })
  nickName: string
}
