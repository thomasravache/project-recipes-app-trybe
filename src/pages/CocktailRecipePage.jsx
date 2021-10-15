import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CardGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Header from '../components/Header';
import SearchBar from '../components/Searchbar';
import RecipesContext from '../context/RecipesContext';
import Footer from '../components/Footer';
import RecipesCards from '../components/RecipesCards';
import recipeAPI from '../services/recipeAPI';
import Loading from '../components/Loading';
import './styles/mealOrCocktailPage.css';

const CocktailRecipePage = () => {
  const {
    recipes,
    categorys,
    searchOrHeader,
    setRecipes,
    setCategorys,
    setMealOrDrink,
    exploredIngredient,
    setExploredIngredient,
  } = useContext(RecipesContext);
  const sizeListRecipes = 12;
  const sizeListCategorys = 5;
  const [categoriesButtonToggler, setCategoriesButtonToggler] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const RECIPES_CARD_STYLE = 'recipe-card card-block';
  const ONE_SECOND = 1000;
  const [CardClass, setCardClass] = useState(RECIPES_CARD_STYLE);

  const reRenderAnimation = () => {
    setCardClass('recipe-card-out card-block');
    const classTimeOut = setTimeout(() => {
      setCardClass(RECIPES_CARD_STYLE);
      clearTimeout(classTimeOut);
    }, ONE_SECOND);
  };

  /** Faz as requisições para mostrar as categorias e as receitas */
  const requestAPI = async () => {
    if (exploredIngredient !== '') {
      const apiResponse = await recipeAPI('ingredients', exploredIngredient, 'drink');
      setRecipes(apiResponse.drinks);
    } else {
      const dataCockTails = await recipeAPI('name', '', 'drink');
      setRecipes(dataCockTails.drinks);
    }
    const dataCategorys = await recipeAPI('listCategorys', '', 'drink');
    setCategorys(dataCategorys.drinks);
    setCategoriesButtonToggler(dataCategorys.drinks.map((category) => (
      {
        category: category.strCategory,
        active: true,
      }
    )));
    setIsLoading(false);
  };

  /** Função que envia a categoria pro provider */
  const handleFilterCategory = async (strCategory) => {
    reRenderAnimation();
    const toggle = categoriesButtonToggler
      .find(({ category }) => category === strCategory);
    if (toggle.active) {
      const dataFilterCockTails = await recipeAPI('category', strCategory, 'drink');
      setRecipes(dataFilterCockTails.drinks);
      setCategoriesButtonToggler([
        ...[...categoriesButtonToggler].filter(({ category }) => category !== strCategory)
          .map(({ category }) => ({ category, active: true })),
        { category: strCategory, active: false },
      ]);
    } else {
      await requestAPI();
      setCategoriesButtonToggler([
        ...[...categoriesButtonToggler].filter(({ category }) => category !== strCategory)
          .map(({ category }) => ({ category, active: true })),
        { category: strCategory, active: true },
      ]);
    }
  };

  /** Função que mostra todas as receitas */
  const handleClickFilterAll = async () => {
    reRenderAnimation();
    await requestAPI();
  };

  useEffect(() => {
    requestAPI();
    setMealOrDrink('drink');

    return () => {
      setExploredIngredient('');
    };
  }, []);

  if (isLoading) return <Loading />;

  const toggleStyle = {
    borderRadius: '0',
  };

  return (
    <div className="meal-or-cocktail-container">
      <div>
        <Header pageTitle="Bebidas" />
        {searchOrHeader ? <SearchBar /> : '' }
        {/** É necessario passar props pageTitle com o valor
     * de: "Comidas" para o header */}
        {/* <Header pageTitle="Comidas" /> */}
      </div>
      <div>
        {/** É necessario passar props pageTitle com o valor
         * de: Bebidas para ser mostrado no header */}
      </div>

      {/** Mostra 5 botões com as primeiras cateforias da requisição */}
      <ToggleButtonGroup
        type="radio"
        name="options"
        defaultValue={ 1 }
        className="d-flex flex-wrap"
      >
        <ToggleButton
          data-testid="All-category-filter"
          value={ 1 }
          id="tbg-radio-1"
          onClick={ handleClickFilterAll }
          variant="success"
          style={ toggleStyle }
        >
          All
        </ToggleButton>
        {
          categorys
            .slice(0, sizeListCategorys)
            .map((category, index) => (
              <ToggleButton
                data-testid={ `${category.strCategory}-category-filter` }
                key={ index }
                value={ index + 2 }
                id={ `tbg-radio-${index + 2}` }
                onClick={ () => handleFilterCategory(category.strCategory) }
                variant="success"
                style={ toggleStyle }
              >
                { category.strCategory }
              </ToggleButton>
            ))
        }
      </ToggleButtonGroup>
      <h2>
        {exploredIngredient !== '' && `Filtro de ingrediente: ${exploredIngredient}`}
      </h2>
      {/** Renderiza os Cards com as Comidas */}
      <CardGroup className="d-flex flex-wrap justify-content-around mb-5 mt-4 card-group-container">
        {
          recipes
            .slice(0, sizeListRecipes)
            .map((recipe, index) => (
              <RecipesCards
                key={ index }
                nameValue={ recipe.strDrink }
                indexValue={ index }
                thumbValue={ recipe.strDrinkThumb }
                onClick={ () => history.push(`/bebidas/${recipe.idDrink}`) }
                styles={ CardClass }
              />
            ))
        }
      </CardGroup>
      <Footer />
    </div>
  );
};

export default CocktailRecipePage;
