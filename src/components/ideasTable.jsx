import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";

class IdeasTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: (idea) => (
        <Link to={`/home/ideas/${idea._id}`}>{idea.title}</Link>
      ),
    },
    { path: "category", label: "Category" },
    // { path: "time", label: "Time" },
    {
      key: "1",
      content: (idea) => (
        <Like liked={idea.liked} onClick={() => this.props.onLike(idea)} />
      ),
    },
    {
      key: "2",
      content: (idea) => (
        <button
          onClick={() => this.props.onDelete(idea)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];
  render() {
    const { ideas, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={ideas}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default IdeasTable;
