function InfoTooltip({ isOpened, onClose, isSuccess }) {
  return (
    <div className={`popup ${isOpened ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          onClick={onClose}
          type="button"
          className="popup__close"
          aria-label="Закрыть"
        />
        <div
          className={`popup__success ${
            isSuccess ? "popup__success_type_ok" : "popup__success_type_fail"
          }`}
        ></div>
        <h1 className="popup__text">
          {isSuccess
            ? "Вы успешно зарегистрировались!"
            : "Что то пошло не так! Попробуйте еще раз"}
        </h1>
      </div>
    </div>
  );
}

export default InfoTooltip;
