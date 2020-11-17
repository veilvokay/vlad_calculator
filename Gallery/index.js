let sectionsList;
const sections = [
	{
		name: 'One',
		images: [
			'images/Bubble_Car/8.jpg',
			'images/Bubble_Car/9.jpg',
			'images/Bubble_Car/10.jpg',
			'images/Bubble_Car/11.jpg',
			'images/Bubble_Car/12.jpg',
			'images/Bubble_Car/13.jpg',
		],
	},
	{
		name: 'Two',
		images: [
			'images/Supermarket_ROST/14.jpg',
			'images/Supermarket_ROST/15.jpg',
			'images/Supermarket_ROST/16.jpg',
			'images/Supermarket_ROST/17.jpg',
			'images/Supermarket_ROST/18.png',
			'images/Supermarket_ROST/19.png',
		],
	},
	{
		name: 'Three',
		images: [
			'images/FK_Nova_Bavaria/20.jpg',
			'images/FK_Nova_Bavaria/21.jpg',
			'images/FK_Nova_Bavaria/22.jpg',
			'images/FK_Nova_Bavaria/23.jpg',
			'images/FK_Nova_Bavaria/24.jpg',
			'images/Alcon/7.jpg',
		],
	},
	{
		name: 'Four',
		images: [
			'images/Al_Dente/1.jpg',
			'images/Al_Dente/2.jpg',
			'images/Al_Dente/3.jpg',
			'images/Alcon/4.jpg',
			'images/Alcon/5.jpg',
			'images/Alcon/6.jpg',
		],
	},
];

document.addEventListener('DOMContentLoaded', () => {
	sectionsList = new SectionsList({
		sections: sections,
		DOMElementId: 'sectionsListBlock',
		sectionsListElementClass: '',
		sectionElementClass: '',
		imagesListElementClass: '',
		imageElementClass: '',
		imagesListBackgroudText: '',
		onSectionSelect: [],
	});
	sectionsList.init();
});
