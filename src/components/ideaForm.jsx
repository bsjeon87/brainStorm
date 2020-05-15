import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/fakeMovieService";

class IdeaForm extends Form {
  state = {
    data: { title: "", categoryId: "", numberInStock: "", dailyRentalRate: "" },
    materials: [],
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    categoryId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
  };

  //TODO( pick btn click)
  pickmaterial() {
    //pick 2 materials
    //show materials(setstate)
  }

  componentDidMount() {
    const materials = getMaterials();
    this.setState({ materials });

    const movieId = this.props.match.params.id;
    if (movieId === "new") return;

    const movie = getMovie(movieId);
    if (!movie) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(movie) });
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  doSubmit = () => {
    saveMovie(this.state.data);
    this.props.history.push("/movies");
  };

  render() {
    return (
      <div>
        <h1>Idea Form</h1>
        <button className="btn btn-primary">Generates 2 materials</button>

        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {
            //this.renderSelect("genreId", "Genre", this.state.genres)
          }
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default IdeaForm;
/*
const MovieForm = ({ match, history }) => {
  return (
    <div>
      <h1>Movie Form {match.params.id}</h1>;
      <button
        className="btn btn-primary"
        onClick={() => history.push("/movies")}
      >
        Save
      </button>
    </div>
  );
};

export default MovieForm;
*/
