export default async function recipeAPI(
  caseInput,
  inputValue,
  mealOrDrink,
  filterType = 'c',
) {
  const checkApiUrl = (checkUrl) => {
    if (checkUrl === 'meal') {
      return 'https://www.themealdb.com/api/json/v1/1/';
    }
    if (checkUrl === 'drink') {
      return 'https://www.thecocktaildb.com/api/json/v1/1/';
    }
  };

  const apiUrl = checkApiUrl(mealOrDrink);

  switch (caseInput) {
  case 'ingredients': {
    const requestIngredients = await fetch(`${apiUrl}filter.php?i=${inputValue}`);
    const ingredients = await requestIngredients.json();
    return ingredients;
  }
  case 'name': {
    const requestName = await fetch(`${apiUrl}search.php?s=${inputValue}`);

    const nameFind = await requestName.json();
    return nameFind;
  }
  case 'first-letter': {
    const requestFirstLetter = await fetch(`${apiUrl}search.php?f=${inputValue}`);
    const firstLetter = await requestFirstLetter.json();
    return firstLetter;
  }
  /** Pesquisa receita por categoria - valor do filterType (c = category / a = area) */
  case 'category': {
    const request = await fetch(`${apiUrl}filter.php?${filterType}=${inputValue}`);
    const response = await request.json();
    return response;
  }
  /** Pesquisa as categorias - valor do filterType (c = category / a = area) */
  case 'listCategorys': {
    const requestCategorys = await fetch(`${apiUrl}list.php?${filterType}=list`);
    const responseCategorys = await requestCategorys.json();
    return responseCategorys;
  }
  /** Retorna 1 receita random */
  case 'randomRecipe': {
    const requestRandom = await fetch(`${apiUrl}random.php`);
    const responseRandom = await requestRandom.json();
    return responseRandom;
  }
  default:
    return 'parametro, invalido';
  }
}
