import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utilis/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="main">
          <Header />
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

          <Route path="/sign-up">
            <Register />
          </Route>
          <Route path="/sign-in">
            <Login />
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
          {isLoggedIn && <Footer />}
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
