const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

class UserController {

  static signup = async (req, res) => {

    const { username, password, confirm_password, email, tc } = req.body;
    const user = await UserModel.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    // if any user exists with this email, then send error message
    if (user) {

      res.status(400).send({
        status: 'failed',
        code: 'USER_EXISTS',
        message: 'User already exists!'
      });

    } else {
      // check if all the fields are filled
      if (username && password && confirm_password && email && tc) {

        if (password !== confirm_password) {

          res.status(400).send({
            status: 'failed',
            code: 'PASS_MISMATCH',
            message: "Two passwords didn't match!"
          });

        } else {

          try {
            // creating a new user
            const hash = CryptoJS.HmacSHA256(password, '#SK+[password/parser]+(NHR)');
            const passHashed = hash.toString(CryptoJS.enc.Base64);
            
            await (new UserModel({
              username,
              password: passHashed,
              email
            })).save();

            res.status(200).send({
              status: 'success',
              code: 'SIGNUP_SUCCESSFUL',
              message: 'Signup successful!'
            });

          } catch (err) {

            res.status(400).send({
              status: 'failed',
              code: 'UNKNOWN_ERROR',
              message: err.message
            });

          }

        }

      } else {

        res.status(400).send({
          status: 'failed',
          code: 'EMPTY_FIELD',
          message: 'All fields are required!'
        });

      }

    }

  };

}


module.exports = UserController;
