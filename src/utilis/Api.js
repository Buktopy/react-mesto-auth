class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkServerResponse(res) {
    return res.ok
      ? res.json()
      : Promise.reject(`${res.status} ${res.statusText}`);
  }

  _makeRequest(url, method, body = null) {
    return fetch(`${this._baseUrl}/${url}`, {
      method,
      headers: this._headers,
      body: body ? JSON.stringify(body) : null,
    }).then((res) => this._checkServerResponse(res));
  }

  getCards() {
    return this._makeRequest("cards", "GET");
  }

  setCard({ name, link }) {
    return this._makeRequest("cards", "POST", { name, link });
  }

  deleteCard(_id) {
    return this._makeRequest(`cards/${_id}`, "DELETE");
  }

  getUserInfo() {
    return this._makeRequest("users/me", "GET");
  }

  setUserInfo(forms) {
    return this._makeRequest("users/me", "PATCH", forms);
  }

  changeAvatar(data) {
    return this._makeRequest("users/me/avatar", "PATCH", data);
  }

  // Совмещенный метод запроса- лайк и его удаление
  setLike(_id, isLiked) {
    return this._makeRequest(
      `cards/${_id}/likes`,
      `${isLiked ? "PUT" : "DELETE"}`
    );
  }
}
const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-60",
  headers: {
    authorization: "8375e570-e477-4dc4-a6bc-41730914795e",
    "Content-Type": "application/json",
  },
});

export default api;
