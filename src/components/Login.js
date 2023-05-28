import { Redirect } from "react-router-dom";

function Login(isLoggedIn) {
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login">
      <h1 className="login__text">Вход</h1>
      <form className="login__form">
        <input className="login__input" placeholder="Email"></input>
        <input className="login__input" placeholder="Пароль"></input>
        <button className="login__submit-button">Войти</button>
      </form>
    </div>
  );
}

export default Login;