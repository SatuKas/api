import { Global, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService is a wrapper around PrismaClient to integrate with NestJS lifecycle.
 * This service ensures that the Prisma database connection is established
 * when the NestJS module is initialized.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Called automatically by NestJS when the module is initialized.
   * Ensures the Prisma client connects to the database at startup.
   */
  async onModuleInit() {
    await this.$connect();
  }
}
