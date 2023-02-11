import './css/style.css';
import Categories from './modules/Categories.js';

window.onload = () => {
  const meals = document.getElementById('meals');
  const buttons = document.getElementById('listCategories');
  const popupComments = document.getElementById('popupComments');
  const categories = new Categories(meals, buttons, popupComments);

  popupComments.querySelector('#btnClosePopup').addEventListener('click', () => {
    document.querySelector('.popup').style.display = 'none';
    popupComments.close();
  });

  categories.load('Miscellaneous'); // category to load by default

  const btnsLoadCategory = document.querySelectorAll('.btnsLoadCategory');
  btnsLoadCategory.forEach((btnLoadCategory) => {
    btnLoadCategory.addEventListener('click', () => {
      // disable buttons while loading meals
      btnsLoadCategory.forEach((btn) => {
        btn.disabled = true;
      });
      const category = btnLoadCategory.textContent;
      categories.load(category).finally(() => {
        // enable buttons after loading meals
        btnsLoadCategory.forEach((btn) => {
          btn.disabled = false;
        });
      });
    });
  });
};
