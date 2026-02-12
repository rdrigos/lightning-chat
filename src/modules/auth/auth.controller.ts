import { SignInRequestDTO } from '@/modules/auth/dtos/sign-in-request.dto';
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case';
import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private signInUseCase: SignInUseCase) {}

  @Post('sign-in')
  public async signIn(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() dto: SignInRequestDTO
  ): Promise<void> {
    const { expiresIn, token } = await this.signInUseCase.execute(dto, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    reply
      .status(HttpStatus.NO_CONTENT)
      .setCookie('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: expiresIn,
      })
      .send();
  }
}
