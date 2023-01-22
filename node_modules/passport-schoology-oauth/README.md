# passport-schoology-oauth

Schoology authentication strategy for [Passport](http://passportjs.org/).

This module lets you authenticate using Schoology OAuth in your Node.js applications.
By plugging into Passport, Schoology OAuth authentication can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/) - style middleware, including
[Express](http://expressjs.com/).



[![npm](https://img.shields.io/npm/v/passport-schoology-oauth.svg)](https://www.npmjs.com/package/passport-schoology-oauth)
## Install

    $ npm install passport-schoology-oauth
    $ yarn add passport-schoology-oauth

## Usage

### Obtain API Key

This can be done at [https://<your school>.schoology.com/api]()

#### Configure Strategy

The Schoology authentication strategy authenticates users using Schoology
account and Schoology OAuth tokens.  The institution's Schoology domain, as well as the
request key and secret, are specified as options.  The strategy requires a
`verify` callback, which receives a token and profile, and calls `cb`
providing a user.

    passport.use('schoology', new OAuth1Strategy({
        consumerKey: EXAMPLE_CONSUMER_KEY,
        consumerSecret: EXAMPLE_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/example/callback",
        signatureMethod: "RSA-SHA1",
        sgyDomain: "https://yourschool.schoology.com"
      },
      function(token, tokenSecret, profile, cb) {
        User.findOrCreate({ exampleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'schoology'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/example',
      passport.authenticate('schoology'));
    
    app.get('/auth/example/callback', 
      passport.authenticate('schoology', { failureRedirect: '/login', successRedirect: '/' }));


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2021 Saumya Singhal


