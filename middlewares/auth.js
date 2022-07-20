const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
require('dotenv').config('../.env');

class Auth {

  static isValidUser = async (req, res, next) => {

    const { authorization } = req.headers;

    if (authorization.startsWith('Bearer')) {

      const token = authorization.split(' ')[1];

      try {

        const { id } = jwt.verify(token, process.env.JWT_SK);
        const user = await UserModel.findOne({ _id: id });

        if (user) {
          req.body.userId = id;
          next()
        } else {
          res.send({
            status: 'failed',
            code: 'UNAUTHORIZED_USER',
            message: 'User is unauthorized!'
          });
        }

      } catch(err) {
        res.send({
          status: 'failed',
          code: 'TOKEN_EXPIRED',
          message: 'Token is expired!'
        });
      }

    } else {
      res.send({
        status: 'failed',
        code: 'UNAUTHORIZED_USER',
        message: 'User is unauthorized!'
      });
    }

  };

}


module.exports = Auth;
