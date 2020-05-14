import React, { Component } from "react";
import { getMaterials, getCategories } from "../services/ideaService";
import MaterialsTable from "./materialsTable";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import SearchBox from "./common/searchBox";
import { paginate } from "../utils/paginate";
import _ from "lodash";
class Materials extends Component {
  state = {
    materials: [],
    category: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedCategory: null,
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const materials = getMaterials();
    if (materials === null) {
      ///TODO
    }
    const categories_from_material = getCategories(materials);
    const category = [
      { _id: "", name: "All Category" },
      ...categories_from_material,
    ];
    this.setState({ materials: materials, category });
  }

  handleDelete = (material) => {
    const materials = this.state.materials.filter(
      (m) => m._id !== material._id
    );
    this.setState({ materials: materials }); //this.setState({ movies });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleLike = (material) => {
    const materials = [...this.state.materials];
    const index = materials.indexOf(material);
    materials[index] = { ...materials[index] };
    materials[index].liked = !materials[index].liked;
    this.setState({ materials });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleCatgorySelect = (category) => {
    console.log("material_select", category);
    this.setState({
      selectedCategory: category,
      searchQuery: "",
      currentPage: 1,
    });
    //searchQuery shouldn't be null
    //because searchQuery is the value for control component for input
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedCategory: null,
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedCategory,
      searchQuery,
      materials: all_materials,
      sortColumn,
    } = this.state;

    console.log("material_select filter", selectedCategory);
    let filtered = all_materials;
    if (searchQuery)
      filtered = all_materials.filter((m) =>
        m.keyword.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategory && selectedCategory._id) {
      filtered = all_materials.filter(
        (m) => m.category === selectedCategory.name
      );
      console.log("after filter", filtered);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const ideas = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: ideas };
  };
  render() {
    const { length: count } = this.state.materials; //ideas length를 count로 받음.
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    if (count === 0) return <p> There are no ideas in the databases</p>;

    const { totalCount, data: materials } = this.getPagedData();

    console.log("category:", this.state.category);
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.category}
            selectedItem={this.state.selectedCategory}
            onItemSelect={this.handleCatgorySelect}
          />
        </div>

        <div className="col">
          <Link
            to="/home/materials/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Materials
          </Link>
          <p> Showing {totalCount} materials in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MaterialsTable
            materials={materials}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Materials;
