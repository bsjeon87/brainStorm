class LoginManager {
  loginStatus = false;

  setLoginHandler(onHandler) {
    this.handler = onHandler;
  }
  setLogin(login, user) {
    this.userUID = user.uid;
    this.loginStatus = login;
    this.handler(login, user);
  }
  isLogin() {
    return this.loginStatus;
  }
}

export default new LoginManager();
