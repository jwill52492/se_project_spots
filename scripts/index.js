const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
   },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
   },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
   },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
   },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
   },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = document.querySelector(".modal__form");
const editModalClosedButton = document.querySelector(".modal__close-button");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalClosedButton = cardModal.querySelector(".modal__close-button");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = document.querySelector(".modal__image");
const previewModalCaption = document.querySelector(".modal__caption");
const previewModalClosedButton = previewModal.querySelector(".modal__close-button_type_preview");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const overlay = document.querySelector(".modal-overlay");
const activeModal = document.querySelector("modal_opened");

function handleLike (evt) {
  evt.target.classList.toggle("card__like-button_liked")
};

function handleDeleteCard (evt) {
  evt.target.closest(".card").remove();
};

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", handleLike);

  cardDeleteButton.addEventListener("click", handleDeleteCard);

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImageElement.alt = data.name;
  });

  return cardElement;
}
function openModal(modal) {
  modal.classList.add("modal_opened");
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}
function handleEditFormSubmit(event) {
  event.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}
function handleAddCardSubmit(event) {
  event.preventDefault();
  const inputValues = {name: cardNameInput.value, link: cardLinkInput.value};
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  event.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    closeModal(activeModal);
  }
}

function handleOverlayClose(event) {
  if (event.target.classList.contains ("modal_opened")) {
    closeModal(event.target)
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, [editModalNameInput, editModalDescriptionInput], settings);
  openModal(editModal);
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


cardForm.addEventListener("submit", handleAddCardSubmit);


initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

