const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button-disabled",
  inputErrorClass: "modal__error",
  errorClass: "modal__error_visable",
};

const showInputError = (formElememnt, inputElement, errorMessage) => {
  const errorMessageElement = formElememnt.querySelector('.${inputElement.id}-error');
  errorMessageElement.textContent = errorMessage;
  inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElememnt, inputElement) => {
  const errorMessageElement = formElememnt.querySelector('.${inputElement.id}-error');
  errorMessageElement.textContent = "";
  inputElement.classList.remove(config.errorClass);
};

const checkInputValidity = (formElememnt, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElememnt, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElememnt, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
  } else {
    buttonElement.disabled = false;
    inputElement.classList.add(config.inactiveButtonClass);
  }
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  inputElement.classList.add(config.submitButtonSelector);
};

const resetValidation = (formElememnt, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formElememnt, input);
  });
};

const setEventListeners = (formElememnt) => {
  const inputList = Array.from(formElememnt.querySelectorAll(config.inputSelector));
  const buttonElement = formElememnt.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function() {
      checkInputValidity(formElememnt, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
}

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElememnt) => {
    setEventListeners(formElememnt, config);
  });
};

enableValidation(settings);
