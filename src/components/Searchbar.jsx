import { useHistory } from 'react-router-dom';
import React, { useContext, useState } from 'react';
// import { Redirect } from 'react-router-dom';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import RecipesContext from '../context/RecipesContext';
// import RecipeCard from './RecipeCard';
import './styles/searchbar.css';

// Criado os services api separados para comida e bebida
// os inputs do tipo radio possuem o mesmo name="name-search" para ser apenas um selecionado por vez.
// a searchbar tem um estado local que é utilizado para passar paramentros a chamada da API
// criado estado global no provider para definir se é bebida ou comida
const STARTER_OPTION = '';
const STARTER_INPUT = '';
// criado seletor para função de renderizar os cards

function SearchBar() {
  const history = useHistory();
  const [inputValue, setInputValue] = useState(STARTER_INPUT);
  const [searchOption, setOption] = useState('ingredients');
  const { recipeAPI,
    mealOrDrink,
    searchOrHeader,
    changeSearchOrHeader,
    setRecipes } = useContext(RecipesContext);

  // função de alert
  const alertWindow = (msg) => alert(msg);

  // serie de funções que serão utilizadas para as condições do resultado
  // feita funcao para verificar se é meal ou drink e utilizar os parametros corretos nas verificações
  const checkTypeOfRecipe = (actualType) => {
    if (actualType === 'meal') {
      return 'meals';
    }
    if (actualType === 'drink') {
      return 'drinks';
    }
  };
  // função para renderizar os cards

  async function onClickButton() {
    // chamada a função acima e guardado resultado na variavel que será utilizada para verificar as condições de redirecionamento
    const typeOfRecipe = checkTypeOfRecipe(mealOrDrink);

    changeSearchOrHeader(!searchOrHeader);
    if (searchOption === 'first-letter' && inputValue.length > 1) {
      alertWindow('Sua busca deve conter somente 1 (um) caracter');
    }

    const apiResponse = await recipeAPI(searchOption, inputValue, mealOrDrink);
    // console.log(apiResponse);
    // verifica se nao encontrou nenhum resultado para mandar alert na cara do usuário || o else if verifica se tem apenas 1 resultado para redirecionar
    if (apiResponse[typeOfRecipe] === null) {
      alertWindow('Sinto muito, não encontramos nenhuma receita para esses filtros.');
    } else if (apiResponse[typeOfRecipe].length === 1) {
      if (mealOrDrink === 'drink') {
        console.log(apiResponse[typeOfRecipe][0].idDrink);
        history.push(`/bebidas/${apiResponse[typeOfRecipe][0].idDrink}`);
      } else {
        history.push(`/comidas/${apiResponse[typeOfRecipe][0].idMeal}`);
      }
      // abaixo se tem mais de 1 receita vai renderizar os cards
    } else if (apiResponse[typeOfRecipe].length > 1) {
      // utiliza função setRecipes para renderizar os cards
      setRecipes(apiResponse[typeOfRecipe]);
    }
  }

  return (
    <Container className="slide-in-effect mb-1">
      <h1>SearchBar</h1>
      <Form>
        <Row className="g-2">
          <Col xs={ 9 }>
            <Form.Control
              type="text"
              data-testid="search-input"
              value={ inputValue }
              onChange={ (e) => setInputValue(e.target.value) }
              // maxLength={ maxLength }
              fluid
            />
          </Col>
          <Col xs={ 3 }>
            <Button
              type="button"
              data-testid="exec-search-btn"
              onClick={ onClickButton }
              variant="success"
            >
              Buscar
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Check
              data-testid="ingredient-search-radio"
              defaultChecked="true"
              name="option-radio"
              className="ingredients-search"
              type="radio"
              value="ingredients"
              onClick={ (e) => setOption(e.target.value) }
              label="Ingredientes"
              id="ingredients"
              // onChange={ checkIfFirstLetter }
            />
            <Form.Check
              data-testid="name-search-radio"
              name="option-radio"
              className="name-search"
              type="radio"
              value="name"
              onClick={ (e) => setOption(e.target.value) }
              label="Nome"
              id="name"
              // onChange={ checkIfFirstLetter }
            />
            <Form.Check
              data-testid="first-letter-search-radio"
              name="option-radio"
              className="first-letter-search"
              type="radio"
              value="first-letter"
              onClick={ (e) => setOption(e.target.value) }
              label="Primeira Letra"
              id="first-letter"
              // onChange={ checkIfFirstLetter }
            />
          </Col>
        </Row>
      </Form>
    </Container>

  );
}

export default SearchBar;
