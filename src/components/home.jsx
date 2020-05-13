import React, { Component } from "react";
import NavBar from "./navBar";
import { Route, Switch, Redirect } from "react-router-dom";
import Ideas from "./ideas";
import Materials from "./materials";
import LoginManager from "../services/loginManager";

const Home = () => {
  const isLogin = LoginManager.isLogin();
  console.log("islogin", isLogin);
  return (
    <React.Fragment>
      <NavBar />
      <main className="container">
        <Switch>
          {isLogin === true && <Route path="/home/ideas" component={Ideas} />}
          {isLogin == true && (
            <Route path="/home/materials" component={Materials} />
          )}
        </Switch>
      </main>
    </React.Fragment>
  );
};

export default Home;
