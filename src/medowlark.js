var express = require('express');
var fortune = require('./lib/fortune.js');
var weather = require('./lib/weather.js');
var formidable = require('formidable');
var credentials = require('./credentials.js');
var NewsletterSignup = require('./lib/newsletter-signup.js');

var app = express();

var handlebars = require('express-handlebars')
    .create({
        defaultLayout: 'main',
        helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};

                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(`${__dirname}/public`));

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};

    res.locals.partials.weatherContext = weather.getWeatherData();
    next();
});

app.use(require('body-parser').urlencoded({ extended: true }));

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));

app.use(function(req, res, next){
    //if there's a flash message, transfer 
    //it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
})

app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: 'qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});

app.get('/sectiontest', function(req, res){
    res.render('sections-test');
});

app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck'
    });
});

var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!# $%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

app.get('/newsletter', function(req, res){
    //csrf temporary dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/newsletter', function(req, res){
    var name = req.body.name || '';
    var email = req.body.email || '';

    if(!email.match(VALID_EMAIL_REGEX)){
        if(req.xhr) {
            return res.json({
                error: 'Invalid email address.'
            });
        }

        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.'
        };
        return res.redirect(303, '/newsletter/archive');
    }

    new NewsletterSignup({ name: name, email: email }).save(function(err){
        if(err){
            if(req.xhr) return res.json({ error: 'Database error.' });

            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.'
            };

            return res.redirect(303, '/newsletter/archive');
        }

        if(req.xhr) return res.json( { success: true });

        req.session.flash = {
            type: 'success',
            intro: 'Thank you',
            message: 'You have now been signed up for the newsletter.'
        };

        return res.redirect(303, '/newsletter/archive');
    });
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

app.get('/newsletter/archive', function(req, res){
    res.render('thank-you');
});

app.get('/contest/vacation-photo', function(req, res){
    var now = new Date();
    res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
});

app.post('/process', function(req, res){
    console.log(`Form (from querystring): ${req.query.form}`);
    console.log(`CSRF token (from hidden form field): ${req.body._csrf}`);
    console.log(`Name (from visible form field): ${req.body.name}`);
    console.log(`Email (from visible form field): ${req.body.email}`);
    res.redirect(303, '/thank-you');
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');

        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.use(function(req, res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log(`Express started on port ${app.get('port')}; press ctrl + c to terminate`);
});