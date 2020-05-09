class LoginManager {
  loginStatus = false;

  setLoginHandler(onHandler) {
    this.handler = onHandler;
  }
  setLogin(login) {
    this.loginStatus = login;
    this.handler(login);
  }
  isLogin() {
    return this.loginStatus;
  }
}

export default new LoginManager();
