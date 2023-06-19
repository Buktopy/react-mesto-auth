import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";

// Основные компоненты
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main"; // Используется только в ProtectedRoute
import Footer from "./Footer";

// Компоненты авторизации/регистрации
import Login from "./Login";
import Register from "./Register";

// Логика запросов к серверу
import api from "../utilis/Api";
import authApi from "../utilis/AuthApi";

// Попапы
import InfoTooltip from "./InfoTooltip";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";

function App() {
  // Хуки для изменения состояния видимости попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);

  // Индикатор загрузки, используется в попапах во время ожидания серверного ответа
  const [isLoading, setIsLoading] = useState(false);

  // История
  const history = useHistory();

  // Стейт для подписки контекста
  const [currentUser, setCurrentUser] = useState({});

  // Отрисовка карточек
  const [cards, setCards] = useState([]);
  // Добавление новой карточки
  const [selectedCard, setSelectedCard] = useState({});

  // Состояние залогиненности пользователя
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Показывает E-mail, через который была осуществлена регистрация
  const [headerEmail, setHeaderEmail] = useState("");

  useEffect(() => {
    api
      .getUserInfo() // Получаем данные пользователя
      .then((profileInfo) => setCurrentUser(profileInfo)) // Переносим в стейт данные
      .catch((err) => console.log(err));

    api
      .getCards() // Получаем карточки с сервера, описываем логику что где куда в setCards
      .then((data) => {
        setCards(
          data.map((card) => ({
            _id: card._id,
            name: card.name,
            link: card.link,
            likes: card.likes,
            owner: card.owner,
          }))
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // Закрытие любого попапа через эту функцию
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipPopupOpen(false);
  }

  function handleCardLike(card) {
    // Лайк карточки
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    api
      .setLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    // Удаление СВОЕЙ карточки
    api
      .deleteCard(card._id)
      .then(() =>
        setCards((state) => state.filter((item) => item._id !== card._id))
      )
      .catch((err) => console.log(err));
  }

  // Меняем имя и статус пользователя
  function handleUpdateUser(newUserInfo) {
    setIsLoading(true); // Лоадер
    api
      .setUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data); // Меняем данные в стейте
        closeAllPopups(); // Закрываемся
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false)); // Лоадер всё
  }

  // Меняем аватар пользователя
  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);
    api
      .changeAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  // Добавляем новую карточку
  function handleAddPlace(data) {
    setIsLoading(true);

    api
      .setCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleRegisterUser(email, password) {
    // Регистрация пользователя
    authApi
      .registerUser(email, password) // Отправляем данные на сервер
      .then((data) => {
        if (data) {
          // Если всё правильно
          setIsInfoTooltipSuccess(true); // Попап успеха
          history.push("/sign-in"); // Переводим на рут авторизации
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false); // Попап отрицательного успеха
        console.log(err);
      })
      .finally(() => setIsInfoTooltipPopupOpen(true)); // Открываем попап ошибки/успеха
  }

  // Авторизация пользователя
  function handleAuthUser(email, password) {
    authApi
      .loginUser(email, password)
      .then((data) => {
        if (data.token) {
          setHeaderEmail(email); // В хедер записываем E-mail
          setIsLoggedIn(true); // Меняем стейт для доступа к Main компоненту
          localStorage.setItem("jwt", data.token); // Сохраняем токен для последующий заходов без авторизации
          history.push("/"); // Переводим на главный рут
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(err);
      });
  }

  useEffect(() => {
    // Проверка токена авторизованности
    const jwt = localStorage.getItem("jwt");
    console.log(jwt);
    if (jwt) {
      authApi
        .checkToken(jwt)
        .then((data) => {
          if (data) {
            // Если данные валидны
            setIsLoggedIn(true); // Допускаем к компоненту Main
            setHeaderEmail(data.data.email); // В хедер записываем E-mail
            history.push("/"); // Переводим на главный рут
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history]);

  function handleSignOut() {
    // Выход из "аккаунта"
    localStorage.removeItem("jwt"); // Удаляем токен
    setHeaderEmail(""); // Убираем из хедера E-mail
    setIsLoggedIn(false); // Перевод стейта для блока к главному руту
    history.push("/sign-in"); // Перевод пользователя на экран авторизации
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="main">
          <Header
            signIn="Войти"
            signUp="Регистрация"
            signOut="Выйти"
            onSignOut={handleSignOut}
            headerEmail={headerEmail}
          />
          <ProtectedRoute
            component={Main}
            onEditProfile={setIsEditProfilePopupOpen}
            onChangeAvatar={setIsEditAvatarPopupOpen}
            onAddCard={setIsAddPlacePopupOpen}
            onCardClick={setSelectedCard}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            isLoggedIn={isLoggedIn}
            path="/"
          />
          <Route path="/sign-in">
            <Login onLogin={handleAuthUser} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={handleRegisterUser} />
          </Route>
          <Route>
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
          {isLoggedIn && <Footer />}
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <EditProfilePopup
            onUpdateUser={handleUpdateUser}
            isOpened={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
          />
          <EditAvatarPopup
            onUpdateAvatar={handleUpdateAvatar}
            isOpened={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
          />
          <AddPlacePopup
            onAddPlace={handleAddPlace}
            onClose={closeAllPopups}
            isOpened={isAddPlacePopupOpen}
            onLoading={isLoading}
          />
          <InfoTooltip
            isSuccess={isInfoTooltipSuccess}
            isOpened={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
