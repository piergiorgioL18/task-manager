import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TasksService {

    private prisma = new PrismaClient();

    async create(userId: number, data: any) {
        return this.prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async findAll(userId: number, filters?: any) {
        return this.prisma.task.findMany({
            where: { userId, ...filters },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number, userId: number) {
        return this.prisma.task.findFirst({
            where: { id, userId },
        });
    }

    async update(id: number, userId: number, data: any) {
        return this.prisma.task.updateMany({
            where: { id, userId },
            data,
        });
    }

    async remove(id: number, userId: number) {
        return this.prisma.task.deleteMany({
            where: { id, userId },
        });
    }
}
