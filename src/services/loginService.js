import { ApiResponse } from "../utils/custom-response/apiResponse.js";
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken, generateRefreshToken } from "../utils/tokens/token.js";
import { prisma } from "../client/index.js";
import bcrypt from 'bcrypt';


class LoginService {
    static async login(req, userData) {
        // logic to authenticate user
        const isMatch = await bcrypt.compare(req.body.password, userData.password);

        if (!isMatch) {
            throw new ApiResponse(401, "invalid credentials")
        }

        // generate session token
        const sessionId = uuidv4();
        const accessToken = generateAccessToken({ id: req.body.id })
        const refreshToken = generateRefreshToken({ id: req.body.id, sessionId })

        // store refresh token in db
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: req.body.id,
                sessionId
            }
        })

        const { password, ...userWithoutPassword } = userData;

        // send refresh token as http-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: 'Strict', // prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

         // return success response
        res.status(200).json({
            success: true,
            message: 'login successful',
            data: {
                user: userWithoutPassword,
                accessToken,
            }
        })

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
            throw new ApiResponse(404, 'user not found or password not provided')
        }

        return user;
    }
}

export default LoginService;
