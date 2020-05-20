import React, { Component } from "react";
import { getIdeas, getCategories, removeIdea } from "../services/ideaService";
import IdeasTable from "./ideasTable";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import SearchBox from "./common/searchBox";
import { paginate } from "../utils/paginate";
import _ from "lodash";
class Ideas extends Component {
  state = {
    ideas: [],
    category: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedCategory: null,
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const ideas = getIdeas();
    if (ideas === null) {
      ///TODO
    }
    const categories_from_idea = getCategories(ideas);
    const category = [
      { _id: "", name: "All Category" },
      ...categories_from_idea,
    ];
    this.setState({ ideas: ideas, category });
  }

  handleDelete = (idea) => {
    const ideas = this.state.ideas.filter((m) => m._id !== idea._id);
    this.setState({ ideas: ideas }); //this.setState({ movies });
    removeIdea(idea);
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleLike = (idea) => {
    const ideas = [...this.state.ideas];
    const index = ideas.indexOf(idea);
    ideas[index] = { ...ideas[index] };
    ideas[index].liked = !ideas[index].liked;
    this.setState({ ideas });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleCatgorySelect = (category) => {
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
      ideas: all_ideas,
      sortColumn,
    } = this.state;

    let filtered = all_ideas;
    if (searchQuery)
      filtered = all_ideas.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategory && selectedCategory._id)
      filtered = all_ideas.filter((m) => m.category === selectedCategory.name);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const ideas = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: ideas };
  };
  render() {
    const { length: count } = this.state.ideas; //ideas length를 count로 받음.
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    //  if (count === 0) return <p> There are no ideas in the databases</p>;
    let category_filter = [];
    category_filter = this.state.category.filter((c) => {
      if (category_filter.includes(c.name) === true) return false;
      category_filter.push(c.name);
      return true;
    });

    const { totalCount, data: ideas } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={category_filter}
            selectedItem={this.state.selectedCategory}
            onItemSelect={this.handleCatgorySelect}
          />
        </div>

        <div className="col">
          <Link
            to="/home/ideas/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New idea
          </Link>
          <p> Showing {totalCount} ideas in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <IdeasTable
            ideas={ideas}
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

export default Ideas;
