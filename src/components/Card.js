import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  // Видимость значка удаления карточки(если карточка владельца, видимость включена, если нет- ее не видно)
  const isOwn = card.owner._id === currentUser._id;
  const deleteButtonClassName = `card__trash-button ${
    isOwn && "card__trash-button_active"
  }`;

  // Видимость значка лайка(если пользователь лайкнул карточку- у лайка активное состояние)
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like ${
    isLiked && "card__like_active"
  }`;

  function handleCardClick() {
    onCardClick(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <article className="card">
      <img
        onClick={handleCardClick}
        className="card__image"
        alt={card.name}
        src={card.link}
      />
      <div className="card__group">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__container">
          <button
            onClick={handleLikeClick}
            type="button"
            className={cardLikeButtonClassName}
            aria-label="Нравится"
          ></button>
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
      <button
        onClick={handleDeleteClick}
        type="button"
        aria-label="Удалить элемент"
        className={deleteButtonClassName}
      />
    </article>
  );
}

export default Card;
