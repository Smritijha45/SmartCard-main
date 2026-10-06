export interface CompanyResponseDTO {
  id: string;
  name: string;
  domain?: string;
  ownerId: string;
  subscriptionPlan: 'Free' | 'Pro' | 'Enterprise';
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toCompanyResponseDTO(company: any): CompanyResponseDTO {
  return {
    id: company._id.toString(),
    name: company.name,
    domain: company.domain,
    ownerId: company.ownerId.toString(),
    subscriptionPlan: company.subscriptionPlan,
    isSuspended: company.isSuspended,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}
export interface TeamMemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
}
