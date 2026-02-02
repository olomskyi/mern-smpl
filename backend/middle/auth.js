
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // If there is no token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    // If token is invalid
    if (err) {
        return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

export default authenticateToken;