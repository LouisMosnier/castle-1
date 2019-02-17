import React, { Component } from "react";
import Card from "react-bootstrap/Card";

import Summary from "./summary.jsx";



class RelaiCard extends Component {
  state = {
    id: this.props.relaiCard.id,
    hotelName: this.props.relaiCard.hotelName,
    restaurantName: this.props.relaiCard.restaurantName,
    postalCode: this.props.relaiCard.postalCode,
    chef: this.props.relaiCard.chef,
    url: this.props.relaiCard.url,
    imageUrl: this.props.relaiCard.imageUrl,
    priceRange: this.props.relaiCard.priceRange,
    description: this.props.relaiCard.description,
    restaurantUrl: this.props.relaiCard.restaurantUrl,
    openDesc: false,
    hotelVisible: false,
    restaurantVisible: false,
    summaryVisible: true,
    restaurantPrices: this.props.relaiCard.restaurantPrices,
    nbStars: this.props.relaiCard.nbStars,
    address: this.props.relaiCard.address
  };

  handleSelect(tab) {
    //to choose which tab is visible and which one is not
    switch (tab) {
      case "#summary":
        this.setState({ hotelVisible: false });
        this.setState({ restaurantVisible: false });
        this.setState({ summaryVisible: true });
        break;
      case "#hotel":
        this.setState({ hotelVisible: true });
        this.setState({ restaurantVisible: false });
        this.setState({ summaryVisible: false });
        break;
      case "#restaurant":
        this.setState({ hotelVisible: false });
        this.setState({ restaurantVisible: true });
        this.setState({ summaryVisible: false });
        break;
      
      default:
        this.setState({ hotelVisible: true });
        this.setState({ restaurantVisible: false });
        this.setState({ summaryVisible: false });
    }
  }

  render() {
    const summary = {
      id: this.state.id,
      hotelName: this.state.hotelName,
      address: this.state.address,
      hotelUrl: this.state.url,
      imageUrl: this.state.imageUrl,
      description: this.state.description,
      priceRange: this.state.priceRange,
      openDesc: false,
      restaurantName: this.state.restaurantName,
      chef: this.state.chef,
      restaurantUrl: this.state.restaurantUrl,
      restaurantPrices: this.state.restaurantPrices,
      nbStars: this.state.nbStars
    };
  
    
    return (
      <>
        {/* to know the progress of the total scroll page */}
        <Card className="m-2" border="outline-success" style={{ width: "fill" }}>
         
          {this.state.summaryVisible ? <Summary summary={summary} /> : null}
        </Card>
      </>
    );
  }
}

export default RelaiCard;
