function PopupWithForm({
  name,
  title,
  onClose,
  isOpened,
  children,
  buttonText,
  onSubmit,
}) {
  return (
    <div className={`popup popup_${name} ${isOpened ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          onClick={onClose}
          type="button"
          className="popup__close"
          aria-label="Закрыть"
        />
        <h2 className="popup__text">{`${title}`}</h2>
        <form name={name} className="popup__form" onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            name="submitForm"
            className="popup__button"
            aria-label="Подтвердить"
          >
            {buttonText || "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
