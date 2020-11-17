let chosenData = Object.assign({}, defaultChosenData);
let navigation;


const $ = (id) => document.getElementById(id);

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + 1);
};


const calculatePrice = ({technologyIndex, optimalLetters, title, tagline}) => {
  let titleLetterPrice = optimalLetters.title.price[technologyIndex];
  let taglineLetterPrice = optimalLetters.tagline.price;

  //TODO: Add check ONLY for symbols (without space ' ' and other '.', ',', etc.)
  let titlePrice = titleLetterPrice * title.length;
  let taglinePrice = taglineLetterPrice * tagline.length;
  //TODO: Add price of icon
  let iconPrice = 0;

  return titlePrice + taglinePrice + iconPrice;
};


const getOptimalLetters = (lettersSizes, {size, title, tagline}) => {
  const getMinTaglineLetterHeight = (lettersSizes) => {
    let minLetterHeight = lettersSizes.tagline[0].y;
    for (letter of lettersSizes.tagline)
      if (letter.y < minLetterHeight)
        minLetterHeight = letter.y;
    return minLetterHeight;
  };

  const getLetter = (fieldSize, letters, text) => {
    const lettersAmount = text.length;
    let resultLetter = {x: 0, y: 0};
    for (let letter of letters)
      if (letter.y <= fieldSize.y
          && letter.x * lettersAmount <= fieldSize.x
          && letter.x * lettersAmount > resultLetter.x * lettersAmount)
        resultLetter = letter;
    return resultLetter;
  };

  let minTaglineLetterHeight = getMinTaglineLetterHeight(lettersSizes);

  const maxTitleFieldSize = {
    x: size.self.x - size.icon.x,
    y: size.self.y - minTaglineLetterHeight,
  };
  let titleLetter = getLetter(maxTitleFieldSize, lettersSizes.title, title);

  const maxTaglineFieldSize = {
    x: size.self.x - size.icon.x,
    y: size.self.y - titleLetter.y,
  };
  let taglineLetter = getLetter(maxTaglineFieldSize, lettersSizes.tagline, tagline);

  let resultLetters = {
    title: titleLetter,
    tagline: taglineLetter,
  };

  return resultLetters;
};


const initBoardCanvas = (sizes, chosenData) => {
  const canvasWidth = 1100;

  const boardSize = chosenData.size.self;
  const iconSize = chosenData.size.icon;

  const canvasMultiplier = canvasWidth / boardSize.x;
  const canvasHeight = boardSize.y * canvasMultiplier;

  let canvas = $('boardCanvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  let ctx = canvas.getContext("2d");

  const getCanvasTextSize = (ctx, text, height, font) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.font = `${height}px ${font}`;
    let result = {
      x: ctx.measureText(text).width,
      y: height,
    };
    return result;
  };

  function drawBoard() {
    let canvasIconSize = {
      x: iconSize.x * canvasMultiplier,
      y: iconSize.y * canvasMultiplier,
    };

    let iconImgSize = {};
    if (this.width > this.height) {
      iconImgSize.x = canvasIconSize.x;
      iconImgSize.y = iconImgSize.x * this.height / this.width;
    } else {
      iconImgSize.y = canvasIconSize.y;
      iconImgSize.x = iconImgSize.y * this.width / this.height;
    }

    let titleLetterHeight = chosenData.optimalLetters.title.y * canvasMultiplier;
    let taglineLetterHeight = chosenData.optimalLetters.tagline.y * canvasMultiplier;

    let titleSize = getCanvasTextSize(ctx,
      chosenData.title,
      titleLetterHeight,
      chosenData.titleFont);
    let taglineSize = getCanvasTextSize(ctx,
      chosenData.tagline,
      taglineLetterHeight,
      chosenData.taglineFont);

    let horizontalMargin = (canvasWidth - iconImgSize.x - Math.max(titleSize.x, taglineSize.x)) / 3;
    let verticalTextMargin = (canvasHeight - titleSize.y - taglineSize.y) / 3;
    let verticalIconMargin = (canvasHeight - iconImgSize.y) / 2;

    let titlePosition = {
      x: canvasWidth - iconImgSize.x - horizontalMargin * 2 - titleSize.x,
      y: verticalTextMargin,
    };
    let taglinePosition = {
      x: canvasWidth - iconImgSize.x - horizontalMargin * 2 - taglineSize.x,
      y: titleSize.y + verticalTextMargin * 2,
    };
    let iconPosition = {
      x: canvasWidth - horizontalMargin - iconImgSize.x,
      y: verticalIconMargin,
    };

    ctx.fillStyle = chosenData.titleColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(this,
      iconPosition.x,
      iconPosition.y,
      iconImgSize.x,
      iconImgSize.y);

    ctx.globalCompositeOperation = "source-over";
    ctx.font = `${titleLetterHeight}px ${chosenData.titleFont}`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = chosenData.titleColor;
    ctx.fillText(chosenData.title, titlePosition.x, titlePosition.y);

    ctx.font = `${taglineLetterHeight}px ${chosenData.taglineFont}`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#000000';
    ctx.fillText(chosenData.tagline, taglinePosition.x, taglinePosition.y);

    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = chosenData.mainColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    chosenData.boardUrl = canvas.toDataURL();
  };

  let iconImg = new Image();
  iconImg.crossOrigin="anonymous"
  iconImg.onload = drawBoard;
  iconImg.src = chosenData.icon;
};


