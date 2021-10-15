import React, { useContext, useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Header from '../components/Header';
import FavoriteCard from '../components/FavoriteCard';
import SearchBar from '../components/Searchbar';
import RecipesContext from '../context/RecipesContext';
import Footer from '../components/Footer';

const FavoriteRecipesPage = () => {
  const { searchOrHeader } = useContext(RecipesContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [filter, setFilter] = useState('');
  const handleClickFilter = (filterValue) => {
    setFilter(filterValue);
  };

  useEffect(() => {
    const verifyFavoriteRecipesExistence = () => {
      const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
      if (favoriteRecipesStorage === null) {
        localStorage.setItem('favoriteRecipes', JSON.stringify([]));
      }
    };
    verifyFavoriteRecipesExistence();
    setFavoriteRecipes(JSON.parse(localStorage.getItem('favoriteRecipes')));
  }, []);

  return (
    <div className="fade-in-effect bg-default">
      <Header pageTitle="Receitas Favoritas" showSearch={ false } />
      {searchOrHeader ? <SearchBar /> : '' }
      <ToggleButtonGroup
        type="radio"
        name="options"
        defaultValue={ 1 }
        className="d-flex flex-wrap"
      >
        <ToggleButton
          data-testid="filter-by-all-btn"
          value={ 1 }
          id="tbg-radio-1"
          variant="success"
          onClick={ () => handleClickFilter('') }
        >
          All
        </ToggleButton>
        <ToggleButton
          data-testid="filter-by-food-btn"
          value={ 2 }
          id="tbg-radio-2"
          variant="success"
          onClick={ () => handleClickFilter('comida') }
        >
          Food
        </ToggleButton>
        <ToggleButton
          data-testid="filter-by-drink-btn"
          value={ 3 }
          id="tbg-radio-3"
          variant="success"
          onClick={ () => handleClickFilter('bebida') }
        >
          Drinks
        </ToggleButton>
      </ToggleButtonGroup>
      <div
        style={
          {
            marginBottom: '3.9rem',
          }
        }
      >
        {(favoriteRecipes.length !== 0) ? favoriteRecipes
          .filter((favoriteRecipe) => favoriteRecipe.type.includes(filter))
          .map((favoriteRecipe, index) => (
            <FavoriteCard
              key={ index }
              idValue={ favoriteRecipe.id }
              typeValue={ favoriteRecipe.type }
              areaValue={ favoriteRecipe.area }
              categoryValue={ favoriteRecipe.category }
              alcoholicOrNotValue={ favoriteRecipe.alcoholicOrNot }
              nameValue={ favoriteRecipe.name }
              imgValue={ favoriteRecipe.image }
              indexValue={ index }
              setFavoriteRecipes={ setFavoriteRecipes }
            />
          )) : <h5>Nenhuma receita favorita encontrada</h5>}
      </div>
      <Footer />
    </div>
  );
};
export default FavoriteRecipesPage;
