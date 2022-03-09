const express = require('express');
const app = express();
const Discord = require("discord.js");
const passport = require("passport");
const passportDiscord = require("passport-discord");
const Strategy = passportDiscord.Strategy;
const path = require("path");
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
var bodyParser = require("body-parser");
const session = require("express-session");
const MemoryStore = require("memorystore");
const mStore = MemoryStore(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    store: new mStore({ checkPeriod: 86400000 }), // we refresh the store each day
    secret: "A_RANDOM_STRING_FOR_SECURITY_PURPOSES_OH_MY",
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

module.exports = async (client) => {
    const authenticate = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    };
    // ------------------------------------------------------------
    const strategy = new Strategy({
        clientID: client.user.id,
        clientSecret: process.env.clientSecret || process.env.clientSecret,
        callbackURL: process.env.callbackURL || process.env.callbackURL,
        scope: ["identify", "guilds"]
    },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        });
    passport.use(strategy);
    // ------------------------------------------------------------
    const invite = await client.application.client.generateInvite({
        scopes: ["applications.commands", "bot"],
        permissions: ["ADD_REACTIONS", "ATTACH_FILES", "MANAGE_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "USE_APPLICATION_COMMANDS", "USE_EXTERNAL_EMOJIS", "USE_EXTERNAL_STICKERS", "USE_PRIVATE_THREADS", "USE_PUBLIC_THREADS"],
        disableGuildSelect: true,
        guild: "REPLACE_ME"
    });
    app.get('/', function (req, res) {
        res.render('index', { user: client, invite: invite, current: req.user });
    });
    app.get('/commands', function (req, res) {
        res.render('cmds', { user: client, invite: invite, current: req.user });
    });
    app.get("/dashboard", authenticate, function (req, res,) {
        res.render('dash', { user: client, invite: invite, current: req.user, permissions: Discord.Permissions });
    });
    // LOGIN AND LOGOUT + CALLBACK
    app.get("/login", (req, res, next) => {
        if (req.session.backURL) {
            req.session.backURL = req.session.backURL;
        } else {
            req.session.backURL = "/";
        }
        next();
    }, passport.authenticate("discord"));

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
        session.us = req.user;
        if (req.session.backURL) {
            const url = req.session.backURL;
            req.session.backURL = null;
            res.redirect(url);
        } else {
            res.redirect("/");
        }
    });
    app.get("/logout", function (req, res) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });
    app.use(function (req,res,next){
        res.status(404).render('404',{ user: client, current: req.user});
    });
    
    // ERROR PAGES
    app.use(function(req, res, next) {
        var err = new Error('Internal Server Error');
        err.status = 500;
        next(err);
    });
    app.use(function(error, req, res, next) {
        res.status(500);
        url = req.url;
        console.log(error)
        res.render('500', { title:'500: Internal Server Error', error: error, user: client, current: req.user});
      });
    // LISTEN ON PORT
    let port = process.env.PORT || process.env.PORT || 3000;
    app.listen(port).on("listening", () => {
        console.log("Web server listening on PORT: " + port)
    });
}