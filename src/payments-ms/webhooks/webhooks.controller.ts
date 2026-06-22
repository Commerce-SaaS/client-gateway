import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { Request, Response } from 'express';
import { envs } from 'src/config';
import { SkipThrottle } from '@nestjs/throttler';

@ApiExcludeController()
@SkipThrottle()
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('platform')
  platformWebhook(@Req() req: Request, @Res() res: Response) {
    return this.webhooksService.handleStripeWebhook(
      req,
      res,
      envs.stripeWebhookSecret,
    );
  }

  @Post('connect')
  connectWebhook(@Req() req: Request, @Res() res: Response) {
    return this.webhooksService.handleStripeWebhook(
      req,
      res,
      envs.stripeConnectWebhookSecret,
    );
  }
}
