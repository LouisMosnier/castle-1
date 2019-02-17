import React, { Component } from "react";
import Shapes from "react-shapes";
import Badge from "react-bootstrap/Badge";

class HotelMapItem extends Component {
  state = { hotelName: this.props.hotel.hotelName, openName: false };
  render() {
    return (
      <>
        <Badge size="sm" pill variant="success">
          {this.state.hotelName}
        </Badge>
        <Shapes.Triangle
          width="10"
          height="10"
          fill={{ color: "#dd4662" }}
          stroke={{ color: "#dd4662" }}
        />
      </>
    );
  }
}

export default HotelMapItem;
