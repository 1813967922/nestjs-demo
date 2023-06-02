import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SaveUserDto } from './dto/save.user.dto'

@ApiTags('用户服务')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '添加用户', description: '添加用户' })
  async save(@Body() dto: SaveUserDto) {
    this.userService.save(dto)
  }

  @Get()
  @ApiOperation({
    summary: '分页查询所有用户',
    description: '分页查询所有用户',
  })
  async findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询用户', description: '根据ID查询用户' })
  async findOne(@Param("id") id:string) {
    return this.userService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据ID删除用户', description: '根据ID删除用户' })
  async delete() {}

  @Put()
  @ApiOperation({ summary: '更新用户信息', description: '更新用户信息' })
  async update() {}
}
