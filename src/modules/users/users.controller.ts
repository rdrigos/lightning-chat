import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { UserDTO } from '@/modules/users/dtos/user.dto';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { ApiErrorDTO } from '@/shared/dtos/api-error.dto';
import { ApiValidationErrorDTO } from '@/shared/dtos/api-validation-error.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiCreatedResponse({ type: UserDTO })
  @ApiConflictResponse({ type: ApiErrorDTO })
  @ApiBadRequestResponse({ type: ApiValidationErrorDTO })
  public async create(@Body() body: CreateUserDTO): Promise<UserDTO> {
    return await this.createUserUseCase.execute(body);
  }
}
