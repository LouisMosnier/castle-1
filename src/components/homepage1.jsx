import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Jumbotron from "react-bootstrap/Jumbotron";
import starredHotels from "../JSONFiles/starredRelaisChateaux.json";
import CardColumns from "react-bootstrap/CardColumns";
import RelaiCard from "./relaiCard.jsx";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import GoogleMapReact from "google-map-react";
import HotelMapItem from "./hotelMapItem.jsx";
import Button from "react-bootstrap/Button";


export class HomePage1 extends Component {
  state = {
    starredHotels: starredHotels,
    searchedHotels: [],
    searchValue: "",
    sortValue: "",
    mapOn: false,
    sortingDesc: false,
    userLat: 0,
    userLng: 1
  };

  handleChange = event => {
    var searchedHotels = [];
    var searchValue = event.target.value;
    this.setState({ searchValue });
    this.state.starredHotels.forEach(hotel => {
      if (
        String(hotel.address)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.hotelName)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.restaurantName)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.chef)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.description)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        
        
      }
    });
    this.setState({ searchedHotels });
  };

  handleSelect = event => {
    var sortedHotels = [];
    var sortValue = event;
    var userLat = 0;
    var userLng = 1;
    this.setState({ sortValue });
    if (sortValue === "#stars") {
      sortedHotels = this.state.searchedHotels.sort((a, b) =>
        a.nbStars > b.nbStars ? 1 : b.nbStars > a.nbStars ? -1 : 0
      );
    }

    if (sortValue === "#prices") {
      function compareByPrice(a, b) {
        if (a.priceRange === "undefined" || a.priceRange === "") return 1;
        if (b.priceRange === "undefined" || b.priceRange === "") return -1;
        if (
          a.priceRange !== "undefined" &&
          b.priceRange !== "undefined" &&
          a.priceRange !== "" &&
          b.priceRange !== ""
        ) {
          if (
            a.priceRange.match(/\d+/g).map(Number)[0] <
            b.priceRange.match(/\d+/g).map(Number)[0]
          )
            return -1;
          if (
            a.priceRange.match(/\d+/g).map(Number)[0] >
            b.priceRange.match(/\d+/g).map(Number)[0]
          )
            return 1;
        }
        return 0;
      }
      sortedHotels = this.state.searchedHotels.sort(compareByPrice);
    }

    if (sortValue === "#distance") {
      function compareByDistance(a, b) {
        var distanceA = distanceInKmBetweenEarthCoordinates(
          userLat,
          userLng,
          a.lat,
          a.lng
        );
        var distanceB = distanceInKmBetweenEarthCoordinates(
          userLat,
          userLng,
          b.lat,
          b.lng
        );
        if (distanceA < distanceB) {
          console.log("smal");
          return -1;
        }
        if (distanceA > distanceB) {
          console.log("big");
          return 1;
        }
        return 0;
      }

      function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
      }
      function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
      }

      sortedHotels = this.state.searchedHotels;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
          sortedHotels.sort(compareByDistance);
          this.setState({ searchedHotels: sortedHotels });
        });
      }
    }

    if (sortValue === "#clearSort") {
      this.setState({ sortingDesc: false });
    } else this.setState({ sortingDesc: true });

    this.setState({ searchedHotels: sortedHotels });
  };

  render() {
    const { mapOn } = this.state;
    const { sortingDesc } = this.state;
    return (
      <>
        
        <Jumbotron className="m-3">
          <h2 className="text-center" style={{ color: "#dd4662" }}>
            Comparator
          </h2>
          <InputGroup className="mb-3">
          
         

            <Button
            
            variant="outline-success"
            href="#"
            onClick={() => this.setState({ mapOn: true })}
          >
            Map
          </Button>
          <Button
            variant="outline-success"
            href="#"
            onClick={() => this.setState({ mapOn: false })}
          >
            Close Map
          </Button>
          

            <FormControl
              placeholder="Research ... "
              aria-label="Username"
              aria-describedby="addon"
              value={this.state.searchValue}
              onChange={this.handleChange}
            />
            <DropdownButton
              alignRight
              as={InputGroup.Append}
              variant="outline-success"
              title="Order by"
              id="sort-addon"
              value={this.state.sortValue}
              onSelect={this.handleSelect}
            >
              <Dropdown.Item href="#stars">Stars</Dropdown.Item>
              <Dropdown.Item href="#prices">Hotel Price</Dropdown.Item>
              <Dropdown.Item href="#distance">
                Distance
              </Dropdown.Item>
             
            </DropdownButton>

          
          <CardColumns>
            {this.state.searchedHotels.map(relaiCard => (
              <RelaiCard key={relaiCard.id} relaiCard={relaiCard} />
            ))}
          </CardColumns>
          {this.state.mapOn && (
            <div style={{ height: "100vh", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyB64tTyWGKR9k7E1kEIpuPwR4spXgyP7R8"
                }}
                defaultCenter={{ lat: 46.795688, lng: 2.229444 }}
                defaultZoom={6}
              >
                {this.state.starredHotels.map(hotel => (
                  <HotelMapItem
                    key={hotel.id}
                    lat={Number(hotel.lat)}
                    lng={Number(hotel.lng)}
                    hotel={hotel}
                  />
                ))}
              </GoogleMapReact>
            </div>
          )}
          </InputGroup>
          {sortingDesc && (
            <ul
              className="text-center"
              style={{
                color: "#dd4662",
                listStylePosition: "inside"
              }}
            >
              
              <li style={{ fontSize: "95%" }}>
                {this.state.sortValue
                  .charAt(1)
                  .toUpperCase()
                  .concat(this.state.sortValue.substring(2))}
              </li>
            </ul>
          )}
        </Jumbotron>
      </>
    );
  }
}

export default HomePage1;