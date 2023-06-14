var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
require('dotenv').config();
var{ isLoggedIn, isMyProfile} = require("../middleware/auth");

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
        let [rows , fields] = await db.query(`select * from users;`);
        res.status(200).json({rows , fields});
    }
    catch(error){
        next(error);
    }

    // db.query('select * from users;' , function(error, rows){
    //     if(error){
    //         next(error);
    //     }
    //     res.status(200).json({rows});
    // });
//   res.send('respond with a resource');
});

router.post('/registration', async  function(req,res,next) {
  var {username,email,password} = req.body;

  try{
      var [rows, fields] = await db.execute(`select id from users where username=?;` , [username]);
      if(rows && rows.length > 0){
        return res.redirect('/login');
      }
      var [rows, fields] = await db.execute(`select id from users where email=?;` , [email]);
      if(rows && rows.length > 0){
        return res.redirect('/login');
      }
      var hashedPassword = await bcrypt.hash(password , 3);

      var [resultObject, fields] = await db.query(`INSERT INTO users 
      (username,email,password)
      value
      (?,?,?);` , [username,email,hashedPassword]);

      if (resultObject && resultObject.affectedRows == 1){
        return res.redirect("/login");
      } 
      else {
        return res.redirect("/registration");
      }

    console.log(resultObject)
      
    res.end
  }catch(error){
    next(error);
  }

  console.log(req.body);
  res.end();
  next;
}) ;

router.post('/login', async function(req,res,next){
    const { username , password } = req.body ;
    if ( !username || !password) {
        return res.redirect("/login");
    } else {
        var[rows , fields] = await db.execute(`select id,username,password,email from  users where username=? ;` , [username]);
         var user = rows[0];
            if (!user) {
                req.flash("error" , `Log In Failed password/username Incorrect`);
                return res.redirect("/login");
            }
            else {
                var passwordsMatch = await bcrypt.compare(password,user.password);
                if (passwordsMatch){
                    req.session.user = {
                        userId : user.id,
                        email : user.email,
                        username : user.username 
                    };
                    req.flash("success" , `You are logged in.`)
                    return res.redirect("/");
                }
                else {
                    return res.redirect("/login");
                }
            }
    }
  console.log(req.body);
  res.end;
});

router.use(function(req, res , next){
    if (req.session.user){
        next();
    } else {
        return res.redirect("/login")
    }
});

// router.use("/profile/:id(\\d+)", isMyProfile)
router.get("/profile/:id(\\d+)", isMyProfile, function(req , res){
    res.render("");
})
router.get("/save", function(req, res, next){
  console.log(req);
  console.log("reached save.");
  res.end();
});

router.post("/logout" ,isLoggedIn, async function(req , res, next){
        if (req.session.user) {
          req.session.destroy()
          res.clearCookie('connect.sid') // clean up!
          return res.json({ msg: 'logging you out' });
        } else {
          return res.json({ msg: 'no user to log out!' })
        }
      });
 
module.exports = router;