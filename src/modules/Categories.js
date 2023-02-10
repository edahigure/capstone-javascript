import Category from './Category.js';
import Likes from './Likes.js';
import Meal from './Meal.js';

export default class Categories {
  myId;

  myMealId;

  constructor(container, buttons, popupComments) {
    this.container = container;
    this.buttons = buttons;
    this.mealsAmount = this.buttons.querySelector('#mealsAmount');
    this.popupComments = popupComments;
    this.categories = [];
    this.currentCategory = '';
    this.likesApp = localStorage.getItem('likesApp') || '';
    this.likes = new Likes(this.likesApp);
    this.myId = '4CiVCJNod2ySIOQrhdu6';
    this.initEventAddButton();
  }

  initEventAddButton = () => {

    const addButton = document.querySelector('#add-button');
    const form = document.querySelector('.input-section');
    addButton.addEventListener('click', async () => {
      
      const user = document.querySelector('.user').value;
      const comment = document.querySelector('.comment').value;
      if (user !== '' && comment !== '') {
        await this.addComment(this.myMealId, user, comment);
        const comments = this.getComments(this.myMealId);
        comments.then((data) => {
          if (data !== undefined) {
            const commentsTitle = this.popupComments.querySelector('.comments-title');
            commentsTitle.innerHTML = `Commments (${data.length})`;

            const commentsContainer = this.popupComments.querySelector('.comments-container');

            const newData = document.createElement('li');

            newData.innerHTML = `${data[data.length - 1].creation_date} ${user}: ${comment}`;
            commentsContainer.appendChild(newData);
          }
        });
        form.reset();
        document.querySelector('.msg').style.display='none';
      }else{
        document.querySelector('.msg').style.display='block';
      }
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
    });
  };

  initApp = async () => {
    const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/';
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((res) => {
        res.text().then((id) => {
          this.myId = id;
          resolve(id);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  };

  addComment = async (itemId, name, comment) => {
    const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${this.myId}/comments`;
    const result = fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        {
          item_id: itemId,
          username: name,
          comment,
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
        commentsTitle.innerHTML = `Commments (${data.length})`;
        const commentsContainer = this.popupComments.querySelector('.comments-container');
        commentsContainer.innerHTML = '';
        let newData;
        for (let i = 0; i < data.length; i += 1) {
          newData = document.createElement('li');
          newData.innerHTML = `${data[i].creation_date} ${data[i].username}: ${data[i].comment}`;
          commentsContainer.appendChild(newData);
        }
      } else {
        const commentsTitle = this.popupComments.querySelector('.comments-title');
        commentsTitle.innerHTML = 'Commments (0)';
        const commentsContainer = this.popupComments.querySelector('.comments-container');
        commentsContainer.innerHTML = '';
      }
    });
  }

  getNumComments = async (comments) => new Promise((resolve, reject) => {
    comments.then((data) => {
      if (data.length !== undefined) {
        resolve(data.length);
      } else {
        resolve(0);
      }
    }).catch((err) => {
      reject(err);
    });
  })

  getItemApiMain = async (mealId) => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const result = fetch(url);

    await result.then((response) => response.json()).then((json) => {
      const popupImg = this.popupComments.querySelector('#popupImage');
      popupImg.src = json.meals[0].strMealThumb;

      const popupTitle = this.popupComments.querySelector('#popupTitle');
      popupTitle.innerHTML = json.meals[0].strMeal;

      const gridContainer = this.popupComments.querySelector('.grid-container');
      gridContainer.innerHTML = '';
      let newData = document.createElement('div');
      newData.innerHTML = `Area:${json.meals[0].strArea}`;
      gridContainer.appendChild(newData);

      newData = document.createElement('div');
      newData.innerHTML = `Category:${json.meals[0].strCategory}`;
      gridContainer.appendChild(newData);

      const ingredientContainer = document.createElement('ul');
      ingredientContainer.className = 'ingredient-container';
      gridContainer.appendChild(ingredientContainer);
      ingredientContainer.innerHTML = '';

      newData = document.createElement('li');
      newData.innerHTML = 'Ingredients:';
      ingredientContainer.appendChild(newData);

      const strIngredient = [];
      for (let i = 1; i <= 20; i += 1) {
        strIngredient[i] = json.meals[0][`strIngredient${i.toString()}`];
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

      const strMeasure = [];
      for (let i = 1; i <= 20; i += 1) {
        strMeasure[i] = json.meals[0][`strMeasure${i.toString()}`];
        if (strMeasure[i] === '') { break; }
        newData = document.createElement('li');
        newData.innerHTML = strMeasure[i];
        measureContainer.appendChild(newData);
      }

      const instructions = document.querySelector('.instructions');
      instructions.innerHTML = json.meals[0].strInstructions;

      const comments = this.getComments(mealId);
      this.printComments(comments);
    });
  };

  async displayPopupComments(mealId) {
    this.myMealId = mealId;
    document.querySelector('.popup').style.display = 'flex';
    await this.getItemApiMain(mealId);
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

  showAmount(meals) {
    this.mealsAmount.textContent = `(${meals.length})`;
  }

  displayMeals(meals, name) {
    if (name === this.currentCategory) return; // If category is already showing
    this.showAmount(meals);
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
      if (button.textContent === name) {
        button.classList.add('menu__btn--current');
        li.appendChild(this.mealsAmount);
      } else button.classList.remove('menu__btn--current');
    });
  }
}
