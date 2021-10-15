import React, { useContext, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MakeRecipesCards from '../components/MakeRecipesPageCards';
import SearchBar from '../components/Searchbar';
import RecipesContext from '../context/RecipesContext';

const MakeRecipesPage = () => {
  const [filter, setFilter] = useState('');
  const { searchOrHeader } = useContext(RecipesContext);
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));

  /** Seta o tipo de filtro no estado */
  const handleClickFilter = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="fade-in-effect bg-default">
      <Header pageTitle="Receitas Feitas" showSearch={ false } />
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
      <hr />
      {
        doneRecipes ? doneRecipes
          .filter((doneRecipe) => doneRecipe.type.includes(filter))
          .map((doneRecipe, index) => (
            <MakeRecipesCards
              key={ index }
              imgValue={ doneRecipe.image }
              categoryValue={ doneRecipe.category }
              nameValue={ doneRecipe.name }
              dateValue={ doneRecipe.doneDate }
              tagValue={ doneRecipe.tags }
              indexValue={ index }
              areaValue={ doneRecipe.area }
              alcoholicOrNotValue={ doneRecipe.alcoholicOrNot }
              idValue={ doneRecipe.id }
              typeValue={ doneRecipe.type }
            />
          )) : 'Nenhuma receita finalizada.'
      }
      <Footer />
    </div>
  );
};
export default MakeRecipesPage;
