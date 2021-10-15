import React, { useContext, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Header from '../components/Header';
import FavoriteCard from '../components/FavoriteCard';
import SearchBar from '../components/Searchbar';
import RecipesContext from '../context/RecipesContext';
import Footer from '../components/Footer';

const START_FAVORITES = JSON.parse(localStorage.getItem('favoriteRecipes'));

const FavoriteRecipesPage = () => {
  const { searchOrHeader } = useContext(RecipesContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState(START_FAVORITES);
  const [filter, setFilter] = useState('');
  const handleClickFilter = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="fade-in-effect bg-default">
      <Header pageTitle="Receitas Favoritas" showSearch={ false } />
      {searchOrHeader ? <SearchBar /> : '' }
      <hr />
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
      {favoriteRecipes !== null ? favoriteRecipes
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
        )) : <h1>Nenhum receita favorita encontrada</h1>}
      <Footer />
    </div>
  );
};
export default FavoriteRecipesPage;
