export default class Likes {
  constructor(id) {
    this.id = id;
    this.apiUri = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/';
  }

  createApp() {
    return new Promise((resolve, reject) => {
      if (this.id !== '') {
        resolve(this.id); // If there's already an existing app
        return;
      }
      fetch(`${this.apiUri}apps/`, {
        method: 'POST',
      })
        .then((response) => response.text())
        .then((id) => {
          this.id = id;
          localStorage.setItem('likesApp', id);
          resolve(id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getItems() {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiUri}apps/${this.id}/likes/`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject();
        });
    });
  }

  setItem(id) {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiUri}apps/${this.id}/likes/`, {
        method: 'POST',
        body: JSON.stringify({
          item_id: id,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
}
