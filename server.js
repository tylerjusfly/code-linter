const express = require('express');
// const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', indexRouter);


app.listen(4002, () =>{
    console.log('connected to ' + 4002)
})