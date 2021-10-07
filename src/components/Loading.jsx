import React from 'react';
import { Col } from 'react-bootstrap';
import LoadingImage from './LoadingImage';
import './styles/loading.css';

const Loading = () => (
  // <div className="loading-container"><i className="fas fa-spinner loading" /></div>
  <div className="loading-container">
    <Col xs={ 12 } md={ 4 }>
      <LoadingImage />
    </Col>
  </div>
);

export default Loading;
