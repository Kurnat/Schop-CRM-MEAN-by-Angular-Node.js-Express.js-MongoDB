const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');


// rouers
const authRoutes = require('./routes/auth');
const analitycsRoutes = require('./routes/analitycs');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');

const app = express();


app.use(passport.initialize());
require('./middleware/passport')(passport); // passport middleware

app.use(require('morgan')('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/analitycs', analitycsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);


module.exports = app;