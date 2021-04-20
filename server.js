'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request

app.use(express, urlencoded({extended:true}));
// Specify a directory for static resources

app.use(express.static('./public'));
// define our method-override reference
app.use(methodOverride ,('_method'));

// Set the view engine for server-side templating
app.use(view , 'ejs')
// Use app cors

app.use(express ,'cors');
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/' ,indexhandle);
app.get('/favorite-quotes' ,getfav);
app.get('/favorite-quotes/:id' ,detailspage);
app.post('/favorite-quotes' ,favpage);
app.put('/favorite-quotes/:id' ,updatedata);
app.delete('/favorite-quotes/:id' ,deletedata);




// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --

function indexhandle(req,res){
    let url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10'

    superagent.get(url).set('User-Agent', '1.0').then(data =>{
        res.render('pages/index' ,{data:data.body});
    })
    
}

function getfav(req,res){
    let sql = 'SELECT * FROM final;';
    client.query(sql).then(data =>{
        res.render('pages/fav' ,{data:data.rows});
    })
}

function favpage(req,res){
    let sql ='INSERT INTO final (characters,quote,image) VALUES ($1,$2,$3);';
    let values = [req.body.character,req.body.quote,req.body.image];
    client.query(sql,values).then(data =>{
        res.redirect('/favorite-quotes');
    })
}

function detailspage(req,res){
    let id = req.params.id;
    let sql = 'SELECT * FROM final WHERE id=$1;';
    client.query(sql,[id]).then(result =>{
        res.render('pages/details' ,{results:result.rows});
    })
}

function updatedata(req,res){
    let id = req.params.id;
    let sql = 'UPDATE final SET characters=$1,quote=$2,image=$3 WHERE id=$4;';
    let values = [req.body.character,req.body.quote,req.body.image,id];

    client.query(sql,values).then(result =>{
        res.redirect(`/details/${id}`);
    })
}

function deletedata(req,res){
    let id = req.params.id;
    let sql = 'DELETE FROM final WHERE id=$1;';

    client.query(sql,[id]).then(result =>{
        res.redirect('/');
    })

}


// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
