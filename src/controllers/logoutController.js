export const logout = async (req, res, next) => {
    // verify user is authenticated
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'No refresh token provided'
        });
    }

    try {
         // delete the refresh token from the database
        await prisma.refreshToken.deleteMany({
            where: { userId: req.userId }
        })

        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            sameSite: 'Lax', 
            secure: process.env.NODE_ENV === 'production'
         });

        // send success response
        res.status(200).json({
            success: true,
            message: 'logout successful'
        })
    } catch (error) {
        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            sameSite: 'Lax', 
            secure: process.env.NODE_ENV === 'production'
         });
        res.status(500).json({
            success: false,
            message: 'logout failed',
            error: error.message
        })

        next(error)
    }
}