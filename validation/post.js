const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 5, max: 200 })) {
    errors.text = 'Number of characters should be between 5 and 200';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}