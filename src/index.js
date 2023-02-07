import './css/style.css';
import Categories from './modules/Categories.js';

window.onload = () => {
  const meals = document.getElementById('meals');
  const buttons = document.getElementById('listCategories');
  const popupComments = document.getElementById('popupComments');
  const categories = new Categories(meals, buttons, popupComments);

  categories.load('Miscellaneous'); // category to load by default

  const btnsLoadCategory = document.querySelectorAll('.btnsLoadCategory');
  btnsLoadCategory.forEach((btnLoadCategory) => {
    btnLoadCategory.addEventListener('click', () => {
      const category = btnLoadCategory.textContent;
      categories.load(category);
    });
  });
};
