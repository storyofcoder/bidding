var express=require('express');
var router=express.Router(); 
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User=require('../models/user');
const GoogleStrategy=require('passport-google-oauth20');
//Register
router.get('/register',function(req,res){
	res.render('registerscreen.ejs');
});

//Login
router.get('/login',function(req,res){
	req.flash('success', 'You Must Login First');
   res.render('loginscreen.ejs');
});

//Register User
router.post('/register',function(req,res){
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;
	
	//validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','UserName is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);
	
	var errors=req.validationErrors();
	
	if(errors)
	{
		res.render('registerscreen.ejs',{errors:errors
		});
	}
	else
	{
		var newUser=new User({
			name:name,
			email:email,
			username:username,
			password:password
		});
	 
	    User.createUser(newUser,function(err, user){
           if(err) throw err;
           console.log(user);

	    });
	  req.flash('success_msg','You are registered');
	  res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
     function(username, password, done)
     {
       User.getUserByUsername(username,function(err,user)
       {
         if (err)
         	throw err;
         if(!user){
         	return done(null, false, {message: 'Unknown User'});
              }
         User.comparePassword(password,user.password,function(err, isMatch){
             if(err) throw err;
             if(isMatch){
             	return done(null,user);
         }
         else{
         	return done(null,false,{message: 'Invalid password'});
         }
         });
       });
     }));

passport.serializeUser(function(user, done){
 done(null,user.id);
});

passport.deserializeUser(function(id, done){
  	User.getUserById(id, function(err,user){
       done(err, user);
  	});
});

passport.use(
	new GoogleStrategy({
   //options for google strategy
   callbackURL:'/users/google/redirect',
  clientID:'197185843963-ph2urt2ktkjh0mthq9snabuu6kc5fgte.apps.googleusercontent.com',
  clientSecret:'YdtH-n7pHH0byqRFhD75kBFi'
},()=>{
       //passport callback function
	})
)

router.get('/google',passport.authenticate('google',{
	scope:['profile']
}));

router.get('/google',passport.authenticate('google',{
	scope:['profile']
}));

router.get('/google/redirect',(req,res)=>{
   res.send('you reached the callback url');
});

router.post('/login',
	passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login' ,failureFlash: true}),
     function(req,res){
        res,redirect('/');
     });

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/');
})

module.exports= router;

