import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { AuthEnum } from 'src/common/enums/auth/auth.enum';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock configuration
jest.mock('src/config/env.config', () => ({
  __esModule: true,
  default: () => ({
    jwtAccessSecret: 'test-secret',
  }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        username: 'testuser',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should hash password with correct salt rounds', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        password: 'securepassword',
        name: 'John Doe',
        username: 'johndoe',
      };

      const hashedPassword = 'hashedSecurePassword';
      const createdUser = {
        id: 2,
        email: 'user@example.com',
        name: 'John Doe',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      // Act
      await service.register(registerDto);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('securepassword', 10);
    });

    it('should handle database errors during registration', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        username: 'testuser',
      };

      const hashedPassword = 'hashedPassword123';
      const dbError = new Error('Database connection failed');

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('login', () => {
    it('should login user successfully and return access token', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const expectedResult = { accessToken };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: 1, email: 'test@example.com' },
        {
          secret: 'test-secret',
          expiresIn: AuthEnum.JWT_EXPIRES_IN,
        },
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        ExceptionMessage.INVALID_CREDENTIALS,
      );
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        ExceptionMessage.INVALID_CREDENTIALS,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword123',
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should generate JWT token with correct payload and options', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const user = {
        id: 2,
        email: 'user@example.com',
        name: 'John Doe',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accessToken = 'mock.jwt.token';

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      // Act
      await service.login(loginDto);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: 2, email: 'user@example.com' },
        {
          secret: 'test-secret',
          expiresIn: '15m',
        },
      );
    });

    it('should handle database errors during login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const dbError = new Error('Database connection failed');
      mockPrismaService.user.findUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle bcrypt comparison errors', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bcryptError = new Error('Bcrypt comparison failed');

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        'Bcrypt comparison failed',
      );
    });

    it('should handle JWT signing errors', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const jwtError = new Error('JWT signing failed');

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockRejectedValue(jwtError);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        'JWT signing failed',
      );
    });
  });
});
