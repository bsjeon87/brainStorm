import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import LoginManager from "./services/loginManager";
import LoginPopup from "./components/loginPopup";
import Home from "./components/home";

class App extends Component {
  render() {
    const isLogin = LoginManager.isLogin();
    console.log("isLogin", isLogin);
    return (
      <main className="container">
        {isLogin == false && <Redirect to="/login"></Redirect>}

        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={LoginPopup} />
          <Redirect from="/" exact to="/home"></Redirect>
        </Switch>
      </main>
    );
  }
}

export default App;
