import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma = new PrismaClient();

  async getHealth() {
    await this.prisma.$connect();
    return { status: 'ok', database: 'connected', timestamp: new Date() };
  }
}