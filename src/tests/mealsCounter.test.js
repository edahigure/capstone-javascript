import Categories from '../modules/Categories.js';

describe('Homepage meals counter tests', () => {
  document.body.innerHTML = `
    <section id="meals"></section>
    <ul id="listCategories">
      <span id="mealsAmount"></span>
    </ul>
    <dialog id="popupComments">
      <input type="button" id="add-button" value="Comment">
    </dialog>
  `;
  const meals = [
    {
      strMeal: 'Baked salmon with fennel & tomatoes',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
      idMeal: '52959',
    },
    {
      strMeal: 'Cajun spiced fish tacos',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg',
      idMealL: '52819',
    },
  ];
  const cntMeals = document.querySelector('#meals');
  const listCategories = document.querySelector('#listCategories');
  const popupComments = document.querySelector('#popupComments');
  const mealsAmount = document.querySelector('#mealsAmount');
  const categories = new Categories(cntMeals, listCategories, popupComments);
  it('Should display 2 meals, so counter should be 2', () => {
    categories.showAmount(meals);
    expect(mealsAmount.textContent).toBe('(2)');
  });
  it('Should display 5 meals, so counter should be 5', () => {
    meals.push(
      {
        strMeal: 'Baked salmon with fennel & tomatoes',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
        idMeal: '52959',
      },
      {
        strMeal: 'Cajun spiced fish tacos',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg',
        idMealL: '52819',
      },
      {
        strMeal: 'Baked salmon with fennel & tomatoes',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
        idMeal: '52959',
      },
    );
    categories.showAmount(meals);
    expect(mealsAmount.textContent).toBe('(5)');
  });
  it('Should display 4 meals, so counter should be 4', () => {
    meals.pop();
    categories.showAmount(meals);
    expect(mealsAmount.textContent).toBe('(4)');
  });
});
