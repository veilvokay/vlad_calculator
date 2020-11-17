const Alert = {
  _alertElement: null,
  _titleElement: null,
  _descriptionElement: null,

  init: () => {
    this._alertElement = document.createElement('div'),
    this._titleElement = document.createElement('p'),
    this._descriptionElement = document.createElement('p'),

    this._alertElement.classList.add('constructor-alert');
    this._titleElement.classList.add('constructor-alert-title');
    this._descriptionElement.classList.add('constructor-alert-text');

    this._alertElement.appendChild(this._titleElement);
    this._alertElement.appendChild(this._descriptionElement);
    document.body.appendChild(this._alertElement);
  },

  show: (title, description, backgroundColor, delay) => {
    this._titleElement.innerText = title;
    this._descriptionElement.innerText = description;
    this._alertElement.style.backgroundColor = backgroundColor;
    this._alertElement.style.display = 'block';
    setTimeout(() => this._alertElement.style.display = 'none', delay);
  },
};
