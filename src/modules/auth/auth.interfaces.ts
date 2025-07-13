export interface JwtTokenPayload {
  sub: string;
  email: string;
  device_id: string;
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

export interface LoginResponse {
  id: string;
  token: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RegisterResponse extends LoginResponse {}

export interface JwtTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  hashed_refresh_token: string;
}

export interface RefreshTokenResponse {
  token: {
    access_token: string;
    refresh_token: string;
  };
}
