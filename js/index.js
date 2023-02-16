import { getCurrencies } from './currencyData';
import { validateEmail, validatePassword } from './validator';

const registerForm = document.querySelector('form.register__form');
const emailInput = document.getElementById('email');
const registerButton = document.getElementById('register-button');
const emailErrorMessage = document.getElementById('invalid-email-message');
const passwordInput = document.getElementById('password');
const passwordErrorMessageElements = {
  length: document.getElementById('password-validation-msg-length'),
  number: document.getElementById('password-validation-msg-number'),
  lowercase: document.getElementById('password-validation-msg-lowercase'),
  uppercase: document.getElementById('password-validation-msg-uppercase'),
  'special-character': document.getElementById('password-validation-msg-special-character'),
};
const registrationSuccessMessage = document.querySelector('.registration__success');

const priceDropIcon = `<i class="fa-solid fa-circle-chevron-down"></i>`;
const priceRiseIcon = `<i class="fa-solid fa-circle-chevron-up"></i>`;

/**
 * It takes in currency data, finds the element with the id of the data object's nameid
 * then updates the element's content with the data object's properties
 * @param data - The data object that we get from the API.
 */
const setCurrencyData = async (data) => {
  const element = document.getElementById(data.nameid);

  if (!element) return;

  element.querySelector('.currency__symbol').textContent = data.symbol;
  element.querySelector('.currency__name').textContent = data.name;
  element.querySelector('.currency__price').textContent = `$ ${data.price_usd}`;

  const selectedIcon = data.percent_change_24h > 0 ? priceRiseIcon : priceDropIcon;
  const currencyChangeHtml = `<div class="currency__price-change
  ${data.percent_change_24h > 0 ? 'currency__price--rise' : 'currency__price--fall'}">
    ${selectedIcon} ${data.percent_change_24h}%
  </div>`;

  element.querySelector('.currency__change').insertAdjacentHTML('afterbegin', currencyChangeHtml);
};

/**
 * Get the data from the API, then we're looping through
 * the data and using the `setCurrencyData` function to set the data in the DOM
 */
const setAllCurrencies = async () => {
  const currenciesData = await getCurrencies();

  currenciesData.forEach((currency) => {
    setCurrencyData(currency);
  });
};

// Submit the form
const formSubmitHandler = (e) => {
  e.preventDefault();

  // reset register button
  registerButton.classList.remove('btn--green');
  registerButton.classList.add('btn--gray');
  registerButton.disabled = true;

  // show success message
  registrationSuccessMessage.classList.remove('hidden');

  // reset password error messages
  for (let elementKey in passwordErrorMessageElements) {
    passwordErrorMessageElements[elementKey].classList.remove('invalid', 'valid');
    passwordErrorMessageElements[elementKey].classList.add('normal');
  }

  // reset the email input
  emailInput.classList.remove('invalid', 'valid');
  emailErrorMessage.classList.add('hidden');

  // reset password input
  passwordInput.classList.remove('invalid', 'valid');

  emailInput.value = '';
  passwordInput.value = '';
};

const checkRegisterButton = () => {
  const isEmailValid = validateEmail(emailInput.value);
  const {
    length,
    number,
    lowercase,
    uppercase,
    'special-character': specialCharacter,
  } = validatePassword(passwordInput.value);

  const isPasswordInvalid = !length || !number || !lowercase || !uppercase || !specialCharacter;

  // Checking if email or password is invalid
  if (!isEmailValid || isPasswordInvalid) {
    registerButton.classList.remove('btn--green');
    registerButton.classList.add('btn--gray');
    registerButton.disabled = true;
    return;
  }

  registerButton.disabled = false;
  registerButton.classList.add('btn--green');
  registerButton.classList.remove('btn--gray');
};

/**
 * Validates the email and adds the visuals to the DOM in form of error messages and input borders
 */
const emailInputChangeHandler = (e) => {
  const email = e.target.value;

  if (email === '') {
    emailInput.classList.remove('invalid', 'valid');
    emailErrorMessage.classList.add('hidden');
    return;
  }

  if (!validateEmail(email)) {
    emailInput.classList.remove('valid');
    emailInput.classList.add('invalid');
    emailErrorMessage.classList.remove('hidden');
    return;
  }

  emailInput.classList.remove('invalid');
  emailInput.classList.add('valid');
  emailErrorMessage.classList.add('hidden');

  checkRegisterButton();
};

/**
 * Validates the password and adds the visuals to the DOM by changing colors of messages and input box
 */
const passwordInputChangeHandler = (e) => {
  const password = e.target.value;

  if (password === '') {
    passwordInput.classList.remove('invalid', 'valid');
    passwordInput.classList.add('normal');

    for (let elementKey in passwordErrorMessageElements) {
      passwordErrorMessageElements[elementKey].classList.remove('invalid', 'valid');
      passwordErrorMessageElements[elementKey].classList.add('normal');
    }

    return;
  }

  const validationRules = validatePassword(password);
  let passwordScore = 0;

  // Change colors of messages and input box
  for (let rule in validationRules) {
    if (validationRules[rule]) passwordScore++;
    const element = passwordErrorMessageElements[rule];

    if (!element) continue;

    if (validationRules[rule]) {
      element.classList.remove('normal', 'invalid');
      element.classList.add('valid');
    } else {
      element.classList.remove('normal', 'valid');
      element.classList.add('invalid');
    }
  }

  if (passwordScore !== 5) {
    passwordInput.classList.remove('normal', 'valid');
    passwordInput.classList.add('invalid');
    return;
  }

  passwordInput.classList.remove('normal', 'invalid');
  passwordInput.classList.add('valid');

  checkRegisterButton();
};

// ------------------------------------------------------
// Start of the code
setAllCurrencies();

emailInput.addEventListener('input', emailInputChangeHandler);
passwordInput.addEventListener('input', passwordInputChangeHandler);
registerForm.addEventListener('submit', formSubmitHandler);
