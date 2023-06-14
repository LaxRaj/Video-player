var express = require('express')
var router = express.Router();
var db = require("../conf/database");
var multer = require('multer');
const { isLoggedIn } = require('../middleware/auth');
const { makeThumbnail } = require('../middleware/posts');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "conf/video");
    },
    filename : function (req , file , cb) {
        // video => mp4
        var fileExt = file.mimetype.split("/")[1]; 
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null , `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    }
});

    const  upload = multer({storage: storage});




router.post("/create",isLoggedIn, upload.single("uploadvideo"),makeThumbnail, async function (req , res , next){
    var {title, description} = req.body;
    
    var {path , thumbnail } =req.file;
    var { userId } = req.session.user;
        try {
            var [insertResult , _] = await db.execute(
                `insert into posts (title,description,video,thumbnail,fk_userid)
                value (?,?,?,?,?);` , [title,description,path,thumbnail,userId]
            );
            if(insertResult && insertResult.affectedRows) {
                req.flash("success" , "your post was created!");
                return req.session.save(function(error){
                    if(error) next(error);
                    return res.redirect("/");
                })
            }
        }
        catch(error){
            next(error);
        }

}

);

router.get("/create", function (req , res , next){});
router.delete("/create", function (req , res , next){});
router.put("/create", function (req , res , next){});
router.patch("/create", function (req , res , next){});  


router.get("/search" , async function( req, res, next){
    var {searchValue} = req.body;
    try{
        var [rows , fields] = await db.execute(` select id,title,thumbnail, concat_ws(' ', title, description) as haystack
        from posts
        having haystack like ?;` , [`%${searchValue}%`]);
        if (rows && rows.length == 0){
            res.render("index");
            
        } else {
            res.locals.posts = rows;
            return res.render('index');
        }
    }catch(error) {
        next(error);
    }
})


module.exports = router;