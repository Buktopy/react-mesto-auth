import PopupWithForm from "./PopupWithForm";
import { useEffect, useRef } from "react";

function AddPlacePopup({ isOpened, onClose, isLoading, onAddPlace }) {
  const nameRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
    nameRef.current.value = "";
    linkRef.current.value = "";
  }, [isOpened]);

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: nameRef.current.value,
      link: linkRef.current.value,
    });
  }

  function handlePlaceName() {
    return nameRef.current.value;
  }

  function handlePlaceLink() {
    return linkRef.current.value;
  }
  return (
    <PopupWithForm
      onSubmit={handleSubmit}
      name="add-element"
      title="Новое место"
      isOpened={isOpened}
      onClose={onClose}
      buttonText={isLoading ? "Добавление..." : "Добавить"}
    >
      <input
        ref={nameRef}
        onChange={handlePlaceName}
        autoComplete="off"
        required
        name="name"
        id="text-input"
        type="text"
        className="popup__input popup__input_type_title"
        placeholder="Название"
        minLength="2"
        maxLength="30"
      />
      <span className="popup__input-error text-input-error"></span>
      <input
        ref={linkRef}
        onChange={handlePlaceLink}
        autoComplete="off"
        required
        name="link"
        id="url-input"
        type="url"
        className="popup__input popup__input_type_image-src"
        placeholder="Ссылка на картинку"
      />
      <span className="popup__input-error url-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
