class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _request(url, method, body = null) {
    const options = {
      method,
      headers: this._headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this._baseUrl}/${url}`, options);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  getCards() {
    return this._request("cards", "GET");
  }

  setCard({ name, link }) {
    return this._request("cards", "POST", { name, link });
  }

  deleteCard(_id) {
    return this._request(`cards/${_id}`, "DELETE");
  }

  getUserInfo() {
    return this._request("users/me", "GET");
  }

  setUserInfo(forms) {
    return this._request("users/me", "PATCH", forms);
  }

  changeAvatar(data) {
    return this._request("users/me/avatar", "PATCH", data);
  }

  // Совмещенный метод запроса- лайк и его удаление
  setLike(_id, isLiked) {
    const method = isLiked ? "PUT" : "DELETE";
    return this._request(`cards/${_id}/likes`, method);
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
