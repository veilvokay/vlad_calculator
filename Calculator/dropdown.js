const Dropdown = function(dropdownId, dropdownTitleId, dropdownContentId) {
  this.element = document.getElementById(dropdownId);
  this.titleElement = document.getElementById(dropdownTitleId);
  this.contentElement = document.getElementById(dropdownContentId);

  this.isShowen = false;
  this.values = [];
  this.value = null;

  this.show = () => this.contentElement.style.display = 'block';
  this.hide = () => this.contentElement.style.display = 'none';
  this.onChoose = ({index, value}) => console.log(`Chosen ${index} element -> ${value}.`);

  this.title = () => this.value;

  this.element.addEventListener('click', () => this.toggle());

  this.onElementChoose = ({index, value}) => {
    this.value = value;
    this.titleElement.innerText = this.title();
    this.onChoose({index, value});
  };

  this.addContentElement = (element, value) => {
    let index = this.values.length;
    element.addEventListener('click', () => this.onElementChoose({index, value}));
    this.contentElement.appendChild(element);
    this.values.push(value);
  };

  this.toggle = () => {
    if (this.isShowen)
      this.hide();
    else
      this.show();
    this.isShowen = !this.isShowen;
  };
};
