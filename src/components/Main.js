import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Card from "./Card";

function Main({
  cards,
  onChangeAvatar,
  onEditProfile,
  onAddCard,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <img
          className="profile__avatar"
          src={currentUser.avatar}
          alt="Фото профиля"
        />
        <button
          onClick={() => {
            onChangeAvatar(true);
          }}
          type="button"
          className="profile__avatar-edit"
          aria-label="Сменить аватар"
        ></button>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            onClick={() => {
              onEditProfile(true);
            }}
            type="button"
            className="profile__edit-button"
            aria-label="Редактировать"
          ></button>
          <h2 className="profile__about">{currentUser.about}</h2>
        </div>
        <button
          onClick={() => {
            onAddCard(true);
          }}
          type="button"
          className="profile__add-button"
          aria-label="Добавить"
        ></button>
      </section>
      <section className="cards">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
