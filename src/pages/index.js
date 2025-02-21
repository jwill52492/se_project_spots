import "../pages/index.css";
import { enableValidation, resetValidation, validationConfig } from "../scripts/validation.js";
import Api from "../utils/Api.js";


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "30d363a4-0523-477a-9b2a-fd32a4407d5b",
    "Content-Type": "application/json"
  },
});

api.getAppInfo().then(res => {
  res[0].forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
  });

  profileName.textContent = res[1].name;
  profileDescription.textContent = res[1].about;
  document.querySelector(".profile__avatar").src = res[1].avatar;
}).catch(error => console.log(error));

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-button");
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
const previewModalClosedButton = previewModal.querySelector(".modal__close-button");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalClosedButton = avatarModal.querySelector(".modal__close-button");
const avatarinput = avatarModal.querySelector("#avatar-input");
const avatarImage = document.querySelector(".profile__avatar");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const cancelDeleteButton = document.querySelector(".modal__submit-button-cancel");
const deleteSubmitButton = document.querySelector(".modal__submit-button-delete");
const deleteClosedButton = deleteModal.querySelector(".modal__close-button_type_delete");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const modalOverlays = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll('.modal__close');

let selectedCard;
let selectedCardId;


closeButtons.forEach((button) => {
  const popup = button.closest('.modal');
  button.addEventListener('click', () => closePopup(popup));
});

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data;
  openModal(deleteModal);
}

function handleDeleteSubmit(event) {
  event.preventDefault();

  const submitButton = event.submitter;
  submitButton.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Delete";
    });
};



function handleLike(event, cardId) {
  event.preventDefault();

  const isLiked = event.target.classList.contains("card__like-button_liked");

  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      event.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error)
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");


  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }


  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;




  cardLikeButton.addEventListener("click", (event) => handleLike(event, data._id));
  cardDeleteButton.addEventListener("click", () => handleDeleteCard(cardElement, data._id));

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

  const submitButton = event.submitter;
  submitButton.textContent = "Saving...";

  api
    .editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
    .then((_data) => {
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
      resetValidation(editFormElement,  [
        editModalNameInput,
        editModalDescriptionInput
      ], validationConfig)
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

 function handleAddCardSubmit(event) {
   event.preventDefault();

   const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
   const submitButton = event.submitter;
   submitButton.textContent = "Saving...";

  api
    .postCards(inputValues)
    .then((res) => {
      const cardElement = getCardElement(res);
      cardsList.prepend(cardElement);
      event.target.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

function handleAvatarSubmit(event) {
  event.preventDefault();


  const submitButton = event.submitter;
  submitButton.textContent = "Saving...";

  api
    .editAvatarInfo(avatarinput.value)
    .then((res) => {
      avatarImage.src = res.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

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

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalClosedButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);
deleteClosedButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal)
});

deleteSubmitButton.addEventListener("click", () => {
  closeModal(deleteModal)
});

cardForm.addEventListener("submit", handleAddCardSubmit);


modalOverlays.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});



enableValidation(validationConfig);