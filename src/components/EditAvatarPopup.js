import PopupWithForm from "./PopupWithForm";
import { useRef, useEffect } from "react";

function EditAvatarPopup({ isOpened, onClose, onUpdateAvatar, onLoading }) {
  const avatarRef = useRef(null);

  useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpened]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  function handleChangeAvatar() {
    return avatarRef.current.value;
  }

  return (
    <PopupWithForm
      onSubmit={handleSubmit}
      name="edit-avatar"
      title="Обновить аватар"
      isOpened={isOpened}
      onClose={onClose}
      buttonText={onLoading ? "Обновление..." : "Обновить"}
    >
      <input
        ref={avatarRef}
        onChange={handleChangeAvatar}
        autoComplete="off"
        required
        name="avatar"
        id="url-input-avatar"
        type="url"
        className="popup__input popup__input_type_image-src"
        placeholder="Ссылка на картинку"
      />
      <span className="popup__input-error url-input-avatar-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
