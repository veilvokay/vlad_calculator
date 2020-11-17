const CalculatorNavigation = function() {
  this.currentPage = -1;
};

CalculatorNavigation.prototype.showPage = function(pageIndex) {
  let pageElement = document.getElementsByClassName('calculator-page')[pageIndex];
  if (!pageElement)
  	return console.log(`Can't find page ${pageIndex}`);
  pageElement.style.opacity = 1;
  pageElement.style.pointerEvents = 'auto';
};

CalculatorNavigation.prototype.hidePage = function(pageIndex) {
  let pageElement = document.getElementsByClassName('calculator-page')[pageIndex];
  if (!pageElement)
  	return console.log(`Can't find page ${pageIndex}`);
  pageElement.style.opacity = 0;
  pageElement.style.pointerEvents = 'none';
};

CalculatorNavigation.prototype.moveTo = function(pageIndex) {
  this.hidePage(this.currentPage);
  this.showPage(pageIndex);
  this.currentPage = pageIndex;
};