var express = require('express');
const { isLoggedIn, isMyProfile, logout } = require('../middleware/auth');
const { getRecentPosts, getPostsForUserBy, getPostsById } = require('../middleware/posts')
var router = express.Router();

/* GET home page. */
router.get('/',getRecentPosts, function(req, res, next) {
  console.log(req.file)
  res.render('index', { title: 'CSC 317 App', name:"[Insert your name here]" });
});

router.get('/login', function(req,res) {
  res.render('login');
});

router.get('/registration', function(req,res) {
  res.render('registration');
});

router.get('/postvideo', function(req,res) {
  res.render("postvideo");
});

router.get('/profile',getPostsForUserBy ,  function(req,res) {
  res.render('profile');
});

router.get('/viewpost/:id(\\d+)', function(req,res) {
  res.render('login');
});

router.get("/logout" ,isLoggedIn, async function(req , res, next){
  if (req.session.user) {
    req.session.destroy()
    res.clearCookie('connect.sid') // clean up!
    // res.json({ msg: 'logging you out' });
    res.render('/')
  } else {
    return res.json({ msg: 'no user to log out!' })
  }

});

module.exports = router;
