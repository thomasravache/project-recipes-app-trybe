import React, { useContext } from 'react';
import Header from '../components/Header';
import RecipesCards from '../components/RecipesCards';
import RecipesContext from '../context/RecipesContext';

const CocktailRecipePage = () => {
  const { recipes, categorys } = useContext(RecipesContext);
  const getContext = useContext(RecipesContext);
  const sizeListRecipes = 12;
  const sizeListCategorys = 5;

  const handleFilterCategory = (strCategory) => {
    getContext.filterRecipes(strCategory);
  };

  return (
    <>
      <div>
        {/** É necessario passar props pageTitle com o valor
         * de: Bebidas para ser mostrado no header */}
        <Header pageTitle="Bebidas" />
      </div>

      {/** Mostra 5 botões com as primeiras cateforias da requisição */}
      <div>
        {
          categorys
            .slice(0, sizeListCategorys)
            .map((category, index) => (
              <button
                data-testid={ `${category.strCategory}-category-filter` }
                key={ index }
                type="button"
                onClick={ () => handleFilterCategory(category.strCategory) }
              >
                { category.strCategory }
              </button>
            ))
        }
      </div>

      {/** Renderiza os Cards com as Comidas */}
      <div style={ { display: 'flex', flexWrap: 'wrap' } }>
        {
          recipes
            .slice(0, sizeListRecipes)
            .map((recipe, index) => (
              <RecipesCards
                key={ index }
                nameValue={ recipe.strDrink }
                indexValue={ index }
                thumbValue={ recipe.strDrinkThumb }
              />
            ))
        }
      </div>
    </>
  );
};

export default CocktailRecipePage;
