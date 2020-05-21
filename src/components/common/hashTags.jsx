import React, { Component } from "react";
import "./css/tags.css";

class Tags extends Component {
  render() {
    const { tags, onClose } = this.props;
    console.log(tags);
    return (
      <div className="tags-input" data-name="tags-input">
        {tags.map((tag) => {
          return (
            <span className="tag">
              {tag}
              <span className="close" onClick={() => onClose(tag)}></span>
            </span>
          );
        })}
      </div>
    );
  }
}

export default Tags;
