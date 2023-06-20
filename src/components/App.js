import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";

/** Основные компоненты */
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main";
import Footer from "./Footer";

/** Компоненты авторизации/регистрации */
import Login from "./Login";
import Register from "./Register";

/** Логика запросов к серверу */
import api from "../utilis/Api";
import authApi from "../utilis/AuthApi";

/** Попапы */
import InfoTooltip from "./InfoTooltip";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
/** Хуки для изменения состояния видимости попапов */
function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);

  /** Индикатор загрузки, используется в попапах во время ожидания серверного ответа */
  const [isUpdateUserLoading, setIsUpdateUserLoading] = useState(false);
  const [isUpdateAvatarLoading, setIsUpdateAvatarLoading] = useState(false);
  const [isAddPlaceLoading, setIsAddPlaceLoading] = useState(false);

  /** История */
  const history = useHistory();

  /** Стейт для подписки контекста */
  const [currentUser, setCurrentUser] = useState({});

  /** Отрисовка карточек */
  const [cards, setCards] = useState([]);
  /** Добавление новой карточки */
  const [selectedCard, setSelectedCard] = useState({});

  /** Состояние залогиненности пользователя */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /** Показывает E-mail, через который была осуществлена регистрация */
  const [headerEmail, setHeaderEmail] = useState("");

  /** Получаем всю информацию о пользователе и карточках через Promise.all, затем передаем в стейты эти данные(если isLoggedIn равен true) */
  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([profileInfo, cardData]) => {
          setCurrentUser(profileInfo);
          setCards(cardData);
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  /** Открытие попапов main компонента */
  function handleAvatarPopupOpen() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfilePopupOpen() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlacePopupOpen() {
    setIsAddPlacePopupOpen(true);
  }

  /** Закрытие любого попапа через эту функцию */
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipPopupOpen(false);
  }

  /** Лайк карточки */
  function handleCardLike(card) {
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

  /** Удаление карточки(только своей) */
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() =>
        setCards((state) => state.filter((item) => item._id !== card._id))
      )
      .catch((err) => console.log(err));
  }

  /** Меняем имя и статус пользователя */
  function handleUpdateUser(newUserInfo) {
    setIsUpdateUserLoading(true);
    api
      .setUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsUpdateUserLoading(false));
  }

  /** Меняем аватар пользователя */
  function handleUpdateAvatar(newAvatar) {
    setIsUpdateAvatarLoading(true);
    api
      .changeAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsUpdateAvatarLoading(false));
  }

  /** Добавляем новую карточку */
  function handleAddPlace(data) {
    setIsAddPlaceLoading(true);

    api
      .setCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsAddPlaceLoading(false));
  }

  /** Регистрация пользователя:
   * Если введенные данные валидны- попап успеха и переход на экран авторизации пользователя, если нет- попап отрицательного успеха
   */
  function handleRegisterUser(email, password) {
    authApi
      .registerUser(email, password)
      .then((data) => {
        if (data) {
          setIsInfoTooltipSuccess(true);
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        console.log(err);
      })
      .finally(() => setIsInfoTooltipPopupOpen(true));
  }

  /** Авторизация пользователя:
   * Если введенные данные валидны, устанавливаем E-mail в хедер, устанавливаем токен и переходим в main рут, если нет- попап отрицательного успеха
   */
  function handleAuthUser(email, password) {
    authApi
      .loginUser(email, password)
      .then((data) => {
        if (data.token) {
          setHeaderEmail(email);
          setIsLoggedIn(true);
          localStorage.setItem("jwt", data.token);
          history.push("/");
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(err);
      });
  }
  /** Проверка токена, если он валиден- сразу же переходим на main рут*/
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      authApi
        .checkToken(jwt)
        .then((data) => {
          if (data) {
            setIsLoggedIn(true);
            setHeaderEmail(data.data.email);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history]);

  /** Обработка выхода из "аккаунта":
   * Удаляем токен
   * Устанавливаем стейт E-mail на пустой,
   * Устанавливаем стейт залогиненности на false,
   * Переводим на страницу авторизации
   */
  function handleSignOut() {
    localStorage.removeItem("jwt");
    setHeaderEmail("");
    setIsLoggedIn(false);
    history.push("/sign-in");
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
            onEditProfile={handleEditProfilePopupOpen}
            onChangeAvatar={handleAvatarPopupOpen}
            onAddCard={handleAddPlacePopupOpen}
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
            onLoading={isUpdateUserLoading}
          />
          <EditAvatarPopup
            onUpdateAvatar={handleUpdateAvatar}
            isOpened={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onLoading={isUpdateAvatarLoading}
          />
          <AddPlacePopup
            onAddPlace={handleAddPlace}
            onClose={closeAllPopups}
            isOpened={isAddPlacePopupOpen}
            onLoading={isAddPlaceLoading}
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