const fillIconsList = (icons) => {
  let setIcon = (iconElement, iconImage) => {
    let iconsElements = document.getElementsByClassName('calculator-icon');
    for (icon of iconsElements)
      icon.classList.remove('calculator-selected-icon');
    chosenData.icon = iconImage;
    iconElement.classList.add('calculator-selected-icon');
  };

  let iconsList = $('iconsList');
  iconsList.innerHTML = '';
  for (let icon of icons) {
    let iconElement = document.createElement('div');
    let imgElement = document.createElement('img');
    imgElement.src = icon;
    iconElement.appendChild(imgElement);
    iconElement.classList.add('calculator-icon');
    iconElement.addEventListener('click', () => setIcon(iconElement, icon));
    iconsList.appendChild(iconElement);
  }
};


const fillBusinessSphereList = ({businessSphereList}) => {
  const onBusinessSphereChoose = (index) => {
    chosenData.businessSphereIndex = index;
    fillIconsList(businessSphereList[chosenData.businessSphereIndex].icons);
    navigation.moveTo(2);
  };

  const generateListElement = (index) => {
    let li = document.createElement('li');
    li.innerText = businessSphereList[index].title;
    li.addEventListener('click', () => onBusinessSphereChoose(index));
    return li;
  };

  let listElement = $('calculatorBusinessSphereList');
  for (let i = 0; i < businessSphereList.length; i++) {
    let li = generateListElement(i);
    listElement.appendChild(li);
  }
};


const initDropdownMenus = ({sizes, fonts, colors}) => {
  let sizesDropdown = new Dropdown('sizesDropdown',
    'sizesDropdownTitle',
    'sizesDropdownContent');
  for (let size of sizes.boards) {
    let newContentElement = document.createElement('li');
    let text = `Board: ${size.self.x}x${size.self.y};`;
        text += ` Icon: ${size.icon.x}x${size.icon.y}`;
    newContentElement.innerText = text;
    sizesDropdown.addContentElement(newContentElement, size);
  }
  sizesDropdown.title = () => {
    let size = sizesDropdown.value;
    let text = `Board: ${size.self.x}x${size.self.y};`;
        text += ` Icon: ${size.icon.x}x${size.icon.y}`;
    return text;
  };
  sizesDropdown.onChoose = ({value}) => chosenData.size = value;

  let titleFontsDropdown = new Dropdown('titleFontDropdown',
    'titleFontDropdownTitle',
    'titleFontDropdownContent');
  let taglineFontsDropdown = new Dropdown('taglineFontDropdown',
    'taglineFontDropdownTitle',
    'taglineFontDropdownContent');
  for (let font of fonts) {
    let newTitleContentElement = document.createElement('li');
    newTitleContentElement.style.fontFamily = font;
    newTitleContentElement.innerText = font;
    titleFontsDropdown.addContentElement(newTitleContentElement, font);
    let newTaglineContentElement = document.createElement('li');
    newTaglineContentElement.style.fontFamily = font;
    newTaglineContentElement.innerText = font;
    taglineFontsDropdown.addContentElement(newTaglineContentElement, font);
  }
  titleFontsDropdown.onChoose = ({value}) => {
    chosenData.titleFont = value;
    titleFontsDropdown.titleElement.style.fontFamily = value;
  };
  taglineFontsDropdown.onChoose = ({value}) => {
    chosenData.taglineFont = value;
    taglineFontsDropdown.titleElement.style.fontFamily = value;
  };

  let mainColorsDropdown = new Dropdown('mainColorDropdown',
    'mainColorDropdownTitle',
    'mainColorDropdownContent');
  for (let color of colors.main) {
    let newContentElement = document.createElement('li');
    newContentElement.innerText = color;
    newContentElement.style.backgroundColor = color;
    mainColorsDropdown.addContentElement(newContentElement, color);
  }
  mainColorsDropdown.onChoose = ({value}) => {
    chosenData.mainColor = value;
    mainColorsDropdown.titleElement.style.backgroundColor = value;
  };

  let titleColorsDropdown = new Dropdown('titleColorDropdown',
    'titleColorDropdownTitle',
    'titleColorDropdownContent');
  for (let color of colors.title) {
    let newContentElement = document.createElement('li');
    newContentElement.innerText = color;
    newContentElement.style.backgroundColor = color;
    titleColorsDropdown.addContentElement(newContentElement, color);
  }
  titleColorsDropdown.onChoose = ({value}) => {
    chosenData.titleColor = value;
    titleColorsDropdown.titleElement.style.backgroundColor = value;
  };

  let needsHelpDropdown = new Dropdown('needHelpDropdown',
    'needHelpDropdownTitle',
    'needsHelpDropdownContent');
  let helpVariants = [
    {
      text: 'Yes, I do.',
      value: true,
    },
    {
      text: 'No, I don\'t',
      value: false,
    },
  ];
  for (let variant of helpVariants) {
    let newContentElement = document.createElement('li');
    newContentElement.innerText = variant.text;
    needsHelpDropdown.addContentElement(newContentElement, variant.value);
  }
  needsHelpDropdown.title =
    () => needsHelpDropdown.value ? 'Yes, I do.' : 'No, I don\'t';
  needsHelpDropdown.onChoose =
    ({value}) => chosenData.customer.needsHelp = value;
};


