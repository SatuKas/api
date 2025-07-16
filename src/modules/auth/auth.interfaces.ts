import { AuthJwtType } from 'src/common/enums/auth/auth.enum';

export interface JwtTokenPayload {
  sub: string;
  email: string;
  device_id: string;
  type?: AuthJwtType;
}

export interface LogoutPayload {
  device_id: string;
  user_id?: string;
}

export interface RegisterAuthDevicePayload {
  id: string;
  user_id: string;
  user_agent: string;
  ip_address: string;
  refresh_token: string;
}

export interface UpdateAuthDevicePayload {
  id: string;
  refresh_token: string | null;
  is_revoked?: boolean;
}

export interface TokenBaseResponse {
  token: {
    access_token: string;
    refresh_token: string;
  };
  expires: {
    access_token: number;
    refresh_token: number;
  };
}

export interface LoginResponse extends TokenBaseResponse {
  id: string;
  device: string;
}

export interface RegisterResponse extends LoginResponse {}

export interface JwtTokenResponse extends TokenBaseResponse {
  hashed_refresh_token: string;
}

export interface RefreshTokenResponse extends TokenBaseResponse {}
