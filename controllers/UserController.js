const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

class UserController {

  static signup = async (req, res) => {

    const { username, password, confirmPassword, email, tc } = req.body;
    const user = await UserModel.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    // if any user exists with this email, then send error message
    if (user) {

      res.send({
        status: 'failed',
        code: 'USER_EXISTS',
        message: 'User already exists!'
      });

    } else {
      // check if all the fields are filled
      if (username && password && confirmPassword && email && tc) {

        if (password !== confirmPassword) {

          res.send({
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

            const savedUser = await UserModel.findOne({email});
            const token = jwt.sign(
              { id: savedUser._id },
              process.env.JWT_SK,
              { expiresIn: '1d' }
            );

            res.status(201).send({
              status: 'success',
              code: 'SIGNUP_SUCCESSFUL',
              jwt: token,
              message: 'Signup successful!'
            });

          } catch (err) {

            res.send({
              status: 'failed',
              code: 'UNKNOWN_ERROR',
              message: err.message
            });

          }

        }

      } else {

        res.send({
          status: 'failed',
          code: 'EMPTY_FIELD',
          message: 'All fields are required!'
        });

      }

    }

  };

  static signin = async (req, res) => {

    const { usernameOrEmail, password } = req.query;

    if (usernameOrEmail && password) {

      const user = await UserModel.findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      });

      // if any user exists with this email, then send error message
      if (user) {

        const hash = CryptoJS.HmacSHA256(password, '#SK+[password/parser]+(NHR)');
        const passHashed = hash.toString(CryptoJS.enc.Base64);

        if (user.password !== passHashed) {

          res.send({
            status: 'failed',
            code: 'INVALID_CREDENTIALS',
            message: "Invalid signin credentials!"
          });

        } else {

          const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SK,
            { expiresIn: '1d' }
          );

          res.status(201).send({
            status: 'success',
            code: 'SIGNIN_SUCCESSFUL',
            jwt: token,
            message: 'Signin successful!'
          });

        }

      } else {

        res.send({
          status: 'failed',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid signin credentials!'
        });

      }

    } else {

      res.send({
        status: 'failed',
        code: 'EMPTY_FIELD',
        message: 'All fields are required!'
      });

    }

  };

  static changePassword = async (req, res) => {

    const { userId, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!userId) {
      res.send({
        status: 'failed',
        code: 'UNAUTHORIZED_USER',
        message: 'User is unauthorized!'
      });
    } else if (currentPassword && newPassword && confirmNewPassword) {

      let user = await UserModel.findOne({ _id: userId });

      let hash = CryptoJS.HmacSHA256(currentPassword, '#SK+[password/parser]+(NHR)');
      let passHashed = hash.toString(CryptoJS.enc.Base64);

      if (newPassword !== confirmNewPassword) {

        res.send({
          status: 'failed',
          code: 'PASS_MISMATCH',
          message: "Two passwords didn't match!"
        });

      } else if (user.password !== passHashed) {

        res.send({
          status: 'failed',
          code: 'INVALID_PASSWORD',
          message: 'Current password is invalid!'
        });

      } else {

        let newHash = CryptoJS.HmacSHA256(newPassword, '#SK+[password/parser]+(NHR)');
        let newPassHashed = newHash.toString(CryptoJS.enc.Base64);
        UserModel.findOneAndUpdate({ _id: userId }, { $set: { password: newPassHashed } })
        .then((doc) => {
          res.send({
            status: 'success',
            code: 'PASSWORD_CHANGED',
            message: 'Password changed successfully!'
          });
        })
        .catch((err) => {
          res.send({
            status: 'failed',
            code: 'UNKNOWN_ERROR',
            message: err.message
          });
        })
      }

    } else {

      res.send({
        status: 'failed',
        code: 'EMPTY_FIELD',
        message: 'All fields are required!'
      });
      
    }

  };

}


module.exports = UserController;
