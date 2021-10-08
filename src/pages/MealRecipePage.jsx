import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CardGroup, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Header from '../components/Header';
import SearchBar from '../components/Searchbar';
import RecipesCards from '../components/RecipesCards';
import RecipesContext from '../context/RecipesContext';
import Footer from '../components/Footer';
import recipeAPI from '../services/recipeAPI';
import Loading from '../components/Loading';
import './styles/mealRecipePage.css';

const MealRecipePage = () => {
  const {
    recipes,
    categorys,
    searchOrHeader,
    setRecipes,
    setCategorys,
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
      const apiResponse = await recipeAPI('ingredients', exploredIngredient, 'meal');
      setRecipes(apiResponse.meals);
    } else {
      const dataMeal = await recipeAPI('name', '', 'meal');
      setRecipes(dataMeal.meals);
    }

    const dataCategorys = await recipeAPI('listCategorys', '', 'meal');
    setCategorys(dataCategorys.meals);
    setCategoriesButtonToggler(dataCategorys.meals.map((category) => (
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
      const dataFilterMeal = await recipeAPI('category', strCategory, 'meal');
      setRecipes(dataFilterMeal.meals);
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

    return () => {
      setExploredIngredient('');
    };
  }, []);

  if (isLoading) return <Loading />;

  const toggleStyle = {
    borderRadius: '0',
  };

  return (
    <div className="meals-container">
      <nav>
        <Header pageTitle="Comidas" />
        {searchOrHeader ? <SearchBar /> : '' }
      </nav>

      {/** Mostra 5 botões com as primeiras cateforias da requisição */}
      <ToggleButtonGroup type="radio" name="options" defaultValue={ 1 } className="d-flex flex-wrap">
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
      <CardGroup className="d-flex flex-wrap justify-content-around mb-5 mt-4">
        {
          recipes
            .slice(0, sizeListRecipes)
            .map((recipe, index) => (
              <RecipesCards
                key={ index }
                nameValue={ recipe.strMeal }
                indexValue={ index }
                thumbValue={ recipe.strMealThumb }
                onClick={ () => history.push(`/comidas/${recipe.idMeal}`) }
                styles={ CardClass }
              />
            ))
        }
      </CardGroup>
      <Footer />
    </div>
  );
};

export default MealRecipePage;
