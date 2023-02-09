import Category from './Category.js';
import Meal from './Meal.js';

export default class Categories {
  myId;
  numComments;
  myMealId;


  constructor(container, buttons, popupComments) {
    this.container = container;
    this.buttons = buttons;
    this.popupComments = popupComments;
    this.categories = [];
    this.currentCategory = '';
    this.myId = "4CiVCJNod2ySIOQrhdu6";
    this.initEventAddButton();

    
  }
  initEventAddButton = ()=>{
    const addButton = document.querySelector('#add-button');
    const form = document.querySelector('.input-section');
    addButton.addEventListener('click', async () => {
      const user = document.querySelector('.user').value;
      const comment = document.querySelector('.comment').value;
      await this.addComment(this.myMealId, user, comment);
      const comments = this.getComments(this.myMealId);
      comments.then((data) => {
        if (data !== undefined) {
          const commentsTitle = this.popupComments.querySelector('.comments-title');
          commentsTitle.innerHTML = 'Commments (' + data.length + ')';

          const commentsContainer = this.popupComments.querySelector('.comments-container');

          const newData = document.createElement('li');

          newData.innerHTML = `${data[data.length - 1]['creation_date']} ${user}: ${comment}`;
          commentsContainer.appendChild(newData);
        }


      })
      form.reset();
    });
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


  getComments = (id) => {
    const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${this.myId}/comments?item_id=${id}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((comments) => {
          resolve(comments);
        }).catch((err) => {
          reject(err);
        });
    })
  };


  initApp = async () => {
    const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/`;
    const result = fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => { res.text().then((a) => console.log(a)) });
  };

  addComment = async (item_id, name, comment) => {
    const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${this.myId}/comments`;
    const result = fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        {
          "item_id": item_id,
          "username": name,
          "comment": comment
        },
      ),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    await result;
  }

  printComments = async (comments) => {

    comments.then((data) => {
      if (data.length !== undefined) {
        const commentsTitle = this.popupComments.querySelector('.comments-title');
        commentsTitle.innerHTML = 'Commments (' + data.length + ')';
        const commentsContainer = this.popupComments.querySelector('.comments-container');
        commentsContainer.innerHTML = '';
        let newData;
        for (let i = 0; i < data.length; i += 1) {
          newData = document.createElement('li');
          newData.innerHTML = `${data[i]['creation_date']} ${data[i]['username']}: ${data[i]['comment']}`;
          commentsContainer.appendChild(newData);
        }
      }else{
        const commentsTitle = this.popupComments.querySelector('.comments-title');
        commentsTitle.innerHTML = 'Commments (0)';
        const commentsContainer = this.popupComments.querySelector('.comments-container');
        commentsContainer.innerHTML = '';
      }

    });
  }

  getItemApiMain = async (mealId) => {

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const result = fetch(url);

    await result.then((response) => response.json()).then((json) => {

      const popupImg = this.popupComments.querySelector('#popupImage');
      popupImg.src = json.meals[0]['strMealThumb'];

      const popupTitle = this.popupComments.querySelector('#popupTitle');
      popupTitle.innerHTML = json.meals[0]['strMeal'];

      const gridContainer = this.popupComments.querySelector('.grid-container');
      gridContainer.innerHTML = '';
      let newData = document.createElement('div');
      newData.innerHTML = 'Area:' + json.meals[0]['strArea'];
      gridContainer.appendChild(newData);

      newData = document.createElement('div');
      newData.innerHTML = 'Category:' + json.meals[0]['strCategory'];
      gridContainer.appendChild(newData);


      const ingredientContainer = document.createElement('ul');
      ingredientContainer.className = 'ingredient-container';
      gridContainer.appendChild(ingredientContainer);
      ingredientContainer.innerHTML = '';

      newData = document.createElement('li');
      newData.innerHTML = 'Ingredients:';
      ingredientContainer.appendChild(newData);

      let strIngredient = [];
      for (let i = 1; i <= 20; i += 1) {
        strIngredient[i] = json.meals[0]['strIngredient' + i.toString()];
        if (strIngredient[i] === '') { break; }
        newData = document.createElement('li');
        newData.innerHTML = strIngredient[i];
        ingredientContainer.appendChild(newData);
      }

      const measureContainer = document.createElement('ul');
      measureContainer.className = 'ingredient-container';
      gridContainer.appendChild(measureContainer);
      measureContainer.innerHTML = '';

      newData = document.createElement('li');
      newData.innerHTML = 'Maesures:';
      measureContainer.appendChild(newData);

      let strMeasure = [];
      for (let i = 1; i <= 20; i += 1) {
        strMeasure[i] = json.meals[0]['strMeasure' + i.toString()];
        if (strMeasure[i] === '') { break; }
        newData = document.createElement('li');
        newData.innerHTML = strMeasure[i];
        measureContainer.appendChild(newData);
      }

      const instructions = document.querySelector(".instructions");
      instructions.innerHTML = json.meals[0]['strInstructions'];

      const comments = this.getComments(mealId);
      this.printComments(comments);

    });


  };


  displayPopupComments(mealId) {

    console.log(mealId);
    this.myMealId = mealId;
    //this.initApp();
    //return;
    this.popupComments.showModal();
    this.getItemApiMain(mealId);




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
