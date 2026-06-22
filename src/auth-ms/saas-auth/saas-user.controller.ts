import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Delete,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { RegisterUserDto } from '../shared/dto/register-user.dto';
import { LoginDto } from '../shared/dto/login.dto';
import { UpdateUserDto } from '../shared/dto/update-user.dto';
import { ChangePasswordDto } from '../shared/dto/change-password.dto';
import { AUTH_AUDIENCE_KEY, AuthSessionGuard } from 'src/common/guards/auth-session.guard';
import { User } from 'src/common/decorators/user.decorator';
import { ApiRegisterUser } from '../shared/decorators/api-register-user.decorator';
import { ApiLoginUser } from '../shared/decorators/api-login-user.decorator';
import { ApiLogoutUser } from '../shared/decorators/api-logout-user.decorator';
import { ApiLogoutAllUsers } from '../shared/decorators/api-logout-all-users.decorator';
import { ApiRefreshToken } from '../shared/decorators/api-refresh-token.decorator';
import { AuthenticatedUser } from 'src/common/interfaces/current-user-context.type';
import { RefreshTokenDto } from '../shared/dto/refresh-token.dto';
import { ApiGetMe } from '../shared/decorators/api-get-user.decorator';
import { ApiUpdateMe } from '../shared/decorators/api-update-me.decorator';
import { ApiChangeMyPassword } from '../shared/decorators/api-change-my-password.decorator';
import { ForgotPasswordDto } from '../shared/dto/forgot-password.dto';
import { ApiForgotPassword } from '../shared/decorators/api-forgot-password.decorator';
import { ResetPasswordDto } from '../shared/dto/reset-password.dto';
import { ApiResetPassword } from '../shared/decorators/api-reset-password.decorator';
import { ApiDeactivateMe } from '../shared/decorators/api-deactivate-me.decorator';
import { ApiReactivateMe } from '../shared/decorators/api-reactivate-me.decorator';
import { SaaSUserService } from './saas-user.service';
import { ApiGoogleLogin } from '../shared/decorators/api-google-login.decorator';
import { VerifyEmailDto } from '../shared/dto/verify-email.dto';
import { ApiVerifyEmail } from '../shared/decorators/api-verify-email-response.decorator';
import { ResendVerificationDto } from '../shared/dto/resend-verification.dto';
import { ApiResendVerification } from '../shared/decorators/api-resend-verification.decorator';
import { Jti } from 'src/common/decorators/jti.decorator';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ClientInfo } from './decorators/client-info.decorator';
import { ApiListSessions } from '../shared/decorators/api-list-sessions.decorator';
import { ApiRevokeSession } from '../shared/decorators/api-revoke-session.decorator';
import { ChangeEmailConfirmDto } from './dto/change-email-confirm.dto';
import { ChangeEmailRequestDto } from './dto/change-email-request.dto';
import { ApiRequestEmailChange } from '../shared/decorators/api-request-email-change.decorator';
import { ApiConfirmEmailChange } from '../shared/decorators/api-confirm-email-change.decorator';

/**
 * SaaS User Authentication Controller
 *
 * Responsible for authentication and account management of SaaS users
 * (e.g., organization owners, staff members).
 *
 * ⚠ This controller does NOT handle end customers of tenant organizations.
 * Customer authentication is implemented in a separate bounded context:
 * /auth-ms/customer
 *
 * Domain boundary:
 * - This module belongs to the SaaS identity domain.
 * - Customer identities are isolated in their own domain.
 */

@ApiTags('Auth - SaaS')
@SetMetadata(AUTH_AUDIENCE_KEY, ['saas'])
@Controller('saas')
export class SaaSUserController {
  constructor(private readonly saaSUserService: SaaSUserService) {}

  @Post('users/register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiRegisterUser()
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.saaSUserService.register(registerUserDto);
  }

  @Post('users/verify-email')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiVerifyEmail()
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.saaSUserService.verifyEmail(dto);
  }

  @Post('users/resend-verification')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiResendVerification()
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.saaSUserService.resendVerification(dto);
  }

  @Post('users/login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiLoginUser()
  async login(
    @Body() loginDto: LoginDto,
    @ClientInfo() clientInfo: ClientInfo,
  ) {
    return this.saaSUserService.login(loginDto, clientInfo);
  }

  @Post('users/refresh')
  @ApiRefreshToken()
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @ClientInfo() clientInfo: ClientInfo,
  ) {
    return this.saaSUserService.refreshToken(refreshTokenDto, clientInfo);
  }

  @UseGuards(AuthSessionGuard)
  @Post('users/logout')
  @ApiLogoutUser()
  async logout(@User() user: AuthenticatedUser, @Jti() jti: string) {
    return this.saaSUserService.logout(jti, user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Post('users/logout-all')
  @ApiLogoutAllUsers()
  async logoutAllSessions(@User() user: AuthenticatedUser) {
    return this.saaSUserService.logoutAll(user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Get('users/me')
  @ApiGetMe()
  getProfile(@User() user: AuthenticatedUser) {
    return this.saaSUserService.getProfile(user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('users/me')
  @ApiUpdateMe()
  updateProfile(
    @User() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.saaSUserService.updateProfile(user.id, updateUserDto);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('users/me/password')
  @ApiChangeMyPassword()
  changePassword(
    @User() user: AuthenticatedUser,
    @Jti() jti: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.saaSUserService.changePassword(user.id, jti, dto);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('users/me/deactivate')
  @ApiDeactivateMe()
  softDelete(@User() user: AuthenticatedUser) {
    return this.saaSUserService.deactivate(user.id);
  }

  @Patch('users/me/restore')
  @ApiReactivateMe()
  restoreUser(@Body() loginDto: LoginDto) {
    return this.saaSUserService.restoreAcount(loginDto);
  }

  @Post('users/forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiForgotPassword()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.saaSUserService.forgotPassword(dto);
  }

  @Post('users/reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiResetPassword()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.saaSUserService.resetPassword(dto);
  }

  @Post('users/oauth/google')
  @ApiGoogleLogin()
  async googleLogin(
    @Body() dto: GoogleAuthDto,
    @ClientInfo() clientInfo: ClientInfo,
  ) {
    return this.saaSUserService.googleLogin(dto, clientInfo);
  }

  @UseGuards(AuthSessionGuard)
  @Get('users/me/sessions')
  @ApiListSessions()
  listSessions(@User() user: AuthenticatedUser, @Jti() jti: string) {
    return this.saaSUserService.listSessions(user.id, jti);
  }

  @UseGuards(AuthSessionGuard)
  @Delete('users/me/sessions/:jti')
  @ApiRevokeSession()
  revokeSession(@User() user: AuthenticatedUser, @Param('jti') jti: string) {
    return this.saaSUserService.revokeSession(user.id, jti);
  }

  @UseGuards(AuthSessionGuard)
  @Post('users/me/change-email/request')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiRequestEmailChange()
  requestEmailChange(
    @User() user: AuthenticatedUser,
    @Body() dto: ChangeEmailRequestDto,
  ) {
    return this.saaSUserService.requestEmailChange(user.id, dto);
  }

  @UseGuards(AuthSessionGuard)
  @Post('users/me/change-email/confirm')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiConfirmEmailChange()
  confirmEmailChange(
    @User() user: AuthenticatedUser,
    @Jti() jti: string,
    @Body() dto: ChangeEmailConfirmDto,
  ) {
    return this.saaSUserService.confirmEmailChange(user.id, jti, dto);
  }
}
