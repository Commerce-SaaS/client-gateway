import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/config';
import { ChangePasswordDto } from '../shared/dto/change-password.dto';
import { ForgotPasswordDto } from '../shared/dto/forgot-password.dto';
import { LoginDto } from '../shared/dto/login.dto';
import { RefreshTokenDto } from '../shared/dto/refresh-token.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { ResetPasswordDto } from '../shared/dto/reset-password.dto';
import { UpdateUserDto } from '../shared/dto/update-user.dto';
import { SESSION_PATTERNS } from '../shared/patterns/session_patterns';
import { CUSTOMER_AUTH_PATTERNS } from './patterns/customer-auth.patterns';
import { CUSTOMER_USER_PATTERNS } from '../customers/patterns/customer-user.patterns';
import { GoogleAuthDto } from '../shared/dto/google-auth.dto';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { RestoreCustomerDto } from './dto/restore-customer.dto';
import { ResendVerificationDto, VerifyEmailDto } from './dto/verify-email.dto';
import { ChangeEmailConfirmDto } from './dto/customer-change-email-confirm.dto';
import { ChangeEmailRequestDto } from './dto/customer-change-email-request.dto';

@Injectable()
export class CustomerService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  register(
    dto: RegisterCustomerDto & {
      organizationId: string;
      logoUrl?: string;
      orgName?: string;
    },
  ) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.REGISTER, dto);
  }

  login(loginDto: LoginDto & { organizationId: string }) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.LOGIN, loginDto);
  }

  logout(jti: string, userId: string) {
    return rpcSend(this.client, SESSION_PATTERNS.LOGOUT, { jti, userId });
  }

  logoutAll(userId: string) {
    return rpcSend(this.client, SESSION_PATTERNS.LOGOUT_ALL, userId);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return rpcSend(
      this.client,
      CUSTOMER_AUTH_PATTERNS.REFRESH,
      refreshTokenDto.refreshToken,
    );
  }

  getProfile(userId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.GET_PROFILE, userId);
  }

  updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    organizationId: string,
  ) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.UPDATE, {
      id: userId,
      organizationId,
      ...updateUserDto,
    });
  }

  changePassword(
    userId: string,
    jti: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.CHANGE_PASSWORD, {
      id: userId,
      jti,
      data: changePasswordDto,
    });
  }

  forgotPassword(
    dto: ForgotPasswordDto & {
      organizationId: string;
      logoUrl?: string;
      orgName?: string;
    },
  ) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.FORGOT_PASSWORD, dto);
  }

  resetPassword(dto: ResetPasswordDto & { organizationId: string }) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.RESET_PASSWORD, dto);
  }

  softDeleteAcount(userId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.SOFT_DELETE, userId);
  }

  restoreAcount(loginDto: RestoreCustomerDto) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.RESTORE, loginDto);
  }

  delete(userId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.DELETE, userId);
  }

  googleLogin(dto: GoogleAuthDto & { organizationId: string }) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.GOOGLE_AUTH, dto);
  }

  verifyEmail(dto: VerifyEmailDto & { organizationId: string }) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.VERIFY_EMAIL, dto);
  }

  resendVerification(
    dto: ResendVerificationDto & {
      organizationId: string;
      logoUrl?: string;
      orgName?: string;
    },
  ) {
    return rpcSend(
      this.client,
      CUSTOMER_AUTH_PATTERNS.RESEND_VERIFICATION,
      dto,
    );
  }

  requestEmailChange(
    userId: string,
    dto: ChangeEmailRequestDto,
    branding: { logoUrl?: string; orgName?: string },
  ) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.CHANGE_EMAIL_REQUEST, {
      id: userId,
      data: dto,
      logoUrl: branding.logoUrl,
      orgName: branding.orgName,
    });
  }

  confirmEmailChange(
    userId: string,
    jti: string,
    dto: ChangeEmailConfirmDto,
    branding: { logoUrl?: string; orgName?: string },
  ) {
    return rpcSend(this.client, CUSTOMER_AUTH_PATTERNS.CHANGE_EMAIL_CONFIRM, {
      id: userId,
      jti,
      data: dto,
      logoUrl: branding.logoUrl,
      orgName: branding.orgName,
    });
  }
}
