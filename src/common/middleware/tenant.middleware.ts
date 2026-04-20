import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { OrganizationDomainsService } from 'src/organization-ms/organization_domains/organization_domains.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly orgService: OrganizationDomainsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let organizationId: string | undefined;

    const urls = ['/saas/users/register', '/saas/users/login'];
    const mobile = req.headers['x-client-type'] === 'mobile';
    const path = req.originalUrl.toLowerCase();
    const host = req.headers.host?.split(':')[0].toLowerCase();

    if (urls.includes(path) && mobile) {
      req['organizationId'] = organizationId;
      return next();
    }

    if (!organizationId) {
      const headerId = req.headers['x-organization-id'] as string;

      if (headerId) {
        organizationId = headerId;
      }
      return next();
    }

    if (host && !organizationId) {
      const org = await this.orgService.findOne(host);
      organizationId = org?.organizationId;
    }

    if (!organizationId) {
      return res.status(400).json({
        message: 'Organization could not be resolved',
      });
    }

    req['organizationId'] = organizationId;
    next();
  }
}
