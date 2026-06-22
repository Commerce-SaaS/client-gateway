export type TenantSource = 'domain' | 'header' | 'none';

export interface TenantContext {
  url?: string;
  organizationId?: string;
  logoUrl?: string;
  name?: string;
  source: TenantSource;
}
