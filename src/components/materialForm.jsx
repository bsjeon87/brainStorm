import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { Link } from "react-router-dom";
import {
  getIdeas,
  getMaterial,
  updateMaterial,
  addNewMaterial,
} from "../services/ideaService";

class MaterialForm extends Form {
  state = {
    data: { keyword: "", category: "" },
    ideas: [],
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    keyword: Joi.string().required().label("Keyword"),
    category: Joi.string().required().label("Category"),
  };

  componentDidMount() {
    const ideas = getIdeas();
    const materialId = this.props.match.params.id;
    this.materialId = materialId;
    if (materialId === "new") return;

    const material = getMaterial(materialId);
    if (!material) return this.props.history.replace("/not-found");
    this.state.ideas = [
      ...ideas.filter((i) => {
        for (var index in i.materials) {
          if (material._id === i.materials[index].material_id) return true;
        }
        return false;
      }),
    ];
    this.setState({ data: this.mapToViewModel(material) });
  }

  mapToViewModel(material) {
    return {
      _id: material._id,
      keyword: material.keyword,
      category: material.category,
    };
  }

  async doSubmit() {
    let material = this.state.data;

    if (this.materialId === "new") await addNewMaterial(material);
    else await updateMaterial(material);
    this.props.history.push("/home/materials/");
  }

  render() {
    const { ideas } = this.state;
    return (
      <div>
        <h1>Material Form</h1>
        <div align="right">
          <div>related ideas</div>
          {ideas.map((i) => {
            return <Link to={`/home/ideas/${i._id}`}>{i.title}</Link>;
          })}
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {this.renderInput("keyword", "Keyword")}
          {
            //this.renderSelect("genreId", "Genre", this.state.genres)
          }
          {this.renderInput("category", "Category")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MaterialForm;
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
