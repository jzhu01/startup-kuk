import React from 'react';
import {Link} from 'react-router';

export default class FeedItem extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // The FeedItem's initial state is what the Feed passes to us.
  //
  // }

  render() {
    // console.log(this.props.info);
    return (
      <div>
        <img src={this.props.info[2]} alt=""/>
        <h1><Link to={"/recipe/" + this.props.info[0]}>{this.props.info[1]}</Link></h1>
        <p>
          <i className="glyphicon glyphicon-time info">{this.props.info[4]}</i>
          {this.props.info[3]}
        </p>
      </div>
    )
  }
}