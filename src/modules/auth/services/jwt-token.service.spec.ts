import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  it('stores a revoked token for the access token lifetime in seconds', async () => {
    const redis = { set: jest.fn().mockResolvedValue('OK') };
    const service = new JwtTokenService(
      {} as JwtService,
      redis as unknown as Redis,
    );

    await service.revokeToken('access-token');

    expect(redis.set).toHaveBeenCalledWith(
      'bl:access-token',
      '1',
      'EX',
      900,
    );
  });
});
