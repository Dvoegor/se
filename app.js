var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var productsRouter = require('./routes/products');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart');
var operatorRouter = require('./routes/operator');
var adminRouter = require('./routes/admin');
var contactsRouter = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'big', saveUninitialized: false, resave: false}));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/products', productsRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/operator', operatorRouter);
app.use('/admin', adminRouter);
// app.use('/contacts', contactsRouter);

app.post('/logout', (req, res) => {
  req.session.success = false;
  res.status(200).redirect("/")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('error');
  // next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
