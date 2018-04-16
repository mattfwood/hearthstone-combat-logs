import React, { Component } from 'react';
import axios from 'axios';

class CardPreview extends Component {
  state = {
    card: null
  };

  componentDidMount() {
    const name = 'Dr. Boom';
    axios.defaults.headers.common['X-Mashape-Key'] =
      'hiDNPnZIZ5mshn7mb4HvG6dtL0NZp1P4wUujsnE9Ch9dOsWVF2';
    axios
      .get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${name}`)
      .then(res => {
        console.log(res);
        this.setState({ card: res.data[1] });
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  render() {
    if (this.state.card) {
      const { card } = this.state;
      return (
        <div>
          <img src={this.state.card.img} alt="" />
          {this.state.card.name}
        </div>
      );
    }

    return null;
  }
}

export default CardPreview;
