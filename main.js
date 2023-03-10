// thanks to sean for the baseplat schoology login
const express = require('express')
var cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())

const port = 3000

const nodeUtil = require('util')

const apiBase = 'https://api.schoology.com/v1'
const sgyDomain = 'https://pausd.schoology.com'

const key = "657face5a689f9fb2441e558006ab0f4063cd1a50";
const secret = "74c0cbab174ec6eabc9ee7edacdd00ee";

const { OAuth } = require('oauth')
const oauth = new OAuth(
  `${apiBase}/oauth/request_token`,
  `${apiBase}/oauth/access_token`,
  key,
  secret,
  '1.0',
  null,
  'HMAC-SHA1'
)
oauth.setClientOptions({
  requestTokenHttpMethod: 'GET',
  accessTokenHttpMethod: 'GET',
  followRedirects: true
})

// node-oauth uses callbacks òAó
function promiseify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...out) => {
      if (err) {
        err.args = args
        err.out = out
        console.error(err, out)
        reject(err)
      } else {
        resolve(out)
      }
    })
  })
}

oauth.getOAuthRequestToken = promiseify(oauth.getOAuthRequestToken.bind(oauth))
oauth.getOAuthAccessToken = promiseify(oauth.getOAuthAccessToken.bind(oauth))
oauth.get = promiseify(oauth.get.bind(oauth))

function toJson([data]) {
  return JSON.parse(data)
}
// node-oauth only follows 301 and 302 HTTP statuses, but Schoology redirects
// /users/me with a 303 status >_<
function follow303(err) {
  if (err.statusCode === 303) {
    const [, request] = err.out
    // console.log(request.headers.location)
    return oauth.get(request.headers.location, ...err.args.slice(1))
  } else {
    return Promise.reject(err)
  }
}

const requestTokens = new Map()
const accessTokens = new Map()
const usernames = new Map()


app.get('/', (req, res) => {
  if (req.cookies.userid && usernames.has(req.cookies.username)) res.redirect('/home')
  else res.sendFile('index.html', { root: __dirname });
})


app.get('/register', (req, res) => {
  res.sendFile('register.html', { root: __dirname })
})

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: __dirname })
  if (req.cookies.userid || usernames.has(req.cookies.username)) {
    res.redirect('/link')
  }
})


app.get('/link', async (req, res) => {
  // A primitive way of getting the user ID.
  if (!req.query.userid || !req.query.username) {
    res.sendFile("login.html", { root: __dirname })
    return
  }
  const userId = req.query.userid
  const username = atob(req.query.username)
  usernames.set(username, "true")
  if (!userId) {
    res.redirect("/register")
  }
  const token = accessTokens.get(userId)
  res.cookie("token", token)
  const oauthToken = req.query.oauth_token
  res.cookie("oauth_token", oauthToken)
  if (!token) {
    // Authenticate user
    if (oauthToken) {
      // The user has returned from Schoology with an OAuth token
      const requestToken = requestTokens.get(userId)
      if (!requestToken) {
        return res.status(401).send('"someone\'s tampering with requests" -sgy')
      }
      if (requestToken.key !== oauthToken) {
        return res.status(401).send('"someone\'s tampering with requests" -sgy')
      }
      const [key, secret] = await oauth.getOAuthAccessToken(
        requestToken.key,
        requestToken.secret
      )
      accessTokens.set(userId, { key, secret })
      res.cookie("access_token", { key, secret })
      requestTokens.delete(userId)
      // Remove the oauth_token parameter (see below)
    } else {
      // Redirect the user to Schoology to let them authorize me access to their
      // accounts
      const [key, secret] = await oauth.getOAuthRequestToken()
      requestTokens.set(userId, { key, secret })
      // https://stackoverflow.com/a/10185427
      const fullUrl = req.get('host') + req.originalUrl
      return res.redirect(`${sgyDomain}/oauth/authorize?${new URLSearchParams({
        oauth_callback: fullUrl,
        oauth_token: key
      })}`)
    }
  }

  // Regardless of whether the user has been authenticated, remove the
  // oauth_token parameter from the URL.
  if (oauthToken) {
    delete req.query.oauth_token
    return res.redirect('?' + new URLSearchParams(req.query))
  }

  const { key, secret } = token
  const { uid } = await oauth.get(`${apiBase}/users/me`, key, secret)
    .catch(follow303)
    .then(toJson)
    .catch(err => {
      if (err.statusCode === 401) {
        // Token expired
        accessTokens.delete(userId)
        res.status(401).send('token expired! Clear your cookies and refresh the page.')
        return {}
      } else {
        return Promise.reject(err)
      }
    })
  if (!uid) return

  res.cookie('userid', userId)
  res.cookie('username', username)
  res.cookie("uid", uid)
  console.log("cookies set")
  // // At this point, I should now have access to the user's Schoology
  // const apiResult = await oauth.get(`${apiBase}/users/${uid}/sections`, key, secret)
  //   .then(toJson)
  // return res.send(`<h4>Courses</h4><ul>${
  //   apiResult.section.map(section => {
  //     return `<li>${section.course_title}: ${section.section_title}</li>`
  //   }).join('') || '<li>No courses were found for this user.</li>'
  // }</ul>`)
  res.redirect('/home')
})


// app.get('/home', function (req, res) {
//   res.sendFile('home.html', { root: __dirname })});


// app.get("/home", async (req, res) => {
//   const userId = req.cookies.userid;
//   if(!userId) {
//     res.redirect('/register');
//   } else {
//     const token = accessTokens.get(userId);
//     if (!token) {
//       res.redirect("/register")
//     }
//     try {
//     } catch (err) {
//       console.log(err);
//       res.send(`<h1>An error occurred</h1>`);
//     }
//   }
// });

app.get("/home", async (req, res) => {
  const userId = req.cookies.userid;
  if (!userId) {
    res.redirect('/register');
  } else {
    const token = accessTokens.get(userId);
    if (!token) {
      res.redirect("/register")
    }
    try {
      // const user = await oauth.get(`${apiBase}/users/me`, req.cookies.token.key, req.cookies.token.secret);
      // const userData = JSON.parse(user[0]);
      const sections = await oauth.get(`${apiBase}/users/${req.cookies.uid}/sections`, req.cookies.token.key, req.cookies.token.secret);
      const sectionsData = JSON.parse(sections[0]);
      var assignmentList = [];
      sectionsData.section.forEach(async (section) => {
        const assignments = await oauth.get(`${apiBase}/sections/${section.id}/assignments`, req.cookies.token.key, req.cookies.token.secret);
        const assignmentData = JSON.parse(assignments[0]);
        for (let i = 0; i < assignmentData.assignment.length; i++) {
          let grade = assignmentData.assignment[i];
          assignmentList.push(<li>${grade.title} with a grade of ${grade.score}</li>);
          console.log(`pushed to ${grade.title} assignment list. New length of ${assignmentList.length}`);
        }
 
          
      });
      Promise.all([assignments]).then(() => { res.send(`<h2>Your Gradebook</h2> <ul> ${assignmentList} </ul>`) });
    ;
console.log("Assignment List: \n\n\n\n\n\n")
console.log(assignmentList.length)

    } catch (err) {
  console.log(err);
  res.send(`<h1>An error occurred</h1>`);
}
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost${port}`)
})