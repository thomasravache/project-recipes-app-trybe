import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

/** Recebe Valores via Props de Bebidas e Comidas */
const RecipesCards = ({ nameValue, indexValue, thumbValue, onClick, styles }) => (
  <Card
    bg="light"
    data-testid={ `${indexValue}-recipe-card` }
    style={ { width: '9.7rem', textAlign: 'center' } }
    className={ styles }
    onClick={ onClick }
  >
    <Card.Img
      data-testid={ `${indexValue}-card-img` }
      variant="top"
      src={ thumbValue }
    />
    <Card.Header
      className="d-flex align-items-center justify-content-center"
      data-testid={ `${indexValue}-card-name` }
      style={ {
        height: '100%',
        color: 'white',
        backgroundColor: '#1B4332',
        borderRadius: '0 0 0.25rem 0.25rem',
        borderBottom: '1px solid 1px solid rgba(0,0,0,.125)',
      } }
    >
      { nameValue }
    </Card.Header>
  </Card>
);

RecipesCards.propTypes = {
  nameValue: PropTypes.string.isRequired,
  indexValue: PropTypes.number.isRequired,
  thumbValue: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  styles: PropTypes.string.isRequired,
};

export default RecipesCards;
