import React from 'react';
import {Link} from 'react-router';


export default class CalenderEntry extends React.Component {

  render () {
    return (
      <li>
        <Link to={"/recipe/" + this.props._id} className="list-group-item-text">{this.props.data.name}</Link>
          <img src={this.props.data.img} alt={this.props.data._id} className="img-rounded croppedimg" />

        </li>
  )
}
}
