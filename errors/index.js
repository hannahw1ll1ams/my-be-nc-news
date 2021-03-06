exports.handlePSQLErrors = (err, req, res, next) => {
  // console.log(err, '<-- PSQL error')
  const psqlBadRequestCodes = {
    '22P02': {
      status: 400,
      msg: 'Bad Request'
    },
    '23503': {
      status: 404,
      msg: "Page Not Found"
    },
    '42703': {
      status: 400,
      msg: 'Bad Request'
    },
    '23502': {
      status: 400,
      msg: 'Bad Request'
    }
  };
  if (psqlBadRequestCodes.hasOwnProperty(err.code)) {
    res.status(psqlBadRequestCodes[err.code].status).send({
      msg: psqlBadRequestCodes[err.code].msg
    });
  } else next(err);
}


exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err, '<-- custom error')
  //for errors like request is valid, but doesn't exist
  if (err.status) {
    res.status(err.status).send({
      msg: err.msg
    });
  } else next(err)
}


exports.handleServerErrors = (err, req, res, next) => {
  // console.log(err, '<-- server error')
  res.sendStatus(500).send({
    msg: "500 error"
  });
}



exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({
    msg: 'Method Not Allowed'
  })
}