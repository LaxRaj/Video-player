var validator = require("validator");
var db = require('../conf/database');
const bcrypt = require('bcrypt');

module.exports = {
    usernameCheck : function(req,res,next){
        var{username} = req.body;
        username = username.trim();
        if(!validator.isLength(username, {min:3})){
            req.flash("error", `Username must be 3 or more characters.`);
        }
        if (!/[a-zA-Z]/.test(username.charAt(0))){
            req.flash("error", `Username must begin with a Alphabet`);
        }
        if (req.session.flash.error){
            res.redirect('/registration')
        }
        else {
            next();
        }
       
    },


    passwordCheck : function(req,res,next){
        var {password} = req.body;
        if (!validator.isLength(password , {min:8})){
            req.flash("error", `Password must be 8 or more characters.`);
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)){
            req.flash("error",`Password must contain one special character.`);
        }
        if(!/[a-z]/.test(password) || !/[A-Z]/.test(password)){
            req.flash("error",`Password must contain one lowercase and one Uppercase letter.`);
        }
        if (req.session.flash.error){
            res.redirect('/registration');
        }
        else{
            next();
        }
    },
    emailCheck : async function(req,res,next){
        var {email} = req.body;
        try {
            var [rows , fields] = await db.execute(`select id from users where email=?;` , [email]);
            if (rows && rows.length >0) {
                req.flash("error" , `Email is already in use.`)
                return req.session.save(function(error)
                {
                    return res.redirect('/registration');
                })
            };
        } 
        catch(error) {
                next(error);
        }
    },
    tosCheck : function(req,res,next){
        var {toscheck} = req.body ;
        if(!toscheck) {
            req.flash("error",`You must agree to the Terms and Conditions.`)
        }
        else {
            next();
        }
    },
    ageCheck : function(req,res,next){
        var {ageCheck} = req.body ;
        if(!ageCheck) {
            req.flash("error",`You must agree to the Age Conditions.`)
        }
        else {
            next();
        }
    },
    inUsernameUnique : async function(req,res,next){
        var {username } = req.body;
        try {
            var [rows,fields] = await db.execute(`select id from users where username=?;` , [username]);
            if (rows && rows.length > 0) {
                req.flash("error" , `${username} is already in use.`)
                return req.session.save(function(err){
                    return res.redirect("/registration");
                });
            }
             else {
                next();
             }
        } 
        catch(error){
            next(error);
        }
    },
    isEmailUnique : async function(req,res,next){
        var {email} = req.body;
        try {
            var [rows , fields] = await db.execute(`select id from users where email=?;`, [email]);
            if (rows && rows.length > 0) {
                req.flash("error" , `${email} is already in use.`)
                return req.session.save(function(err){
                    return res.redirect("/registration");
                });
            }
        } 
        catch(error) {
            next(error)
        }
    },
}