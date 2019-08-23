import React, { Component } from "react";
import axios from "axios";
import { Dimmer, Grid, Loader, Menu } from "semantic-ui-react";
import "./Search.css";
import { calcDistance } from "../utils";
import MapContainer from "./MapContainer";

class Search extends Component {
  state = {
    loadingData: false,
    errorMessage: "",
    coords: "",
    points: [],
    zoom: 14,
    activeItem: "",
    refreshMarker: false
  };

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "React Places | Search";

    const q = {
      query: this.props.location.state.searchText,
      key: process.env.REACT_APP_API_KEY,
      location: `${this.props.location.state.lat},${
        this.props.location.state.long
      }`,
      radius: "3000"
    };

    const url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    const fUrl =
      "https://cors-anywhere.herokuapp.com/" +
      url +
      "?query=" +
      q.query +
      "&key=" +
      q.key +
      "&location=" +
      q.location +
      "&radius=" +
      q.radius;
    const res = await axios.get(fUrl, { crossdomain: true });

    let points = [];
    res.data.results.map(point => {
      const distance = calcDistance(
        this.props.location.state.lat,
        this.props.location.state.long,
        point.geometry.location.lat,
        point.geometry.location.lng
      );
      points.push([
        point.name,
        point.geometry.location,
        distance,
        point.rating,
        point.formatted_address
      ]);
    });

    this.setState({ points, loadingData: false });
  }

  renderMenu = scroll => {
    let items = this.state.points.map((point, id) => {
      return (
        <Menu.Item
          key={id}
          name={point[0]}
          active={this.state.activeItem === point[0]}
          onClick={this.handleItemClick}
        >
          <b>{point[0]}</b>
          <br />
          <p> ({point[2]} miles away)</p>
        </Menu.Item>
      );
    });

    return (
      <Menu vertical={scroll === "verticalScrollTable"} className={scroll}>
        {items}
      </Menu>
    );
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  refreshMarker = () =>
    this.setState({ refreshMarker: !this.state.refreshMarker });

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size="massive">Loading...</Loader>
        </Dimmer>
      );
    }

    return (
      <Grid stackable>
        <Grid.Row only="large screen computer">
          <Grid.Column width={12}>
            <MapContainer
              activeItem={this.state.activeItem}
              width="60em"
              height="45em"
              refresh={this.refreshMarker}
              lat={this.props.location.state.lat}
              lng={this.props.location.state.long}
              points={this.state.points}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            {this.renderMenu("verticalScrollTable")}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="tablet">
          <Grid.Column width={12}>
            <MapContainer
              activeItem={this.state.activeItem}
              width="39em"
              height="60em"
              refresh={this.refreshMarker}
              lat={this.props.location.state.lat}
              lng={this.props.location.state.long}
              points={this.state.points}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            {this.renderMenu("verticalScrollTable")}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="mobile">
          <Grid.Row>
            <br />
            <br />
            <Grid.Column>
              {this.renderMenu("horizontalScrollTable")}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <br />
            <Grid.Column>
              <MapContainer
                activeItem={this.state.activeItem}
                width="28em"
                height="35em"
                refresh={this.refreshMarker}
                lat={this.props.location.state.lat}
                lng={this.props.location.state.long}
                points={this.state.points}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Search;
