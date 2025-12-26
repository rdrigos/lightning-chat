import { CreateUserRequestDTO } from '@/modules/users/dtos/create-user-request.dto';
import { UserDTO } from '@/modules/users/dtos/user.dto';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  public async create(@Body() dto: CreateUserRequestDTO): Promise<UserDTO> {
    return await this.createUserUseCase.execute(dto);
  }
}
