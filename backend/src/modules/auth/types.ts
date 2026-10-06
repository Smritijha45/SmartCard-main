import { UserResponseDTO } from '../users/types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponseDTO;
  tokens: AuthTokens;
}
