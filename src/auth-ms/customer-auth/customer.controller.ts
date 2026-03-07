import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthSessionGuard } from 'src/common/guards/auth-session.guard';
import { Token } from 'src/common/decorators/token.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { ApiChangeMyPassword } from '../shared/decorators/api-change-my-password.decorator';
import { ApiDeactivateMe } from '../shared/decorators/api-deactivate-me.decorator';
import { ApiForgotPassword } from '../shared/decorators/api-forgot-password.decorator';
import { ApiGetMe } from '../shared/decorators/api-get-user.decorator';
import { ApiLoginUser } from '../shared/decorators/api-login-user.decorator';
import { ApiLogoutAllUsers } from '../shared/decorators/api-logout-all-users.decorator';
import { ApiLogoutUser } from '../shared/decorators/api-logout-user.decorator';
import { ApiReactivateMe } from '../shared/decorators/api-reactivate-me.decorator';
import { ApiRefreshToken } from '../shared/decorators/api-refresh-token.decorator';
import { ApiResetPassword } from '../shared/decorators/api-reset-password.decorator';
import { ApiUpdateMe } from '../shared/decorators/api-update-me.decorator';
import { ChangePasswordDto } from '../shared/dto/change-password.dto';
import { ForgotPasswordDto } from '../shared/dto/forgot-password.dto';
import { LoginDto } from '../shared/dto/login.dto';
import { RefreshTokenDto } from '../shared/dto/refresh-token.dto';
import { ResetPasswordDto } from '../shared/dto/reset-password.dto';
import { UpdateUserDto } from '../shared/dto/update-user.dto';
import { CustomerService } from './customer.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { ApiRegisterCustomer } from './decorators/api-register-customer.decorator';
import { GoogleAuthDto } from '../shared/dto/google-auth.dto';

/**
 * Customer Authentication Controller
 *
 * Responsible for authentication and account management of end customers
 * belonging to tenant organizations (e.g., restaurant clients).
 *
 * ⚠ This controller does NOT handle SaaS platform users
 * (organization owners, staff, admins).
 * SaaS user authentication is implemented separately under:
 * /auth-ms/saas-auth
 *
 * Domain boundary:
 * - This module belongs to the Customer Identity domain.
 * - Each customer is scoped to a specific organization (tenant).
 * - SaaS identities are isolated in their own bounded context.
 * * - Customer identities are tenant-scoped and cannot access SaaS resources.
 */

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  @ApiRegisterCustomer()
  register(@Body() dto: RegisterCustomerDto) {
    return this.customerService.register(dto);
  }

  @Post('login')
  @ApiLoginUser()
  async login(@Body() loginDto: LoginDto) {
    return this.customerService.login(loginDto);
  }

  @UseGuards(AuthSessionGuard)
  @Post('logout')
  @ApiLogoutUser()
  async logout(@Token() token: string) {
    return this.customerService.logout(token);
  }

  @UseGuards(AuthSessionGuard)
  @Post('logout-all')
  @ApiLogoutAllUsers()
  async logoutAllSessions(@User() user: CurrentUserContext) {
    return this.customerService.logoutAll(user.id);
  }

  @Post('refresh')
  @ApiRefreshToken()
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.customerService.refreshToken(refreshTokenDto);
  }

  @UseGuards(AuthSessionGuard)
  @Get('me')
  @ApiGetMe()
  getProfile(@User() user: CurrentUserContext) {
    return this.customerService.getProfile(user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me')
  @ApiUpdateMe()
  updateProfile(
    @User() user: CurrentUserContext,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.customerService.updateProfile(user.id, updateUserDto);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/password')
  @ApiChangeMyPassword()
  changePassword(
    @User() user: CurrentUserContext,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.customerService.changePassword(user.id, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiForgotPassword()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.customerService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiResetPassword()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.customerService.resetPassword(dto);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/deactivate')
  @ApiDeactivateMe()
  softDelete(@User() user: CurrentUserContext) {
    return this.customerService.deleteAcount(user.id);
  }

  // @Delete('me')
  // @ApiDeleteMe()
  // delete(@Body() dto: any) {
  //   return this.customerService.delete(dto);
  // }

  @Patch('me/restore')
  @ApiReactivateMe()
  restoreUser(@Body() loginDto: LoginDto) {
    return this.customerService.restoreAcount(loginDto);
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
      return this.customerService.googleLogin(dto);
    }
}
