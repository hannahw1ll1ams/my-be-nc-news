const express = require('express');
const app = express();
const apiRouter = require('./routers/api-router')
const cors = require('cors');
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors
} = require('./errors/index')

app.use(cors())

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => res.status(404).send({
  msg: 'Page Not Found'
}));

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);



module.exports = app;