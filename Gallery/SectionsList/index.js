function SectionsList(options) {
	this.sections = options.sections ? options.sections : [];
	this.DOMElement = document.getElementById(options.DOMElementId);
	this.sectionsListElementClass = options.sectionsListElementClass
			? options.sectionsListElementClass
			: 'standart-sections-list-element';
	this.sectionElementClass = options.sectionElementClass
			? options.sectionElementClass
			: 'standart-section-element';
	this.imagesListElementClass = options.imagesListElementClass
			? options.imagesListElementClass
			: 'standart-images-list-element';
	this.imageElementClass = options.imageElementClass
			? options.imageElementClass
			: 'standart-image-element';
	this.imagesListBackgroudText = options.imagesListBackgroudText
			? options.imagesListBackgroudText
			: 'Select a section, please.';
	this.selectedSectionId = -1;
	this.onSectionSelect = options.onSectionSelect;
}

SectionsList.prototype.init = function() {
	const generateSectionsListElement = () => {
		const generateSectionElement = (sectionId) => {
			let sectionElement = document.createElement('div');
			sectionElement.id = `section_element_${sectionId}`;
			sectionElement.classList.add(this.sectionElementClass);
			sectionElement.innerHTML = this.sections[sectionId].name;
			sectionElement.addEventListener('click', () => this.select(sectionId));
			return sectionElement;
		};

		const sectionsListElement = document.createElement('div');
		sectionsListElement.classList.add(this.sectionsListElementClass);
		for (let sectionId = 0; sectionId < this.sections.length; sectionId++) {
			let sectionElement = generateSectionElement(sectionId);
			sectionsListElement.appendChild(sectionElement);
		}
		return sectionsListElement;
	};

	const generateAllImagesListsElement = () => {
		const generateImagesListElement = (sectionId) => {
			const generateImageElement = (sectionId, imageId) => {
				let imageElement = document.createElement('div');
				imageElement.id = `image_element_${sectionId}_${imageId}`;
				imageElement.classList.add(this.imageElementClass);
				imageElement.style.backgroundImage =
					`url(${this.sections[sectionId].images[imageId]})`;
				imageElement.addEventListener('click', () =>
					this.showFullScreenImage(sectionId, imageId));
				return imageElement;
			};

			let imagesListElement = document.createElement('div');
			imagesListElement.id = `images_list_element_${sectionId}`;
			imagesListElement.classList.add(this.imagesListElementClass);
			for (let imageId = 0;
				imageId < this.sections[sectionId].images.length;
				imageId++) {
				let imageElement = generateImageElement(sectionId, imageId);
				imagesListElement.appendChild(imageElement);
			}
			imagesListElement.style.pointerEvents = 'none';
			imagesListElement.style.opacity = 0;
			return imagesListElement;
		};

		const generateBackgroundText = (text) => {
			let textElement = document.createElement('p');
			textElement.classList.add('images-list-background-text');
			textElement.innerText = text;
			return textElement;
		};

		let allImagesListsElement = document.createElement('div');
		allImagesListsElement.classList.add('all-images-lists-element');
		for (let sectionId = 0; sectionId < this.sections.length; sectionId++) {
			let imagesListElement = generateImagesListElement(sectionId);
			allImagesListsElement.appendChild(imagesListElement);
		}
		let backgroundText = generateBackgroundText(this.imagesListBackgroudText);
		allImagesListsElement.appendChild(backgroundText);
		return allImagesListsElement;
	};

	const generateFullScreenImageElement = () => {
		let fullScreenImageElement = document.createElement('div');
		fullScreenImageElement.classList.add('full-screen-image-block');
		let imageElement = document.createElement('img');
		imageElement.classList.add('full-screen-image');
		fullScreenImageElement.addEventListener('click',
			() => this.hideFullScreenImage());
		fullScreenImageElement.appendChild(imageElement);
		return fullScreenImageElement;
	};

	let sectionsListElement = generateSectionsListElement();
	let allImagesListsElement = generateAllImagesListsElement();
	let fullScreenImageElement = generateFullScreenImageElement();

	this.DOMElement.appendChild(sectionsListElement);
	this.DOMElement.appendChild(allImagesListsElement);
	this.DOMElement.appendChild(fullScreenImageElement);
}

SectionsList.prototype.select = function(sectionId) {
	if (sectionId == this.selectedSectionId)
		return;

	if (this.selectedSectionId >= 0) {
		let selectedSectionImagesListElement =
			document.getElementById(`images_list_element_${this.selectedSectionId}`);
		selectedSectionImagesListElement.style.pointerEvents = 'none';
		selectedSectionImagesListElement.style.opacity = 0;
	}
	else
		this.DOMElement.getElementsByClassName('images-list-background-text')[0]
				.style.opacity = 0;
	let imagesListElement =
		document.getElementById(`images_list_element_${sectionId}`)
	imagesListElement.style.pointerEvents = 'auto';
	imagesListElement.style.opacity = 1;
	this.selectedSectionId = sectionId;
	for (let callback of this.onSectionSelect)
		callback(sectionId);
}

SectionsList.prototype.showFullScreenImage = function(sectionId, imageId) {
	this.DOMElement.getElementsByClassName('full-screen-image')[0].src =
		sections[sectionId].images[imageId];
	let fullScreenImageBlock =
		this.DOMElement.getElementsByClassName('full-screen-image-block')[0];
	fullScreenImageBlock.style.opacity = 1;
	fullScreenImageBlock.style.pointerEvents = 'auto';
}

SectionsList.prototype.hideFullScreenImage = function() {
	let fullScreenImageBlock =
		this.DOMElement.getElementsByClassName('full-screen-image-block')[0];
	fullScreenImageBlock.style.opacity = 0;
	fullScreenImageBlock.style.pointerEvents = 'none';
}
