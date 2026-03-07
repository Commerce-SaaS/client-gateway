import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from '../shared/dto/register-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/config';
import { LoginDto } from '../shared/dto/login.dto';
import { UpdateUserDto } from '../shared/dto/update-user.dto';
import { ChangePasswordDto } from '../shared/dto/change-password.dto';
import { SESSION_PATTERNS } from '../shared/patterns/session_patterns';
import { RefreshTokenDto } from '../shared/dto/refresh-token.dto';
import { ForgotPasswordDto } from '../shared/dto/forgot-password.dto';
import { ResetPasswordDto } from '../shared/dto/reset-password.dto';
import { SAAS_AUTH_PATTERNS } from './patterns/saas-auth.patterns';
import { SAAS_USER_PATTERNS } from './patterns/saas-user.patterns';
import { GoogleAuthDto } from '../shared/dto/google-auth.dto';

@Injectable()
export class SaaSUserService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  register(registerUserDto: RegisterUserDto) {
    return firstValueFrom(
      this.client.send(SAAS_AUTH_PATTERNS.REGISTER, registerUserDto),
    );
  }
  login(loginDto: LoginDto) {
    return firstValueFrom(this.client.send(SAAS_AUTH_PATTERNS.LOGIN, loginDto));
  }
  logout(token: string) {
    return firstValueFrom(
      this.client.send(SESSION_PATTERNS.SAAS_LOGOUT, token),
    );
  }
  logoutAll(id: string) {
    return firstValueFrom(
      this.client.send(SESSION_PATTERNS.SAAS_LOGOUT_ALL, id),
    );
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return firstValueFrom(
      this.client.send(SAAS_AUTH_PATTERNS.REFRESH, refreshToken),
    );
  }

  getProfile(userId: string) {
    return firstValueFrom(
      this.client.send(SAAS_USER_PATTERNS.GET_PROFILE, userId),
    );
  }
  updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return firstValueFrom(
      this.client.send(SAAS_USER_PATTERNS.UPDATE, {
        id: userId,
        ...updateUserDto,
      }),
    );
  }
  changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    return firstValueFrom(
      this.client.send(SAAS_AUTH_PATTERNS.CHANGE_PASSWORD, {
        id: userId,
        data: changePasswordDto,
      }),
    );
  }
  forgotPassword(dto: ForgotPasswordDto) {
    return firstValueFrom(
      this.client.send(SAAS_AUTH_PATTERNS.FORGOT_PASSWORD, dto),
    );
  }

  resetPassword(dto: ResetPasswordDto) {
    return firstValueFrom(
      this.client.send(SAAS_AUTH_PATTERNS.RESET_PASSWORD, dto),
    );
  }

  deleteAcount(userId: string) {
    return firstValueFrom(this.client.send(SAAS_USER_PATTERNS.DELETE, userId));
  }
  restoreAcount(loginDto: LoginDto) {
    return firstValueFrom(
      this.client.send(SAAS_USER_PATTERNS.RESTORE, loginDto),
    );
  }

  googleLogin(dto: GoogleAuthDto) {
    return firstValueFrom(
      this.client.send(SAAS_AUTH_PATTERNS.GOOGLE_AUTH, dto),
    );
  }
}
