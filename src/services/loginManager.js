class LoginManager {
  loginStatus = false;
  setLogin(login) {
    this.loginStatus = login;
  }
  isLogin() {
    return this.loginStatus;
  }
}

export default new LoginManager();
