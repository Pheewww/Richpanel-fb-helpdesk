


import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    console.log('TOKEN', token);

  

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send("Invalid Token");
                console.log(err);
            }
            req.user = decoded; 
            console.log('INSIDE jwt verify', req.user);

            next(); 
        });
    };



export default verifyToken;

