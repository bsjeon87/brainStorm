import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";

class MaterialsTable extends Component {
  columns = [
    {
      path: "keyword",
      label: "keyword",
      content: (material) => (
        <Link to={`/home/materials/${material._id}`}>{material.keyword}</Link>
      ),
    },
    { path: "category", label: "Category" },
    // { path: "time", label: "Time" },
    {
      key: "1",
      content: (material) => (
        <Like
          liked={material.liked}
          onClick={() => this.props.onLike(material)}
        />
      ),
    },
    {
      key: "2",
      content: (material) => (
        <button
          onClick={() => this.props.onDelete(material)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];
  render() {
    const { materials, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={materials}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MaterialsTable;
