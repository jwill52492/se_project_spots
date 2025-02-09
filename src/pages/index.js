import "./index.css";
import { enableValidation, validationConfig } from "../scripts/validation.js";
import Api from "../utils/Api.js";

//const initialCards = [
  //{
    //name: "Val Thorens",
    //link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  //},
  //{
    //name: "Restaurant terrace",
    //link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  //},
  //{
    //name: "An outdoor cafe",
    //link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  //},
  //{
    //name: "A very long bridge, over the forest and through the trees",
    //link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  //},
  //{
    //name: "Tunnel with morning light",
    //link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  //},
  //{
    //name: "Mountain house",
    //link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  //},
//];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "30d363a4-0523-477a-9b2a-fd32a4407d5b",
    "Content-Type": "application/json"
  },
});

api.getAppinfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
  });
})
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = document.querySelector(".modal__form");
const editModalClosedButton = document.querySelector(".modal__close-button");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalClosedButton = cardModal.querySelector(".modal__close-button");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = document.querySelector(".modal__image");
const previewModalCaption = document.querySelector(".modal__caption");
const previewModalClosedButton = previewModal.querySelector(".modal__close-button");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
//const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalClosedButton = avatarModal.querySelector(".modal__close-button");
const avatarinput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const modalOverlays = document.querySelectorAll(".modal");

let selectedCard;
let SelectedCardId;

function handleLike(event, id) {
  //event.target.classList.toggle("card__like-button_liked");
  const isLiked = document.querySelector("card__like-button_liked");
  changeLikeStatus = ToggleEvent();
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  SelectedCardId = data;
  openModal(deleteModal);
}

function handleDeleteSubmit(event) {
  event.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      cardElement.remove();
      closeModal(cardModal);
    })
    .catch(console.error);
};



function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");


  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => handleLike(data.id));
  cardDeleteButton.addEventListener("click", () => handleDeleteCard(cardElement, data));

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImageElement.alt = data.name;
  });

  return cardElement;
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener('keyup', handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener('keyup', handleEscape);
}

function handleEditFormSubmit(event) {
  event.preventDefault();
  api
    .editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
    .then((_data) => {
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
    })
    .catch(console.error);
}

function handleAddCardSubmit(event) {
  event.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  event.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

function handleAvatarSubmit(event) {
  event.preventDefault();
  api
    .editAvatarInfo(avatarinput.value)
    .then(() => {
    closeModal(avatarModal);
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);

  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );

});

editModalClosedButton.addEventListener("click", () => {
  closeModal(editModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalClosedButton.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalClosedButton.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalClosedButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

modalOverlays.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(validationConfig);