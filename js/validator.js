/**
 * It returns true if the email is valid, and false if it's not
 */
export const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email);
};

/**
 * It returns an object with five properties, each of which is a boolean that indicates whether the
 * password meets a certain criteria
 */
export const validatePassword = (password) => {
  const numberCheck = /\d/;
  const lowercaseCheck = /[a-z]/;
  const uppercaseCheck = /[A-Z]/;
  const specialCharacters = '(#[]()@$&*!?|,.^/+_-)';

  return {
    length: password.length <= 15 && password.length >= 8,
    number: numberCheck.test(password),
    lowercase: lowercaseCheck.test(password),
    uppercase: uppercaseCheck.test(password),
    'special-character': Boolean(password.split('').find((char) => specialCharacters.includes(char))),
  };
};
