import axios from "axios";
import baseURL from "./baseURL";

class AuthService {
  login(data) {
    let url = baseURL();
    return axios
      .post(url + "auth/signin", { username: data.username, password: data.password, module: data.module })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch(err => {
        localStorage.removeItem("user");
      });
  }

  logout() {
    localStorage.clear();
  }

  register(username, email, password) {
    return axios.post(baseURL() + "auth/signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
