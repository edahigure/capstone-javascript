import Category from './Category.js';
import Meal from './Meal.js';

export default class Categories {
  constructor(container, buttons, popupComments) {
    this.container = container;
    this.buttons = buttons;
    this.popupComments = popupComments;
    this.categories = [];
    this.currentCategory = '';
  }

  load(name) {
    const added = this.categories.find((cat) => cat.name === name);
    const isAdded = added !== undefined;
    if (isAdded) {
      this.displayMeals(added.meals, name);
      this.changeCurrentButton(name);
      this.currentCategory = name;
      return;
    }

    const category = new Category(name);
    category.getRecipees().then((meals) => {
      this.categories.push(category);
      this.displayMeals(meals, name);
      this.changeCurrentButton(name);
      this.currentCategory = name;
    });
  }

  displayPopupComments(mealId) {
    console.log(mealId);
    this.popupComments.showModal();
  }

  displayMeals(meals, name) {
    if (name === this.currentCategory) return; // If category is already showing
    this.container.replaceChildren(); // Clear container
    const fragment = document.createDocumentFragment();
    meals.forEach((meal) => {
      const instance = new Meal(meal.idMeal, meal.strMeal, meal.strMealThumb);
      const html = instance.html();
      html.querySelector('.button').addEventListener('click', () => {
        this.displayPopupComments(instance.id);
      });
      fragment.appendChild(html);
    });
    this.container.appendChild(fragment);
  }

  changeCurrentButton(name) {
    if (name === this.currentCategory) return; // If category is already showing
    [...this.buttons.children].forEach((li) => {
      const button = li.firstElementChild;
      if (button.textContent === name) button.classList.add('menu__btn--current');
      else button.classList.remove('menu__btn--current');
    });
  }
}
