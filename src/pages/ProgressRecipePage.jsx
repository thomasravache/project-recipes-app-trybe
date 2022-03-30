import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import {
  Container, Row, Col, Button,
  Image, ListGroup,
} from 'react-bootstrap';
import copy from 'clipboard-copy';
import fetchDetailRecipe from '../services/detailRecipeEndPointsCall';
import DetailsIcons from '../components/DetailsIcons';
import './styles/DetailsRecipePage.css';
import Loading from '../components/Loading';
import setFavoriteRecipesToStorage,
{ getListInProgress, usedIngredients } from '../services/localStorageHandler';
import './styles/ProgressRecipePage.css';

const DetailsRecipePage = () => {
  // tambem poderia desestruturar o match das props para pegar o recipeID --> { match: { params: { recipeId } } }
  const history = useHistory();
  const { recipeId } = useParams(); // id que vem da URL
  const [isLoading, setIsLoading] = useState(true);
  const [linkIsCopied, setLinkIsCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState({}); // estado que recebe os detalhes da receita da requisição a API
  const [recipeType, setRecipeType] = useState(''); // estado que armazenará o tipo de receia (comida ou bebida)
  const { pathname } = useLocation();
  const isMeal = pathname.includes('comidas'); // se na URL tiver 'comidas' quer dizer que é a page de comidas e retorna true
  const recipesInStorage = getListInProgress(recipeId, isMeal);
  const [buttonDisable, setButtonDisable] = useState({});
  const [doneRecipes, setDoneRecipes] = useState([]);

  useEffect(() => { // useEffect responsável principalmente por fazer a requisição da receita e guardar as informações no estado recipeDetails
    const getRecipeDetails = async () => {
      const myRecipeDetails = await fetchDetailRecipe(recipeId, isMeal);

      setRecipeDetails(myRecipeDetails);
      setRecipeType(isMeal ? 'Meal' : 'Drink'); // seta o estado do tipo de receita, será 'Meal' se o caminho da URL tiver comidas, se não 'Drink'. Isso é necessário para que essa página seja genérica.
      setIsLoading(false);
    };

    getRecipeDetails();
    console.log(recipeDetails);
  }, [isMeal, recipeId]);

  const getIngredientsOrMeasures = (ingredientOrMeasure) => {
    const ingredientsOrMeasures = Object.entries(recipeDetails)
      .filter(([key, value]) => {
        const validations = [value !== null, value !== ''];
        const validationsOK = validations.every((validation) => validation);

        return key.includes(ingredientOrMeasure) && validationsOK;
      }).map(([, value]) => value);

    return ingredientsOrMeasures;
  };

  const handleShareIconClick = () => {
    const THREE_SECONDS = 3000;
    const mealOrDrink = isMeal ? 'comidas' : 'bebidas';
    copy(`${window.location.origin}/${mealOrDrink}/${recipeId}`);
    setLinkIsCopied(true);

    setTimeout(() => {
      setLinkIsCopied(false);
    }, THREE_SECONDS);
  };

  const ingredients = getIngredientsOrMeasures('strIngredient'); // strIngredient são as chaves que o objeto recipeDetails também retorna ex: (strIngredient1, strIngredient2)
  const measures = getIngredientsOrMeasures('strMeasure'); // strMeasure são as chaves que o objeto recipeDetails também retorna ex: (strMeasure1, strMeasure2)
  const { strCategory, strInstructions, strAlcoholic } = recipeDetails;

  const handleFavoriteIconClick = () => {
    setIsFavorite(!isFavorite);

    setFavoriteRecipesToStorage(isFavorite, recipeDetails, recipeType, isMeal);
  };

  const myHandleClickCheckBox = ({ target }) => {
    const classForCheckbox = 'checkbox-checked';
    if (target.parentElement.classList.contains(classForCheckbox)) {
      target.parentElement.classList.remove(classForCheckbox);
    } else {
      target.parentElement.classList.add(classForCheckbox);
    }
    setButtonDisable({
      ...buttonDisable,
    });
    usedIngredients(recipeId, target, isMeal);
  };

  // useEffect(() => {
  //   const verifyDoneRecipesExistence = () => {
  //     const doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes'));
  //     if (doneRecipesStorage === null) {
  //       localStorage.setItem('doneRecipes', JSON.stringify([]));
  //     }
  //   };
  //   verifyDoneRecipesExistence();
  //   setDoneRecipes(JSON.parse(localStorage.getItem('doneRecipes')));
  // }, []);

  const handleClickEndRecipe = () => {
    let doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes'));
    if (doneRecipesStorage === null) {
      localStorage.setItem('doneRecipes', JSON.stringify([]));
    }
    doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes'));
    const currentDate = new Date().toLocaleDateString();
    const [month, day, year] = currentDate.split('/');

    const newDoneRecipe = {
      id: recipeId,
      type: isMeal ? 'comida' : 'bebida',
      area: isMeal ? recipeDetails.strArea : '',
      category: strCategory,
      alcoholicOrNot: isMeal ? '' : strAlcoholic,
      name: recipeDetails[`str${recipeType}`],
      image: recipeDetails[`str${recipeType}Thumb`],
      doneDate: `${day}/${month}/${year}`,
      tags: recipeDetails.strTags !== null
        ? recipeDetails.strTags.split(',')
        : [],
    };
    localStorage.setItem('doneRecipes', JSON.stringify(
      [...doneRecipesStorage.filter(({ id }) => id !== recipeId), newDoneRecipe],
    ));
    history.push('/receitas-feitas');
  };

  if (isLoading) return <Loading />;

  return (
    <Container fluid className="fade-in-effect bg-default">
      <Row>
        <Col className="column-container">
          <Image
            src={ recipeDetails[`str${recipeType}Thumb`] }
            alt=""
            data-testid="recipe-photo"
            className="recipe-image"
            fluid
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={ 8 } className="column-container">
          <h4 data-testid="recipe-title">{recipeDetails[`str${recipeType}`]}</h4>
        </Col>
        <Col>
          <DetailsIcons
            handleFavoriteIconClick={ handleFavoriteIconClick }
            handleShareIconClick={ handleShareIconClick }
            isFavorite={ isFavorite }
            linkIsCopied={ linkIsCopied }
            recipeId={ recipeId }
            setIsFavorite={ setIsFavorite }
          />
        </Col>
      </Row>
      <Row>
        <Col className="column-container">
          <h6 data-testid="recipe-category">{isMeal ? strCategory : strAlcoholic}</h6>
        </Col>
      </Row>
      <Row style={ { marginTop: '1rem' } }>
        <Col>
          <h5>Ingredients</h5>
          <ListGroup>
            {ingredients.map((ingredient, index) => (
              <ListGroup.Item
                id={ ingredient }
                key={ `${ingredient} - ${measures[index]}` }
                variant="success"
              >
                <label
                  htmlFor={ `${index}-ingredient-step` }
                  data-testid={ `${index}-ingredient-step` }
                  className={ recipesInStorage
                    .some((item) => item === `${ingredient} - ${measures[index]}`)
                    ? 'checkbox-checked'
                    : '' }
                >
                  <input
                    type="checkbox"
                    id={ `${index}-ingredient-step` }
                    name={ ingredient }
                    value={ `${ingredient} - ${measures[index]}` }
                    className="form-check-input"
                    onClick={ myHandleClickCheckBox }
                    defaultChecked={ recipesInStorage
                      .some((item) => item === `${ingredient} - ${measures[index]}`) }
                  />
                  {` ${ingredient} - ${measures[index] === undefined
                    ? 'to taste'
                    : measures[index]}`}
                </label>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row style={ { marginTop: '1rem' } } className="mb-5">
        <Col className="column-container">
          <h5>Instructions</h5>
          <p data-testid="instructions">{ strInstructions }</p>
        </Col>
      </Row>
      <Row className="fixed-bottom">
        <Col>
          <div className="d-grid gap-2 btn-container">
            <Button
              style={ { width: '100%', borderRadius: '0' } }
              className="fixed-bottom"
              variant="success"
              disabled={ recipesInStorage.length !== ingredients.length }
              type="button"
              size="lg"
              data-testid="finish-recipe-btn"
              onClick={ handleClickEndRecipe }
            >
              Finalizar Receita
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailsRecipePage;
