import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";

import Tags from "./common/hashTags";
import {
  getMaterials,
  addNewIdeaWithMaterials,
  updateIdeaWithMaterials,
  getIdea,
} from "../services/ideaService";

class IdeaForm extends Form {
  state = {
    data: { title: "", category: "", content: "" },
    materials: [],
    pickedMaterials: [],
    errors: {},
  };
  schema = {
    // material 하나라도 pick되어야함.

    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    category: Joi.string().required().label("Category"),
    content: Joi.string().required().label("Content"),
  };

  handleMaterialTagClick = (tag) => {
    const materials = getMaterials();
    const material = materials.find((m) => {
      return m.keyword === tag;
    });

    const filtered_tags = this.state.pickedMaterials.filter(
      (t) => t.keyword !== tag
    );
    this.state.materials.push(material);
    this.setState({ pickedMaterials: filtered_tags });
  };

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }

  //TODO( pick btn click)
  handlePickmaterial = () => {
    //show materials(setstate)
    const { materials } = this.state;
    if (materials.length === 0) {
      console.log("no material");
      return; ///더 뽑을 material 없음.
    }
    const pickedMaterials = [...this.state.pickedMaterials];

    const material_index = this.getRandomInt(0, materials.length);
    const material = { ...materials[material_index] };
    pickedMaterials.push(material);

    const new_materials = materials.filter(
      (m, index) => index !== material_index
    );
    this.setState({ pickedMaterials, materials: new_materials });
  };

  componentDidMount() {
    let materials = getMaterials();
    this.setState({ materials });

    const ideaid = this.props.match.params.id;
    this.ideaid = ideaid;
    if (ideaid === "new") return;

    const idea = getIdea(ideaid);
    if (!idea) return this.props.history.replace("/not-found");
    console.log("pickup1", idea.materials);
    console.log("materials", materials);
    this.state.pickedMaterials = materials.filter((m) => {
      for (var index in idea.materials) {
        if (m._id === idea.materials[index].material_id) return true;
      }
      return false;
    });
    materials = materials.filter((m) => {
      for (var index in this.state.pickedMaterials) {
        if (m._id === this.state.pickedMaterials[index]._id) return false;
      }
      return true;
    });

    console.log("pickup", this.state.pickedMaterials);
    this.setState({ data: this.mapToViewModel(idea) });
  }

  mapToViewModel(idea) {
    return {
      _id: idea._id,
      title: idea.title,
      category: idea.category,
      content: idea.content,
    };
  }

  async doSubmit() {
    const { pickedMaterials } = this.state;
    let idea = this.state.data;
    idea.materials = [];

    pickedMaterials.map((m) => {
      idea.materials.push({ material_id: m._id });
    });
    if (this.ideaid === "new")
      await addNewIdeaWithMaterials(idea, pickedMaterials);
    else await updateIdeaWithMaterials(idea);
    this.props.history.push("/home/ideas/");
  }

  render() {
    const { pickedMaterials } = this.state;
    const material_tags = pickedMaterials.map((m) => {
      return m.keyword; // {} 사용시 return을 명시해야함. () 인경우 return을 내포함.
    });
    return (
      <div>
        <h1>Idea Form</h1>

        <button className="btn btn-primary" onClick={this.handlePickmaterial}>
          pick materials
        </button>
        <Tags tags={material_tags} onClose={this.handleMaterialTagClick}></Tags>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {this.renderInput("title", "Title", 5)}
          {
            //this.renderSelect("genreId", "Genre", this.state.genres)
          }
          {this.renderInput("category", "Category")}
          {this.renderTextArea("content", "Content", 5)}
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
