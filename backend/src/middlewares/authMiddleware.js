import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.sendStatus(401); // If no token, return unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Return forbidden if token is invalid
        }

        req.user = user; // Attach the user payload to the request
        next(); // Proceed to the next middleware or route handler
    });
};

export default authenticateToken;
