const express = require('express')
const hbs     = require('hbs')
const helmet  = require('helmet')
const fs      = require('fs')

var app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
//Remove x-powered-by response header to stop 
//from disclosing server information
app.disable('x-powered-by');
//helps you secure app by setting various HTTP headers.
//https://www.npmjs.com/package/helmet
app.use(helmet({
    noCache: true
}))

app.use((req, res, next) => {
    var now = new Date().toString()
    var log = `${now}: ${req.method} ${req.url}`
    
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.')
        }
    })
    next()
})
/*
* Commented out by default.  Only comment if site is under maintenance!!!
*/
// app.use((req, res, next) => {
//     res.render('maintenance.hbs')
// })

app.use(express.static(__dirname + '/public'))

hbs.registerHelper('getCurrentYear', () =>{
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase()
})

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to some website'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    })
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})