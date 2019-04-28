import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Card, Dimmer, Form, Grid, Icon, Input, Loader, Modal } from 'semantic-ui-react';

class Home extends Component {
  state = {
    loadingData: false,
    query: '',
    redirect: false,
    coords: ""
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "React Places";
    await this.getPosition();

    this.setState({ loadingData: false });
  }

  getPosition = async () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    let success = (pos) => {
      this.setState({ coords: pos.coords });
    }

    let error = (err) => {
      this.setState({ errorMessage: err.message });
    }

    if (!window.navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    window.navigator.geolocation.getCurrentPosition(success, error, options);
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    if (this.state.redirect) {
      return <Redirect push to={{ pathname: '/search', state: { searchText: this.state.query, lat: this.state.coords.latitude, long: this.state.coords.longitude } }} />
    }

    return (
      <Grid stackable centered>
        <br /> <br /> <br />
        <Card fluid color='green'>
          <Card.Content>
            <br /><br />
            <Card.Header><h1>Hi There!</h1></Card.Header>
            <br /><br />
            <Card.Description>
              <Modal trigger={<Button primary basic><Icon name='location arrow' />Search Places</Button>}>
                <Modal.Header>Search Places</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Form onSubmit={() => this.setState({ redirect: true })}>
                      <Form.Group inline>
                        <Form.Field width={8}>
                          <Input focus
                            placeholder="Search for 'pizza'"
                            onChange={event => this.setState({ query: event.target.value })}
                            icon={<Button size='small' floated='right' primary icon='search' />} />
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Modal.Description>
                </Modal.Content>
              </Modal>
              <br /><br />
            </Card.Description>
          </Card.Content>
        </Card>
      </Grid >
    );
  }
}

export default Home;