const db = require("../../config/db");

const {
  trim,
  validatePassword,
  checkPassword,
  validateEmail,
  hashPassword,
  tokenizer
} = require('../helper/util');

exports.login = async (req, res) => {
  try {
    if (trim(req.body.email) && trim(req.body.password)) {
      const email = trim(req.body.email).toLowerCase();
      const password = trim(req.body.password);

      const [checkEmail] = await db.execute("SELECT id, token, password, first_name, last_name, user_type, created_at, updated_at FROM users WHERE email = ?", [email]);

      if (checkEmail.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid login credentials'
        });
      }

      const dbPassword = checkEmail[0].password;
      const token = checkEmail[0].token;

      if (!checkPassword(password, dbPassword)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid login credentials'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login success',
        data: {
          email: email,
          first_name: checkEmail[0].first_name,
          last_name: checkEmail[0].last_name,
          user_type: checkEmail[0].user_type,
          created: checkEmail[0].created_at,
          updated_at: checkEmail[0].updated_at,
          token
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters'
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Could not reach network'
    });
  }
};

exports.register = async (req, res) => {
  try {
    if (trim(req.body.first_name) && trim(req.body.last_name) && trim(req.body.email) && trim(req.body.password)) {
      const firstName = trim(req.body.first_name);
      const lastName = trim(req.body.last_name);
      const email = trim(req.body.email).toLowerCase();
      let password = trim(req.body.password);

      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must be atleast 8 characters'
        });
      }

      const [emailExist] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);

      if (emailExist.length === 1) {
        return res.status(401).json({
          success: false,
          message: 'Email already exists'
        });
      }

      const token = tokenizer();
      password = hashPassword(password);

      await db.execute("INSERT INTO users (token, first_name, last_name, email, password, user_type, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())", [token, firstName, lastName, email, password, 'user']);

      return res.status(201).json({
        success: true,
        message: 'Account created',
        data: {
          token: token,
          first_name: firstName,
          last_name: lastName,
          email: email
        }
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters'
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Could not reach network'
    });
  }
};