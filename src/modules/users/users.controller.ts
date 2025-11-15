import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { UserDTO } from '@/modules/users/dtos/user.dto';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  public async create(@Body() body: CreateUserDTO): Promise<UserDTO> {
    return await this.createUserUseCase.execute(body);
  }
}
