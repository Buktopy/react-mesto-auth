import { Redirect } from "react-router-dom";

function Register(isLoggedIn) {
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="register">
      <h1 className="register__text">Вход</h1>
      <form className="register__form">
        <input className="register__input" placeholder="Email"></input>
        <input className="register__input" placeholder="Пароль"></input>
        <button className="register__submit-button">Зарегистрироваться</button>
      </form>
      <a className="register__login-link" href="/">
        Уже зарегистрированы? Войти
      </a>
    </div>
  );
}

export default Register;
