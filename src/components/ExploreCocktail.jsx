import React from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useHistory } from 'react-router';
import recipeAPI from '../services/recipeAPI';
import Footer from './Footer';
import Header from './Header';

const ExploreMeal = () => {
  const history = useHistory();

  const handleClickRandomCockTail = async () => {
    const dataDrink = await recipeAPI('randomRecipe', '', 'drink');
    history.push(`/bebidas/${dataDrink.drinks[0].idDrink}`);
  };

  return (
    <div className="fade-in-effect bg-default">
      <Header pageTitle="Explorar Bebidas" showSearch={ false } />
      <Stack gap={ 2 } className="col-md-5 mx-auto mt-4">
        <Button
          variant="success"
          href="/explorar/bebidas/ingredientes"
          data-testid="explore-by-ingredient"
        >
          Por Ingredientes
        </Button>
        <Button
          variant="success"
          data-testid="explore-surprise"
          onClick={ handleClickRandomCockTail }
        >
          Me Surpreenda!
        </Button>
      </Stack>
      <Footer />
    </div>
  );
};

export default ExploreMeal;
