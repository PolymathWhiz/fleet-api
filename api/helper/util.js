/**
 * This module contains helper functions that
 * applies to application wide functionalities
 *
 * @author Miracle Anyanwu.
 */

const uuid = require("uuid/v4");
const crypto = require("crypto");
const db = require("../../config/db");
const bcrypt = require("bcrypt");

const trim = (text) => {
  if (text !== undefined) {
    return text.trim();
  }

  return null;
};

const validateEmail = email => {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
};

const validatePassword = password => {
  if (password.length >= 8) {
    return true;
  }

  return false;
};


const tokenizer = () => {
  return crypto
    .createHmac("sha512", uuid())
    .update(uuid())
    .digest("hex");
};

const checkPassword = (password, hash) => {
  return !!bcrypt.compareSync(password, hash);
};

const hashPassword = password => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};


module.exports = {
  trim,
  checkPassword,
  tokenizer,
  validateEmail,
  validatePassword,
  hashPassword
};