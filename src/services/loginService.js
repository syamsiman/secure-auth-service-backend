import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken, generateRefreshToken } from "../utils/tokens/token.js";
import { prisma } from "../client/index.js";
import bcrypt from 'bcrypt';
import { ErrorResponse } from "../utils/custom-response/ErrorResponse.js";


class LoginService {
    static async login(req, userData) {
        // logic to authenticate user
        const isMatch = await bcrypt.compare(req.body.password, userData.password);

        if (!isMatch) {
            throw new ErrorResponse(401, "invalid credentials")
        }

        // generate session token
        const sessionId = uuidv4();
        const accessToken = generateAccessToken({ id: userData.id })
        const refreshToken = generateRefreshToken({ id: userData.id, sessionId })

        // store refresh token in db
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: userData.id,
                sessionId
            }
        })

        const { password, ...userWithoutPassword } = userData;

        return {
            refreshToken, 
            accessToken,
            userWithoutPassword
        }
    }

    static async validateUser(email) {
        // logic to check if user email exists
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        })

        if (!user || !user.password) {
            throw new ErrorResponse(404, 'invalid credentials')
        }

        return user;
    }
}

export default LoginService;
