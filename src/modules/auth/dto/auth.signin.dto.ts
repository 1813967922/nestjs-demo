import { ApiPropertyOptional } from "@nestjs/swagger";

export class SignInDto {
  @ApiPropertyOptional({name:"userAcct",description:"账号"})
  userAcct: string;
  @ApiPropertyOptional({name:"password",description:"密码"})
  password: string;
}
