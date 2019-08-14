const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.use(session({
    secret: 'StayHumble',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
//CHANGE HERE----------------------
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotingdojo', {useNewUrlParser: true})

//MODELS------------------------------
const QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String
    
}, {timestamps:true})

const Quote = mongoose.model('Quote', QuoteSchema)


//ROUTES
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/quote/process' , (req,res) => {
    Quote.create(req.body)
    .then(newQuote => {
        res.redirect('/quotes')
    })
    .catch(err => res.json(err));
})

app.get('/quotes', (req,res) => {
    Quote.find()
        .then(data => res.render('quotes', {quotes:data}))
        .catch(err => {res.json(err)})
})

app.listen(8000, () => console.log("listening on port 8000"));
