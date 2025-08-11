import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // get token
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({message: 'unauthorized'})

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({message: 'invalid token'})
        req.userId = decoded.id;
        next();
    })
}