const initInputs = () => {
  $('titleInput')
    .addEventListener('input', (e) => chosenData.title = e.target.value);
  $('taglineInput')
    .addEventListener('input', (e) => chosenData.tagline = e.target.value);
  $('nameInput')
    .addEventListener('input', (e) =>
      chosenData.customer.name = e.target.value);
  $('phoneInput')
    .addEventListener('input', (e) =>
      chosenData.customer.phone = e.target.value);
  $('cityInput')
    .addEventListener('input', (e) =>
      chosenData.customer.city = e.target.value);
};


const initTechnologiesList = (technologies, businessSphereList) => {
  const initPage5 = (example, boardUrl) => {
    $('chosenTechnologyImage').src = example;
    $('boardImage').src = boardUrl;
  };

  const onTechnologyChoose = (technologies, index, example, boardUrl) => {
    chosenData.technology = technologies[index];
    chosenData.technologyIndex = index;
    chosenData.price = calculatePrice(chosenData);
    $('calculatorPrice').innerText = `Price: ${chosenData.price}`;
    initPage5(example, boardUrl);
    navigation.moveTo(5);
  };

  let examples = businessSphereList[chosenData.businessSphereIndex].examples;
  for (let i = 0; i < technologies.length; i++) {
    $(`technologyExample_${i}`).src = examples[i];
    $(`technologyTitle_${i}`).innerText = technologies[i];
    $(`technologyButton_${i}`)
      .addEventListener('click', () => onTechnologyChoose(technologies, i, examples[i], chosenData.boardUrl));
  }
};


const calcMaxTitleLettersAmount = (lettersSizes, boardSize) => {
  const getMinLetterWidth = (sizes) => {
    let minLetterWidth = sizes[0].x;
    for (let letter of sizes)
      if (letter.x < minLetterWidth)
        minLetterWidth = letter.x;
    return minLetterWidth;
  };

  let minTitleLetterWidth = getMinLetterWidth(lettersSizes.title);
  let minTaglineLetterWidth = getMinLetterWidth(lettersSizes.tagline);

  let result = {
    title: Math.floor((boardSize.self.x - boardSize.icon.x) / minTitleLetterWidth),
    tagline: Math.floor((boardSize.self.x - boardSize.icon.x) / minTaglineLetterWidth),
  };

  return result;
};


