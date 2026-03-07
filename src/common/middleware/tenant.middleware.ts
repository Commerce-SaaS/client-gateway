import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { OrganizationDomainsService } from 'src/organization-ms/organization_domains/organization_domains.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly orgService: OrganizationDomainsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let organizationId: string | undefined;

    const host = req.headers.host?.split(':')[0].toLowerCase();

    if (host) {
      const org = await this.orgService.findOne(host);
      organizationId = org?.organizationId;
    }

    if (!organizationId) {
      const headerId = req.headers['x-organization-id'] as string;
      if (!headerId) {
        return res.status(400).json({ message: 'Organization ID required' });
      }
      organizationId = headerId;
    }

    req['organizationId'] = organizationId;
    next();
  }
}
