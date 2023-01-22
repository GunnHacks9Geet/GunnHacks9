const express = require("express");
const request = require("request");
const passport = require("passport");
const OAuth1Strategy = require("passport-oauth1");
const app = express();


const clientId = "dcc125ec557819caff204e151c470240063ccaf06";
const clientSecret = "685443c62633b13178025bb47b5f9e78";
const callbackUrl = "https://google.com";

passport.use('schoology', new OAuth1Strategy({
    consumerKey: clientId,
    consumerSecret: clientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/example/callback",
    signatureMethod: "RSA-SHA1",
    sgyDomain: "https://app.schoology.com",
    requestTokenURL: "https://api.schoology.com/v1/oauth/request_token",
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/callback", (req, res) => {

  const code = req.query.code;
  request.post({
    url: "https://api.schoology.com/v1/oauth/token",
    form: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: "authorization_code",
      code: code
    }
  }, (error, response, body) => {
    const json = JSON.parse(body);
    const accessToken = json.access_token;

    request.get({
      url: "https://api.schoology.com/v1/users/me",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }, (error, response, body) => {
      const json = JSON.parse(body);
      const name = json.name;
      request.get({
        url: `https://api.schoology.com/v1/users/me/sections`,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }, (error, response, body) => {
        const json = JSON.parse(body);
        const courses = json.section;
        res.json({ name, courses });
      });
    });
  });
});

// make it return client/index.html for /
app.get("/" , (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});


app.get('/auth/example',
  passport.authenticate('schoology'));

app.get('/auth/example/callback', 
  passport.authenticate('schoology', { failureRedirect: '/login', successRedirect: '/' }));

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
