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
      <React.Fragment>
        {isLogin === false && <Redirect to="/login"></Redirect>}

        <div>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/login" component={LoginPopup} />
            {isLogin === true && (
              <Redirect from="/" exact to="/home"></Redirect>
            )}
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
