export interface UserResponse {
  id: string;
  email: string;
  name: string;
  username: string;
  is_verified: boolean;
  verified_at: Date | null;
  created_at: Date;
}
