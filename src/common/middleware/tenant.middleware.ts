import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { TenantContext } from '../interfaces/tenant-context.interface';
import { OrganizationDomainsService } from 'src/organization-ms/organization_domains/organization_domains.service';
import { OrganizationService } from 'src/organization-ms/organization/organization.service';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DOMAIN_CACHE_TTL = 300; // 5 minutes

interface OrgBranding {
  logoUrl?: string;
  name?: string;
}

interface ResolvedTenant extends OrgBranding {
  organizationId: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(
    private readonly orgDomainsService: OrganizationDomainsService,
    private readonly organizationService: OrganizationService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const frontendUrl =
      this.parseFrontendUrl(this.readHeader(req.headers.origin)) ??
      this.parseFrontendUrl(this.readHeader(req.headers.referer));

    const host = frontendUrl
      ? frontendUrl.hostname.toLowerCase()
      : req.headers.host?.split(':')[0]?.toLowerCase();

    const tenant: TenantContext = {
      source: 'none',
      url: frontendUrl?.origin,
    };

    // 1. Try x-organization-id header
    const headerId = req.headers['x-organization-id'] as string | undefined;
    if (headerId && UUID_REGEX.test(headerId)) {
      tenant.organizationId = headerId;
      tenant.source = 'header';

      // branding por id (best-effort, cacheado)
      const branding = await this.getOrgBranding(headerId);
      if (branding) {
        tenant.logoUrl = branding.logoUrl;
        tenant.name = branding.name;
      }
    }

    // 2. If no header, try domain resolution (web) — branding en el mismo lookup
    if (!tenant.organizationId && host) {
      this.logger.log(`Resolving tenant for host: ${host}`);
      try {
        const resolved = await this.resolveTenantByDomain(host);
        if (resolved) {
          tenant.organizationId = resolved.organizationId;
          tenant.logoUrl = resolved.logoUrl;
          tenant.name = resolved.name;
          tenant.source = 'domain';
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        this.logger.warn(`Domain resolution failed for ${host}: ${message}`);
      }
    }

    req['tenant'] = tenant;
    next();
  }

  private async resolveTenantByDomain(
    host: string,
  ): Promise<ResolvedTenant | undefined> {
    const cacheKey = `tenant:domain:${host}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as ResolvedTenant;

    // findOne ya devuelve plano: { organizationId, logoUrl, name } | null
    const result = await this.orgDomainsService.findOne(host);
    if (!result?.organizationId) return undefined;

    const data: ResolvedTenant = {
      organizationId: result.organizationId,
      logoUrl: result.logoUrl,
      name: result.name,
    };
    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      'EX',
      DOMAIN_CACHE_TTL,
    );
    return data;
  }

  private async getOrgBranding(
    orgId: string,
  ): Promise<OrgBranding | undefined> {
    try {
      const cacheKey = `tenant:org:${orgId}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached) as OrgBranding;

      const org = await this.organizationService.findOne(orgId);
      if (!org) return undefined;

      const branding: OrgBranding = { logoUrl: org.logoUrl, name: org.name };
      await this.redis.set(
        cacheKey,
        JSON.stringify(branding),
        'EX',
        DOMAIN_CACHE_TTL,
      );
      return branding;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.warn(`Branding load failed for ${orgId}: ${message}`);
      return undefined; // best-effort: nunca rompe el request
    }
  }

  private parseFrontendUrl(value: string | undefined): URL | undefined {
    if (!value) return undefined;

    try {
      return new URL(value);
    } catch {
      this.logger.warn(`Invalid frontend origin/referer received: ${value}`);
      return undefined;
    }
  }

  private readHeader(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }
}