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

  //
  const [currentUser, setCurrentUser] = useState({});
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);

  //В разработке
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerEmail, setHeaderEmail] = useState("");

  // Индикатор загрузки, используется в попапах во время ожидания серверного ответа
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .getUserInfo()
      .then((profileInfo) => setCurrentUser(profileInfo))
      .catch((err) => console.log(err));

    api
      .getCards()
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

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipPopupOpen(false);
  }

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

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() =>
        setCards((state) => state.filter((item) => item._id !== card._id))
      )
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(newUserInfo) {
    setIsLoading(true);
    api
      .setUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

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

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    console.log(jwt);
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
          {isLoggedIn && <Footer />}
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
