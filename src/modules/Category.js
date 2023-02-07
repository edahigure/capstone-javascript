export default class Category {
  constructor(name) {
    this.name = name;
    this.meals = [];
  }

  getMeals() {
    return new Promise((resolve, reject) => {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${this.name}`)
        .then((res) => res.json())
        .then(({ meals }) => {
          this.meals = meals;
          resolve(meals);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
