var pathToFFMPEG = require("ffmpeg-static");
var exec = require("child_process").exec;
var db = require("../conf/database");
const { error, log } = require("console");
const { json } = require("express");
 
module.exports = {
    makeThumbnail : function(req , res, next){
        // if (!req.file){
        //     console.log(req.file);
        //     next(new Error('File upload failed'));
        // } else 
        {
            try {
                console.log(req.file)
                var destinationOfThumbnail = `conf/thumbnails/thumbnail-${req.file.filename.split(".")[0]}.jpeg`;
                var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}` ;
                exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } 
            catch(error) {
                next(error);
            }
        }
    } ,


    getPostsForUserBy : async function(req , res, next){
        console.log(req.session.user.userId);
        var {id} = req.session.user.userId;
        try{
            var [rows , _ ] = await db.execute(
                `select u.username,u.id, p.video, p.title, p.description, p.id, p.createdAt
                from posts p
                join users u
                on p.fk_userid=u.id
                where u.id=?;` , [id] );
            const post = rows[0];
             if (!post){
                console.log("poo poo not found");
             }
             else {
                res.locals.currentPost = post;
                next();
             }
        }
        catch(error) {
            next(error);
        }
    } ,


    getPostsById : async function(req , res, next){
        var {id} = req.session.user.userId;
        try{
          var [rows , _ ] = await db.execute(`select u.username, p.video, p.title, p.description, p.id, p.createdAt
          from posts p
          join users u
          on p.fk_userid=u.id
          where p.id=?;` , [id] );

          const posts = rows.map(post => ({
            id: post.id,
            title: post.title,
            description: post.description,
            thumbnails: post.thumbnail,
            createdAt: post.createdAt
    }));
        res.locals.posts = posts;
          if (!posts){
            window.alert("Couldn't find the post.")
            return res.render('index')
          }
          else {
            res.locals.currentPost = post;
            next();
          }
        } 
        catch(error){
            next(error);
        }
    } ,


    getCommentsForPostsById : async function(req , res, next){
        var {id} = req.params;
        try{
          var [rows , _ ] = await db.execute(`select u.username, c.text, c.createdAt
          from comments c
          join users u
          on c.fk_authorid=u.id
          where c.fk_postid=?;` , [id] );

            res.locals.currentPost.comments = rows;
        } 

        catch(error){
            next(error);
        }
    } ,


    getRecentPosts : async function(req , res, next){
        try{
            console.log("here!!")
            const [rows,fields] = await db.execute(`select id, title, video, createdAt, description, thumbnail 
            from posts order by createdAt desc limit 10`);
            const posts = rows.map(post => ({
                id: post.id,
                title: post.title,
                description: post.description,
                thumbnails: post.thumbnail,
                createdAt: post.createdAt
        }));
            res.locals.posts = posts;
            console.log(res.locals.posts);
            next();
        }
        catch(error){
            next(error);}
    } ,

     
}