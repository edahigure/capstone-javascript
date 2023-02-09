import Categories from './Categories.js';

/**
 * @jest-environment jsdom
 */

document.body.innerHTML = `
<ul class="menu__categories" id="listCategories">
</ul>

<section class="meals" id="meals"></section>

<dialog class="popup" id="popupComments">
</dialog>

<ul class='comments-container'>
</ul>

<form class="input-section">
<h2>Add a comment</h2>
<input type="text" placeholder="Your name" class="user" size="25">
<input type="text" placeholder="Your insights" class="comment" size="50">
<input type="button" id="add-button" value="Comment">
</form>
`;

const meals = document.getElementById('meals');
const buttons = document.getElementById('listCategories');
const popupComments = document.getElementById('popupComments');

const getComments = () => new Promise((resolve) => {
  const data = [{ username: 'Callaloo', creation_date: '2023-02-09', comment: '1' },
    { username: 'Callaloo', comment: '2', creation_date: '2023-02-09' },
    { comment: '3', username: 'Callaloo', creation_date: '2023-02-09' },
    { creation_date: '2023-02-09', username: 'Callaloo', comment: '4' }];
  resolve(data);
});

const categories = new Categories(meals, buttons, popupComments);

test(' Count number of comments ', () => {
  categories.getNumComments(getComments()).then((num) => {
    expect(num).toBe(4);
  });
});
