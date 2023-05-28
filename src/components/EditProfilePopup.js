import PopupWithForm from "./PopupWithForm";
import React, { useContext, useState, useEffect } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpened, onClose, onUpdateUser, onLoading }) {
  const currentUser = useContext(CurrentUserContext);
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, isOpened]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: name,
      about: about,
    });
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value);
  }

  return (
    <PopupWithForm
      onSubmit={handleSubmit}
      isOpened={isOpened}
      onClose={onClose}
      buttonText={onLoading && "Сохранение..."}
      name="edit-profile"
      title="Редактировать профиль"
    >
      <input
        onChange={handleChangeName}
        value={name || ""}
        autoComplete="off"
        required
        name="name"
        id="name-input"
        type="text"
        className="popup__input popup__input_type_name"
        placeholder="Введите имя"
        minLength="2"
        maxLength="40"
      />
      <span className="name-input-error popup__input-error"></span>
      <input
        onChange={handleChangeAbout}
        value={about || ""}
        autoComplete="off"
        required
        name="about"
        id="about-input"
        type="text"
        className="popup__input popup__input_type_about"
        placeholder="О себе"
        minLength="2"
        maxLength="200"
      />
      <span className="about-input-error popup__input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
