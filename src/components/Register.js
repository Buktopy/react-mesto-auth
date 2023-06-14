import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

function Register({ isLoggedIn, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <form
      className="auth"
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      <h1 className="auth__text">Регистрация</h1>
      <div className="auth__form">
        <input
          className="auth__input"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        ></input>
        <input
          className="auth__input"
          placeholder="Пароль"
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        ></input>
        <button className="auth__submit-button" type="submit">
          Зарегистрироваться
        </button>
      </div>
      <Link to="/sign-in" className="auth__login-link">
        Уже зарегистрированы? Войти
      </Link>
    </form>
  );
}

export default Register;
