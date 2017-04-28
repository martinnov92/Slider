// TODO

// [ ] propočty velikostí dát do samostatné funkce, která se bude volat např. po resizu
// [x] zkusit nastavit gulp pro minifikaci
// [x] zjistit všechny potomky zadaného elementu 
// [x] zjistit velikost rodičovského elementu a tu nastavit slideru
// [x] při inicializaci vytvořit nový inner div, který bude mít nastavenou
//     správnou šířku 
// [ ] přidat tlačítka + promyslet, jak budou fungovat

type SettingsType = {
    buttons?: Boolean;
}

class Slider {
    elementName: string;
    elementHTML: HTMLElement;
    innerDiv: HTMLElement;
    dimensionOfParent: ClientRect;
    nextClick: number;

    constructor(element: string, settings?: SettingsType) {
        // get name and element of slider
        this.elementName = element;
        this.elementHTML = $(element);
        // get dimension of parent element - just in case
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();

        // click counters
        this.nextClick = 0;

        // init slider
        this.init();
        this.settings(settings);
    }

    sliderDimension() {

    }

    init() {
        // document fragment
        const fragment = document.createDocumentFragment();
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('m-slider__inner');

        // get children and save it to array => NodeList to array
        const nodeList = $$(this.elementName + ' > *');
        const childrenOfDiv = Array.prototype.slice.apply(nodeList);

        // width for new innerDiv = dimension * count of divs
        const totalWidth = this.dimensionOfParent.width * childrenOfDiv.length;
        innerDiv.style.width = totalWidth + 'px';
        innerDiv.style.height = this.dimensionOfParent.height + 'px';

        // add classes to divs and parent div
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        childrenOfDiv.forEach(div => {
            div.classList.add('m-slider__slide');
            div.style.width = this.dimensionOfParent.width + 'px';
            innerDiv.appendChild(div);
        });

        fragment.appendChild(innerDiv);
        this.elementHTML.appendChild(fragment);
        
        this.innerDiv = innerDiv;
    }

    settings(settings?: SettingsType) {
        const fragment = document.createDocumentFragment();

        if (settings.hasOwnProperty('buttons')) {
            const nextButton = document.createElement('button');
            const prevButton = document.createElement('button');

            nextButton.setAttribute('type',  'button');
            nextButton.setAttribute('title', 'Next slide');

            prevButton.setAttribute('type',  'button');
            prevButton.setAttribute('title', 'Previous slide');

            nextButton.onclick = () => this.next(this.innerDiv);
            prevButton.onclick = this.prev;

            nextButton.textContent = 'Next';
            prevButton.textContent = 'Prev';

            nextButton.classList.add('m-slider__button', 'm-slider__button-next');
            prevButton.classList.add('m-slider__button', 'm-slider__button-prev');

            fragment.appendChild(nextButton);
            fragment.appendChild(prevButton);
        }
        
        this.elementHTML.appendChild(fragment);
    }

    next(element?: HTMLElement): any {
        this.nextClick += 1;
        const totalTranslate = this.dimensionOfParent.width * this.nextClick;

        element.style.transform = `translate3d(-${totalTranslate}px, 0, 0)`;
    }

    prev() {
        console.log('prev');
    }
}

/*
**
**
**
    MY LITTLE JQUERY - HELPERS FUNCTIONS
**
**
**
*/

function $(selector?: any, container?: any): HTMLElement {
    return (container ? document.querySelector(container) : document).querySelector(selector);
}

function $$(selector?: any, container?: any): HTMLElement[] {
    return (container ? document.querySelectorAll(container) : document).querySelectorAll(selector);
}
