function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup popup_open-image ${card.link ? "popup_opened" : ""}`}
    >
      <figure className="popup__img-container">
        <button
          onClick={onClose}
          type="button"
          className="popup__close"
          aria-label="Закрыть"
        ></button>
        <img className="popup__image" alt={card.name} src={card.link} />
        <figcaption className="popup__title">{card.name}</figcaption>
      </figure>
    </div>
  );
}

export default ImagePopup;
