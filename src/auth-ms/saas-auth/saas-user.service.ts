import { Inject, Injectable } from '@nestjs/common';
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
import { rpcSend } from 'src/common/utils/rpc.utils';
import { VerifyEmailDto } from '../shared/dto/verify-email.dto';
import { ResendVerificationDto } from '../shared/dto/resend-verification.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ClientInfo } from './decorators/client-info.decorator';
import { ChangeEmailRequestDto } from './dto/change-email-request.dto';
import { ChangeEmailConfirmDto } from './dto/change-email-confirm.dto';

@Injectable()
export class SaaSUserService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  register(registerUserDto: RegisterUserDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.REGISTER, registerUserDto);
  }

  verifyEmail(dto: VerifyEmailDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.VERIFY_EMAIL, dto);
  }

  resendVerification(dto: ResendVerificationDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.RESEND_VERIFICATION, dto);
  }

  login(loginDto: LoginDto, clientInfo: ClientInfo) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.LOGIN, {
      credentials: loginDto,
      clientInfo,
    });
  }

  refreshToken(refreshTokenDto: RefreshTokenDto, clientInfo: ClientInfo) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.REFRESH, {
      refreshToken: refreshTokenDto.refreshToken,
      clientInfo,
    });
  }

  googleLogin(dto: GoogleAuthDto, clientInfo: ClientInfo) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.GOOGLE_AUTH, {
      credentials: dto,
      clientInfo,
    });
  }

  logout(jti: string, userId: string) {
    return rpcSend(this.client, SESSION_PATTERNS.LOGOUT, { jti, userId });
  }

  logoutAll(id: string) {
    return rpcSend(this.client, SESSION_PATTERNS.LOGOUT_ALL, id);
  }

  getProfile(userId: string) {
    return rpcSend(this.client, SAAS_USER_PATTERNS.GET_PROFILE, userId);
  }

  updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return rpcSend(this.client, SAAS_USER_PATTERNS.UPDATE, {
      id: userId,
      ...updateUserDto,
    });
  }

  changePassword(userId: string, jti: string, dto: ChangePasswordDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.CHANGE_PASSWORD, {
      id: userId,
      jti,
      data: dto,
    });
  }

  deactivate(userId: string) {
    return rpcSend(this.client, SAAS_USER_PATTERNS.DEACTIVATE, userId);
  }

  restoreAcount(loginDto: LoginDto) {
    return rpcSend(this.client, SAAS_USER_PATTERNS.RESTORE, loginDto);
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.FORGOT_PASSWORD, dto);
  }

  resetPassword(dto: ResetPasswordDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.RESET_PASSWORD, dto);
  }

  listSessions(userId: string, currentJti: string) {
    return rpcSend(this.client, SESSION_PATTERNS.LIST, { userId, currentJti });
  }

  revokeSession(userId: string, jti: string) {
    return rpcSend(this.client, SESSION_PATTERNS.REVOKE, { userId, jti });
  }

  requestEmailChange(userId: string, dto: ChangeEmailRequestDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.CHANGE_EMAIL_REQUEST, {
      id: userId,
      data: dto,
    });
  }

  confirmEmailChange(userId: string, jti: string, dto: ChangeEmailConfirmDto) {
    return rpcSend(this.client, SAAS_AUTH_PATTERNS.CHANGE_EMAIL_CONFIRM, {
      id: userId,
      jti,
      data: dto,
    });
  }
}
