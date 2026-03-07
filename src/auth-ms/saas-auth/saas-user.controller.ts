import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';

import { RegisterUserDto } from '../shared/dto/register-user.dto';
import { LoginDto } from '../shared/dto/login.dto';
import { UpdateUserDto } from '../shared/dto/update-user.dto';
import { ChangePasswordDto } from '../shared/dto/change-password.dto';
import { AuthSessionGuard } from 'src/common/guards/auth-session.guard';
import { Token } from 'src/common/decorators/token.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ApiRegisterUser } from '../shared/decorators/api-register-user.decorator';
import { ApiLoginUser } from '../shared/decorators/api-login-user.decorator';
import { ApiLogoutUser } from '../shared/decorators/api-logout-user.decorator';
import { ApiLogoutAllUsers } from '../shared/decorators/api-logout-all-users.decorator';
import { ApiRefreshToken } from '../shared/decorators/api-refresh-token.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
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
import { GoogleAuthDto } from '../shared/dto/google-auth.dto';

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

@Controller('saas/users')
export class SaaSUserController {
  constructor(private readonly saaSUserService: SaaSUserService) {}

  @Post('register')
  @ApiRegisterUser()
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.saaSUserService.register(registerUserDto);
  }

  @Post('login')
  @ApiLoginUser()
  async login(@Body() loginDto: LoginDto) {
    return this.saaSUserService.login(loginDto);
  }

  @UseGuards(AuthSessionGuard)
  @Post('logout')
  @ApiLogoutUser()
  async logout(@Token() token: string) {
    return this.saaSUserService.logout(token);
  }

  @UseGuards(AuthSessionGuard)
  @Post('logout-all')
  @ApiLogoutAllUsers()
  async logoutAllSessions(@User() user: CurrentUserContext) {
    return this.saaSUserService.logoutAll(user.id);
  }

  @Post('refresh')
  @ApiRefreshToken()
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.saaSUserService.refreshToken(refreshTokenDto);
  }

  @UseGuards(AuthSessionGuard)
  @Get('me')
  @ApiGetMe()
  getProfile(@User() user: CurrentUserContext) {
    return this.saaSUserService.getProfile(user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me')
  @ApiUpdateMe()
  updateProfile(
    @User() user: CurrentUserContext,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.saaSUserService.updateProfile(user.id, updateUserDto);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/password')
  @ApiChangeMyPassword()
  changePassword(
    @User() user: CurrentUserContext,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.saaSUserService.changePassword(user.id, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiForgotPassword()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.saaSUserService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiResetPassword()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.saaSUserService.resetPassword(dto);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/deactivate')
  @ApiDeactivateMe()
  softDelete(@User() user: CurrentUserContext) {
    return this.saaSUserService.deleteAcount(user.id);
  }

  // @Delete('me')
  // @ApiDeleteMe()
  // delete(@Body() dto: any) {
  //   return this.customerService.delete(dto);
  // }

  @Patch('me/restore')
  @ApiReactivateMe()
  restoreUser(@Body() loginDto: LoginDto) {
    return this.saaSUserService.restoreAcount(loginDto);
  }

  // @Patch('email')
  // @ApiReactivateMe()
  // updateEmail(@Body() dto: any) {
  //   return this.customerService.updateEmail(dto);
  // }

  // @Patch('email/verify')
  // @ApiReactivateMe()
  // verifyEmail(@Body() dto: any) {
  //   return this.customerService.verifyEmail(loginDto);
  // }

  // @Patch('email/resend-verification')
  // @ApiReactivateMe()
  // resendVerificationEmail(@Body() dto: any) {
  //   return this.customerService.resendVerificationEmail(loginDto);
  // }

  @Post('oauth/google')
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.saaSUserService.googleLogin(dto);
  }
}
