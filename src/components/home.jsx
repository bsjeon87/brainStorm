import React, { Component } from "react";
import NavBar from "./navBar";
import { Route, Switch } from "react-router-dom";
import Ideas from "./ideas";
import Materials from "./materials";

const Home = () => {
  return (
    <React.Fragment>
      <NavBar />
      <main className="container">
        <Switch>
          <Route path="/home/ideas" component={Ideas} />
          <Route path="/home/materials" component={Materials} />
        </Switch>
      </main>
    </React.Fragment>
  );
};

export default Home;
