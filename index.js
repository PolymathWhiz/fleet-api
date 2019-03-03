const express = require("express");
const app = express();
const cors = require('cors')
const port = 3000 || process.env.PORT;
const pkg = require("./package.json");

require("dotenv").config();

/**
 * Middleware Settings
 */
app.use(cors())

app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json());

// Routes imports 
const AuthRoute = require('./api/routes/auth');
const BookRoute = require('./api/routes/bookings');

// Exposed routes
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: `Welcome to Fleet API`,
    data: {
      service: pkg.name,
      version: pkg.version
    }
  });
});

app.use('/auth', AuthRoute);
app.use('/book', BookRoute);



/**
 * Error Handlers
 */
app.use((req, res) => {
  const err = new Error("Not Found");
  err.status = 404;
  return res.status(404).json({
    status: false,
    message: err.message
  });
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  return res.status(500).json({
    status: false,
    message: err.message
  });
});



app.listen(port, () => {
  console.log('App is running on port - ' + port);
});