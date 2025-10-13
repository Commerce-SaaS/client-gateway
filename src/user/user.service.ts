import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/config';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './interfaces/current-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AUTH_PATTERNS } from './patterns/auth_patterns';
import { SESSION_PATTERNS } from './patterns/session_patterns';
import { USER_PATTERNS } from './patterns/user_patterns';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  register(registerUserDto: RegisterUserDto) {
    return firstValueFrom(
      this.client.send(AUTH_PATTERNS.REGISTER_USER, registerUserDto),
    );
  }
  login(loginDto: LoginDto) {
    return firstValueFrom(this.client.send(AUTH_PATTERNS.LOGIN, loginDto));
  }
  logout(token: string) {
    return firstValueFrom(this.client.send(SESSION_PATTERNS.LOGOUT, token));
  }
  logoutAll(id: { id: string }) {
    return firstValueFrom(this.client.send(SESSION_PATTERNS.LOGOUT_ALL, id));
  }
  refreshToken(refreshTokenDto: { refreshToken: string }) {
    const { refreshToken } = refreshTokenDto;
    return firstValueFrom(
      this.client.send(AUTH_PATTERNS.REFRESH, refreshToken),
    );
  }
  getProfile(user: CurrentUser) {
    return firstValueFrom(
      this.client.send(USER_PATTERNS.GET_PROFILE, { id: user.userId }),
    );
  }
  updateProfile(user: CurrentUser, updateUserDto: UpdateUserDto) {
    return firstValueFrom(
      this.client.send(USER_PATTERNS.UPDATE_USER, {
        id: user.userId,
        ...updateUserDto,
      }),
    );
  }
  changePassword(user: CurrentUser, changePasswordDto: ChangePasswordDto) {
    return firstValueFrom(
      this.client.send(AUTH_PATTERNS.CHANGE_PASSWORD, {
        id: user.userId,
        email: user.email,
        data: changePasswordDto,
      }),
    );
  }
  forgotPassword(email: string) {
    return firstValueFrom(
      this.client.send(AUTH_PATTERNS.FORGOT_PASSWORD, { email }),
    );
  }

  resetPassword(token: string, password: string) {
    return firstValueFrom(
      this.client.send(AUTH_PATTERNS.RESET_PASSWORD, { token, password }),
    );
  }
  
  deleteAcount(user: CurrentUser) {
    return firstValueFrom(
      this.client.send(USER_PATTERNS.DELETE_USER, user.userId),
    );
  }
  restoreAcount(loginDto: LoginDto) {
    return firstValueFrom(
      this.client.send(USER_PATTERNS.RESTORE_USER, loginDto),
    );
  }
}
