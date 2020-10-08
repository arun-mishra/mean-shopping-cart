const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    const authHeader =req.get('Authorization');
    if(!authHeader){
        const error = new Error('Authentication Failed!!!')
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'#ighlySecureToken');
        
        //req.userData = {email:decodedToken.email, userId: decodedToken.userId}
    }
    catch(error){
    res.status(401).json({message:"Authentication Failed !!!"});
    }
    if(!decodedToken){
        res.status(401).json('Authentication Failed !!!')
        const error = new Error('Authentication Failed!!!')
        throw error;
    }
    req.decodedToken = decodedToken
    req.adminId = decodedToken.adminId;
    next();
};
