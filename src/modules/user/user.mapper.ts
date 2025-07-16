import { User } from '@prisma/client';
import { UserResponse } from './user.interface';

export class UserMapper {
  toResponse(user: Omit<User, 'updatedAt'>): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      is_verified: user.isVerified,
      verified_at: user.verifiedAt,
      created_at: user.createdAt,
    };
  }
}
