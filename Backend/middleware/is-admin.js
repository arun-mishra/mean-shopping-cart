const Admin = require('../models/admin')
module.exports = (req, res, next) => {
    Admin.findById(req.userId)
    .then(admin=>{
        if(!admin){
            console.log('testing2222')
            return req.session.destroy(err => {
                console.log(err);
                res.redirect('/');
              });
        }
        if(req.userId!==admin._id.toString() ){
            console.log('testing1111')
            return req.session.destroy(err => {
                console.log(err);
                res.redirect('/');
              });
        }
        next();
    })
    .catch(err=>{
        console.log(err)
    })
   
}