const initButtons = ({sizes, technologies, businessSphereList, defaultUtm}) => {
  $('openCalculatorButton')
    .addEventListener('click', () => navigation.moveTo(1));
  $('page2ButtonBack')
    .addEventListener('click', () => navigation.moveTo(1));
  $('page2ButtonNext')
    .addEventListener('click', () => {
      if (chosenData.taglineFont   == defaultChosenData.taglineFont
          || chosenData.titleColor == defaultChosenData.titleColor
          || chosenData.titleFont  == defaultChosenData.titleFont
          || chosenData.mainColor  == defaultChosenData.mainColor
          || chosenData.title      == defaultChosenData.title
          || chosenData.size       == defaultChosenData.size
          || chosenData.icon       == defaultChosenData.icon) {
        Alert.show('Error', 'Заполните все поля!', 'red', 5000);
        return;
      }
      let maxLetters =
        calcMaxTitleLettersAmount(sizes.letters, chosenData.size);
      if (chosenData.title.length > maxLetters.title) {
        let alertMessage =
          `Максимальный размер названия: ${maxLetters.title} символ(а/ов).`;
        alertMessage += `\nУ Вас: ${chosenData.title.length}.`;
        Alert.show('Error', alertMessage, 'red', 5000);
        return;
      }
      if (chosenData.tagline.length > maxLetters.tagline) {
        let alertMessage =
          `Максимальный размер слогана: ${maxLetters.tagline} символ(а/ов).`;
        alertMessage += `\nУ Вас: ${chosenData.tagline.length}.`;
        Alert.show('Error', alertMessage, 'red', 5000);
        return;
      }
      navigation.moveTo(3);
      chosenData.optimalLetters = getOptimalLetters(sizes.letters, chosenData);
      initBoardCanvas(sizes, chosenData);
    });
  $('page3ButtonBack')
    .addEventListener('click', () => navigation.moveTo(2));
  $('page3ButtonNext')
    .addEventListener('click', () => {
      navigation.moveTo(4);
      initTechnologiesList(technologies, businessSphereList);
    });
  $('page5ButtonBack')
    .addEventListener('click', () => navigation.moveTo(4));
  $('page5ButtonNext')
    .addEventListener('click', () => navigation.moveTo(6))
  $('finishButton').addEventListener('click', function() {
    let generateTitle = (phone, size) => {
      let result = phone;
          result += `_${size.x}x${size.y}`;
          result += `_${Date.now()}`;

      return result;
    };

    let createLead = (imageDownloadLink, defaultUtm) => {
      const generateComments = ({
        businessSphereIndex,
        taglineFont,
        titleColor,
        technology,
        titleFont,
        mainColor,
        customer,
        tagline,
        title,
        size,
      }, imageDownloadLink) => {
        let result = `<b>Business sphere:</b> ${businessSphereList[businessSphereIndex].title}<br>`;
            result += `<b>Size:</b> ${size.x}x${size.y}<br>`;
            result += `<b>Background color:</b> ${mainColor}<br>`;
            result += `<b>Technology:</b> ${technology}<br>`;
            result += '<br>';
            result += `<b>Title:</b> ${title}<br>`;
            result += `<b>Title font:</b> ${titleFont}<br>`;
            result += `<b>Title color:</b> ${titleColor}<br>`;
            result += '<br>';
            result += `<b>Tagline:</b> ${tagline}<br>`;
            result += `<b>Tagline font</b> ${taglineFont}<br>`;
            result += '<br>';
            result += `<b>Customer:</b><br><ul>`;
            result += `<li><b>Name:</b> ${customer.name}<br></li>`;
            result += `<li><b>Phone:</b> ${customer.phone}<br></li>`;
            result += `<li><b>City:</b> ${customer.city}<br></li>`;
            result += `<li><b>Needs help:</b> ${customer.needsHelp ? 'Yes' : 'No'}</li>`;
            result += '</ul><br>';
            result += `<b>Download link:</b> ${imageDownloadLink}`;
        return result;
      };

      let utm_source   = defaultUtm.source;
      let utm_medium   = defaultUtm.medium;
      let utm_campaign = defaultUtm.campaign;
      let utm_term     = defaultUtm.term;
      let utm_content  = defaultUtm.content;
      let comments = generateComments(chosenData, encodeURIComponent(imageDownloadLink));

      let creationUrl = `https://newidea.bitrix24.ua/rest/5682/u4nsz009bjondwpw/crm.lead.add.json?FIELDS[TITLE]=${'TestTitle'}&FIELDS[NAME]=${'TestName'}&FIELDS[PHONE][0][VALUE]=${'TestPhone'}&FIELDS[PHONE][0][VALUE_TYPE]=WORK&FIELDS[UTM_SOURCE]=${utm_source}&FIELDS[UTM_MEDIUM]=${utm_medium}&FIELDS[UTM_CAMPAIGN]=${utm_campaign}&FIELDS[UTM_TERM]=${utm_term}&FIELDS[UTM_CONTENT]=${utm_content}&FIELDS[COMMENTS]=${comments}`;
      let response = fetch(creationUrl)
        // TODO: Delete all console.log's;
        .then(console.log);
    };

    let boardImageTitle =
      generateTitle(chosenData.customer.phone, chosenData.size);
    var boardImageRef = storageRef.child(`boards/${boardImageTitle}.jpg`);

    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chosenData.boardUrl);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
      let buffer = xhr.response;
      let bytes = new Uint8Array(buffer);
      boardImageRef.put(bytes).then(function(snapshot) {
        storage.ref(`boards/${boardImageTitle}.jpg`).getDownloadURL()
          .then((url) => {
            // TODO: Delete all console.log's;
            console.log(url);
            createLead(url, defaultUtm);
          });
      });
    };
    xhr.send();
  });
};


document.addEventListener('DOMContentLoaded', () => {
  navigation = new CalculatorNavigation();
  Alert.init();
  fillBusinessSphereList(initialData);
  initDropdownMenus(initialData);
  initInputs();
  initButtons(initialData);
  navigation.moveTo(0);
});
