import { UserRole } from '../../constants/roles';

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export function toUserResponseDTO(user: any): UserResponseDTO {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId ? user.companyId.toString() : undefined,
    profilePhoto: user.profilePhoto,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
