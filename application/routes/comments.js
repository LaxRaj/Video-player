var express = require('express')
var router = express.Router();
var {isLoggedIn} = require("../middleware/auth")

router.post('/create' , isLoggedIn , function(req , res, next){
    
})

module.exports = router;