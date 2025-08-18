import { prisma } from '../client/index.js';
import bcrypt from 'bcrypt';

export class UserService {
    static async findUsers(name) {
        await prisma.user.findMany({
            where: { 
                name: {
                    contains: name, // filter by name if provided
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: { id: "desc" }
        });
    }

    static async findById(id) {
       return await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true
            },
            where: { id: Number(id) }
        });
    }

    static async updateUser(id, userData) {
        const { name, password } = userData; 
        
        // hash password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        return await prisma.user.update({
            data: {
                name,
                password: hashedPassword,
            },
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    }

    static async deleteUser(id) {
        return await prisma.user.delete({
            where: { id: Number(id) }
        })
    }

    static async getAllUsers() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    }

}