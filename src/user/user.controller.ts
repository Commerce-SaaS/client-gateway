import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './guards/auth.guard';
import { Token } from './decorators/token.decorator';
import { User } from './decorators/user.decorator';
import { CurrentUser } from './interfaces/current-user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Token() token: string) {
    return this.userService.logout(token);
  }

  @UseGuards(AuthGuard)
  @Post('logout-all')
  async logoutAllSessions(@User() user: CurrentUser) {
    return this.userService.logoutAll({ id: user.userId });
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: { refreshToken: string }) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@User() user: CurrentUser) {
    return this.userService.getProfile(user);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  updateProfile(
    @User() user: CurrentUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(user, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('me/password')
  changePassword(
    @User() user: CurrentUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user, changePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.userService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.userService.resetPassword(token, password);
  }

  @UseGuards(AuthGuard)
  @Patch('me/deactivate')
  softDelete(@User() user: CurrentUser) {
    return this.userService.deleteAcount(user);
  }

  @Patch('me/restore')
  restoreUser(@Body() loginDto: LoginDto) {
    return this.userService.restoreAcount(loginDto);
  }
}
