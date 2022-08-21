const passport = require('passport');
const User = require('../models/user');

const localStrategy = require('passport-local').Strategy;

// const User = require('./models/user');

// authentication using passport
passport.use(new localStrategy({
    usernameField:'email'
    },
    function(email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log('Error in finding user --> passport');
                return done(err);
            }

            if(!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }

));


// serializing the user to decide which kye is to be kept in the cookies

passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in th cookies

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> passport');
            return done(err);
        }

        return done(null, user);
    });
});


// check if the user is authentication
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the local for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;