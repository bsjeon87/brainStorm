import React, { Component } from "react";
//columns: array
//sortColumn: object
//onSort: function
class TableHeader extends Component {
  raiseSort = (path) => {
    const sortColumn = { ...this.props.sortColumn };
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }
    this.props.onSort(sortColumn);
  };

  /* notice jsx의 경우 <>확장 문법을 사용하는 경우는 return(element)을 하도록 해야함.
        columns.map(column => ( <> ) ) 문법의 경우는 ()가 return ()의 의미임.
        {
            this.props.columns.map((column) => {
            console.log(column);
            return <th>1</th>;
          })}

  */

  renderSortIcon = (column) => {
    const { sortColumn } = this.props;

    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order == "asc") return <i className="fa fa-sort-asc"></i>;
    return <i className="fa fa-sort-desc"></i>;
  };
  render() {
    return (
      <thead>
        <tr>
          {this.props.columns.map((column) => {
            if (column.path != undefined) {
              return (
                <th
                  className="clickable"
                  key={column.path}
                  onClick={() => this.raiseSort(column.path)}
                >
                  {column.label} {this.renderSortIcon(column)}
                </th>
              );
            }
            return <th key={column.key}></th>;
          })}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
