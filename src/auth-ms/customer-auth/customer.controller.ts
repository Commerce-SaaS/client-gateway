import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  BadRequestException,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AUTH_AUDIENCE_KEY, AuthSessionGuard } from 'src/common/guards/auth-session.guard';
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
import { ApiGoogleLogin } from '../shared/decorators/api-google-login.decorator';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { ApiDeleteMe } from '../shared/decorators/api-delete-me.decorator';
import { Jti } from 'src/common/decorators/jti.decorator';
import { ResendVerificationDto, VerifyEmailDto } from './dto/verify-email.dto';
import { ApiResendVerification } from '../shared/decorators/api-resend-verification.decorator';
import { ApiVerifyEmail } from '../shared/decorators/api-verify-email-response.decorator';
import { Tenant } from 'src/common/decorators/tenant-url.decorator';
import { TenantContext } from 'src/common/interfaces/tenant-context.interface';
import { ApiRequestEmailChange } from '../shared/decorators/api-request-email-change.decorator';
import { ApiConfirmEmailChange } from '../shared/decorators/api-confirm-email-change.decorator';
import { ChangeEmailRequestDto } from './dto/customer-change-email-request.dto';
import { ChangeEmailConfirmDto } from './dto/customer-change-email-confirm.dto';

@ApiTags('Auth - Customer')
@SetMetadata(AUTH_AUDIENCE_KEY, ['customer'])
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Auth customer module
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiRegisterCustomer()
  async register(
    @Body() dto: RegisterCustomerDto,
    @Tenant() tenant: TenantContext,
  ) {
    if (!tenant.organizationId) {
      throw new BadRequestException('Organization could not be resolved');
    }

    return this.customerService.register({
      ...dto,
      organizationId: tenant.organizationId,
      logoUrl: tenant.logoUrl,
      orgName: tenant.name,
    });
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiLoginUser()
  async login(
    @Body() loginDto: LoginDto,
    @OrganizationId() organizationId: string,
  ) {
    return await this.customerService.login({ ...loginDto, organizationId });
  }

  @UseGuards(AuthSessionGuard)
  @Post('logout')
  @ApiLogoutUser()
  async logout(@User() user: CurrentUserContext, @Jti() jti: string) {
    return this.customerService.logout(jti, user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Post('logout-all')
  @ApiLogoutAllUsers()
  async logoutAllSessions(@User() user: CurrentUserContext) {
    return this.customerService.logoutAll(user.id);
  }

  @Post('refresh')
  @ApiRefreshToken()
  refresh(@Body() dto: RefreshTokenDto) {
    return this.customerService.refreshToken(dto);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiForgotPassword()
  forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Tenant() tenant: TenantContext,
  ) {
    if (!tenant.organizationId) {
      throw new BadRequestException('Organization could not be resolved');
    }
    return this.customerService.forgotPassword({
      ...dto,
      organizationId: tenant.organizationId,
      logoUrl: tenant.logoUrl,
      orgName: tenant.name,
    });
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiResetPassword()
  resetPassword(
    @Body() dto: ResetPasswordDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.customerService.resetPassword({ ...dto, organizationId });
  }

  @Post('oauth/google')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiGoogleLogin()
  googleLogin(
    @Body() dto: GoogleAuthDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.customerService.googleLogin({ ...dto, organizationId });
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/password')
  @ApiChangeMyPassword()
  changePassword(
    @User() user: CurrentUserContext,
    @Jti() jti: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.customerService.changePassword(user.id, jti, changePasswordDto);
  }

  @Post('verify-email')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiVerifyEmail()
  verifyEmail(
    @Body() dto: VerifyEmailDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.customerService.verifyEmail({ ...dto, organizationId });
  }

  @Post('resend-verification')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiResendVerification()
  resendVerification(
    @Body() dto: ResendVerificationDto,
    @Tenant() tenant: TenantContext,
  ) {
    if (!tenant.organizationId) {
      throw new BadRequestException('Organization could not be resolved');
    }
    return this.customerService.resendVerification({
      ...dto,
      organizationId: tenant.organizationId,
      logoUrl: tenant.logoUrl,
      orgName: tenant.name,
    });
  }
  @UseGuards(AuthSessionGuard)
  @Post('me/change-email/request')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiRequestEmailChange()
  requestEmailChange(
    @User() user: CurrentUserContext,
    @Body() dto: ChangeEmailRequestDto,
    @Tenant() tenant: TenantContext,
  ) {
    if (!tenant.organizationId) {
      throw new BadRequestException('Organization could not be resolved');
    }
    return this.customerService.requestEmailChange(user.id, dto, {
      logoUrl: tenant.logoUrl,
      orgName: tenant.name,
    });
  }

  @UseGuards(AuthSessionGuard)
  @Post('me/change-email/confirm')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiConfirmEmailChange()
  confirmEmailChange(
    @User() user: CurrentUserContext,
    @Jti() jti: string,
    @Body() dto: ChangeEmailConfirmDto,
    @Tenant() tenant: TenantContext,
  ) {
    return this.customerService.confirmEmailChange(user.id, jti, dto, {
      logoUrl: tenant.logoUrl,
      orgName: tenant.name,
    });
  }


  // Customer module
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
    @OrganizationId() organizationId: string,
  ) {
    return this.customerService.updateProfile(
      user.id,
      updateUserDto,
      organizationId,
    );
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/deactivate')
  @ApiDeactivateMe()
  softDelete(@User() user: CurrentUserContext) {
    return this.customerService.softDeleteAcount(user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Patch('me/delete-account')
  @ApiDeleteMe()
  delete(@User() user: CurrentUserContext) {
    return this.customerService.delete(user.id);
  }

  @Patch('me/restore')
  @ApiReactivateMe()
  restoreUser(@Body() dto: LoginDto, @OrganizationId() organizationId: string) {
    return this.customerService.restoreAcount({ ...dto, organizationId });
  }
}
