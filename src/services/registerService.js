import bcrypt from 'bcrypt'
import { prisma } from '../client/index.js';

export default class RegisterService {
    static async validateUser(userData) {
        return await prisma.user.findUnique({
            where: { email: userData.email }
        })

    }

    static async createUser(userData) {
        const  hashedPassword = await bcrypt.hash(userData.password, 10)

        const user = await prisma.user.create({
            data : {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
            }
    });

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }
}