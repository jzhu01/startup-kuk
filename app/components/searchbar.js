import React from 'react';

export default class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  // onSearch(searchText) {
  //   // If searchText is 'sandals', navigates to #/search/q?=sandals
  //   this.context.router.push({ pathname: "/search", query: { q: searchText } });
  // }

  handleChange(e) {
    e.preventDefault();
    this.setState({value: e.target.value});
  }

  handleKeyUp(e) {
    e.preventDefault();
    if (e.key == "Enter") {
      var search = this.state.value.trim();
      if (search !== "") {
        // Search keyword
        this.props.onSearch(this.state.value);
        this.setState({value: ""});
      }
    }
  }

  handleClick(e) {
    e.preventDefault();
    var search = this.state.value.trim();
    if (search !== "") {
      // Search keyword
      this.props.onSearch(this.state.value);
      this.setState({value: ""});
    }
  }

  render() {
    return (
      <div className="results">
        <form className="large-search" role="search">
          <div className="input-group">
            <input type="text" className="form-control kuk-search" placeholder="Search Kuk"
              value={this.state.value} onChange={(e) => this.handleChange(e)}
              onKeyUp={(e) => this.handleKeyUp(e)} />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-default" onClick={(e) => this.handleClick(e)}>
                <span className="glyphicon glyphicon-search"></span>
              </button>
            </span>
          </div>
        </form>
      </div>
    )
  }
}

// Searchbar.contextTypes = {
//   router: React.PropTypes.object.isRequired
// };