export enum UserRole {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
  USER = 'User'
}

// Higher indexes have greater power, or explicit role hierarchy mapping
const roleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.EMPLOYEE]: 2,
  [UserRole.MANAGER]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.OWNER]: 5
};

export function hasRoleAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
