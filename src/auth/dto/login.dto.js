import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  email;

  @IsNotEmpty()
  @IsString()
  password;
}
