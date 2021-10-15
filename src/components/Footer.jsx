import React from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import exploreIcon from '../images/exploreIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import './styles/footer.css';

const Footer = () => {
  const history = useHistory();

  return (
    <Nav className="footer-container fixed-bottom" data-testid="footer">
      <Nav.Item
        onClick={ () => history.push('/bebidas') }
      >
        <img src={ drinkIcon } alt="bebidas" data-testid="drinks-bottom-btn" />
      </Nav.Item>
      <Nav.Item
        onClick={ () => history.push('/explorar') }
      >
        <img src={ exploreIcon } alt="explorar" data-testid="explore-bottom-btn" />
      </Nav.Item>
      <Nav.Item
        onClick={ () => history.push('/comidas') }
      >
        <img src={ mealIcon } alt="comidas" data-testid="food-bottom-btn" />
      </Nav.Item>
    </Nav>
  );
};

export default Footer;
