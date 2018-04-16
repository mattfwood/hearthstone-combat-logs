// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import CardPreview from './CardPreview';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h5>Left Side</h5>
          <CardPreview />
        </div>
      </div>
    );
  }
}
