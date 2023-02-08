import Category from './Category.js';
import Likes from './Likes.js';
import Meal from './Meal.js';

export default class Categories {
  constructor(container, buttons, popupComments) {
    this.container = container;
    this.buttons = buttons;
    this.popupComments = popupComments;
    this.categories = [];
    this.currentCategory = '';
    this.likesApp = localStorage.getItem('likesApp') || '';
    this.likes = new Likes(this.likesApp);
  }

  load(name) {
    return new Promise((resolve, reject) => {
      const added = this.categories.find((cat) => cat.name === name);
      const isAdded = added !== undefined;
      if (isAdded) {
        this.displayMeals(added.meals, name);
        this.changeCurrentButton(name);
        this.currentCategory = name;
        resolve();
        return;
      }

      const category = new Category(name);
      category
        .getMeals()
        .then((meals) => {
          this.categories.push(category);
          this.displayMeals(meals, name);
          this.changeCurrentButton(name);
          this.currentCategory = name;
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  displayPopupComments(mealId) {
    console.log(mealId);
    this.popupComments.showModal();
  }

  getLikes() {
    return new Promise((resolve, reject) => {
      this.likes.createApp().then(() => {
        this.likes
          .getItems()
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            // No previous likes
            reject();
          });
      });
    });
  }

  displayLikes() {
    this.getLikes().then((likes) => {
      likes.forEach((like) => {
        const meal = this.container.querySelector(`[id="${like.item_id}" ]`);
        if (meal !== null) meal.querySelector('.likesAmount').textContent = like.likes;
      });
    });
  }

  displayMeals(meals, name) {
    if (name === this.currentCategory) return; // If category is already showing
    this.container.replaceChildren(); // Clear container
    const fragment = document.createDocumentFragment();
    meals.forEach((meal) => {
      const instance = new Meal(meal.idMeal, meal.strMeal, meal.strMealThumb);
      const html = instance.html();
      /* Meal events */
      html.querySelector('.button').addEventListener('click', () => {
        this.displayPopupComments(instance.id);
      });
      const btnLike = html.querySelector('.btnLike');
      btnLike.addEventListener('click', () => {
        btnLike.disabled = true;
        const likesAmount = html.querySelector('.likesAmount');
        likesAmount.textContent = Number(likesAmount.textContent) + 1;
        this.likes
          .setItem(instance.id)
          .catch(() => {
            likesAmount.textContent = Number(likesAmount.textContent) - 1;
            // eslint-disable-next-line no-console
            console.error('An error occurred while connecting with the API.');
          })
          .finally(() => {
            btnLike.disabled = false;
          });
      });
      /* ----------- */
      fragment.appendChild(html);
    });
    this.container.appendChild(fragment);
    this.displayLikes();
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
