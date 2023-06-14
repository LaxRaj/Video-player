module.exports = {
    isLoggedIn: function(req , res, next){
        if(req.session.user){
            next();
        }else {
            req.flash("error", `You are not Logged In.`)
            req.session.save(function(err){
                if(err){next(err)}
                else{
                    res.redirect("/login")
                }
            });
            res.redirect("/login")
        }
    },

    isMyProfile: function(req , res , next){
        var {id} = req.params;
        if(id === req.session.user.userId){
            next();
        }else {
            req.flash("error",`This is not your profile. This is profile is private.`);
            req.session.save(function(err){
                if(err) next(err);
                res.redirect("/");
            })
        }
    }
};