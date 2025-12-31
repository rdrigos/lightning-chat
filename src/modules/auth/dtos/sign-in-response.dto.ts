import { IssuedTokenDTO } from '@/modules/auth/dtos/issued-token.dto';
import { UserDTO } from '@/modules/users/dtos/user.dto';

export class SignInResponse {
  public accessToken!: IssuedTokenDTO;
  public user!: UserDTO;
}
