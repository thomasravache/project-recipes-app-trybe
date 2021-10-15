import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CardGroup, Form } from 'react-bootstrap';
import Header from '../components/Header';
import RecipesCards from '../components/RecipesCards';
import SearchBar from '../components/Searchbar';
import RecipesContext from '../context/RecipesContext';
import recipeAPI from '../services/recipeAPI';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import './styles/mealOrCocktailPage.css';

const ExploreRecipesAreaPage = () => {
  const {
    searchOrHeader,
    recipes,
    categorys,
    setRecipes,
    setCategorys,
  } = useContext(RecipesContext);
  const sizeListRecipes = 12;
  const RECIPES_CARD_STYLE = 'recipe-card card-block';
  const ONE_SECOND = 1000;
  const [CardClass, setCardClass] = useState(RECIPES_CARD_STYLE);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const reRenderAnimation = () => {
    setCardClass('recipe-card-out card-block');
    const classTimeOut = setTimeout(() => {
      setCardClass(RECIPES_CARD_STYLE);
      clearTimeout(classTimeOut);
    }, ONE_SECOND);
  };

  /** Seta no estado o valor vindo do filtro */
  const handleFilterArea = async (event) => {
    reRenderAnimation();
    const { target: { value } } = event;
    const dataFilterMeal = await recipeAPI('category', value, 'meal', 'a');
    console.log(dataFilterMeal, value);
    setRecipes(dataFilterMeal.meals);
  };

  /** Faz as requisições para mostrar as categorias por area e as receitas */
  useEffect(() => {
    const requestAPI = async () => {
      const dataMeal = await recipeAPI('name', '', 'meal');
      const dataArea = await recipeAPI('listCategorys', '', 'meal', 'a');
      setCategorys(dataArea.meals);
      setRecipes(dataMeal.meals);
      setIsLoading(false);
    };
    requestAPI();
  }, [setRecipes, setCategorys]);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-default">
      <Header pageTitle="Explorar Origem" />
      {searchOrHeader ? <SearchBar /> : '' }

      {/** Filtrar por Origem */}
      <Form.Select
        data-testid="explore-by-area-dropdown"
        onChange={ (event) => handleFilterArea(event) }
      >
        <option
          data-testid="All-option"
          value=""
        >
          All
        </option>
        {
          categorys
            .sort()
            .map((category, index) => (
              <option
                data-testid={ `${category.strArea}-option` }
                key={ index }
                value={ category.strArea }
              >
                { category.strArea }
              </option>
            ))
        }
      </Form.Select>

      {/** Renderiza os Cards com as Comidas */}
      <CardGroup
        className="d-flex flex-wrap justify-content-around mb-5 mt-4 card-group-container"
      >
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

export default ExploreRecipesAreaPage;
