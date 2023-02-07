export default class Meal {
  constructor(id, name, img) {
    this.id = id;
    this.name = name;
    this.img = img;
  }

  html() {
    const meal = document.createElement('div');
    meal.id = this.id;
    meal.innerHTML = `
      <img src="${this.img}" alt="${this.name}" />
      <div class="meal__headline">
        <p>${this.name.length > 30 ? `${this.name.slice(0, 27)}...` : this.name}</p>
        <button class="meal__like">
          <span class="material-symbols-outlined"> favorite </span>
          <span>0 likes</span>
        </button>
      </div>
      <button class="button">Comments</button>
    `;
    return meal;
  }
}
