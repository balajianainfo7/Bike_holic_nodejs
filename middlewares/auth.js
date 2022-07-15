const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.status(401);

    jwt.verify(token, "Snippet_SceretKey", (err, user) => {
       if(err) return res.status(403);
       req.user = user;
       next();
    });
}

function generateAccessToken(email){
    return jwt.sign({data: email}, "Snippet_SceretKey", {
        expiresIn: "1h",
    });
}

module.exports = {
    authenticateToken,
    generateAccessToken,
};