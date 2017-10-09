const express = require('express');
const hbs = require('hbs');
const fs  = require('fs');


const port = process.env.PORT || 3000;    /* env var set by heroku */
var app = express();   // this creates an app
var maintenanceMode = false;


hbs.registerPartials(__dirname + '/views/partials'); // lets hbs know we want to use partials from this directory
app.set('view engine', 'hbs');    // Lets express know what templating engine we'll be using

// Configure built in middleware;app.use is how you register middleware

// Register middleware to pass control to next when application function is done
// Note: application handlers will not fire if next() function is NOT executed.
// Note: that in event of a major problem, you can purposely avoid call next()
//       to avoid running more handlers.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method}  ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  if (!maintenanceMode) {
      next();
  } else {
      res.render('maintenance.hbs');
  }
});


// Maintenance function
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// This statement below is letting middleware know your projects root
// directory. __dirname defaults to your root directory
// if you place this before maintenance function, uses will be able to access
// static html in your public folder.
app.use(express.static(__dirname + '/public'));

// Register helper functions with handlebars (aka hbs)
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// Following app.get() entries registers a handlder for those specific routes
// http get requests / routes
app.get('/', (req, res) => {
  // res.send('<H1>Hello Express!</H1>');
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMsg:  'Welcome to our web site New begginings'
  });
})

// Setting up other routes
app.get('/about', (req, res) => {
  // res.send('<H1>Hello Express!</H1>');
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
})


app.get('/projects', (req, res) => {
  // res.send('<H1>Hello Express!</H1>');
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  });
})

app.get('/bad', (req, res) => {
    res.send({
    error: 'Unable to handle rqeuest'});
})

// Binds our listener to port on our machine
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
