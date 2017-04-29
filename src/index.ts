// TODO

// [ ] propočty velikostí dát do samostatné funkce, která se bude volat např. po resizu
// [x] zkusit nastavit gulp pro minifikaci
// [x] zjistit všechny potomky zadaného elementu 
// [x] zjistit velikost rodičovského elementu a tu nastavit slideru
// [x] při inicializaci vytvořit nový inner div, který bude mít nastavenou
//     správnou šířku 
// [x] přidat tlačítka
// [ ] vymyslet jak updatovat divy v innerDiv např po resizu, aby se správně nastavil offsetLeft, ...
// [ ] vymyslet listener pro push v poli + updatovat stav slideru

type SettingsType = {
    buttons?: Boolean;
}

type childrenOfDivType = {
    element?: HTMLElement;
    active?: boolean;
}

class Slider {
    elementName: string;
    elementHTML: HTMLElement;
    innerDiv: HTMLElement;
    childrenOfDiv: HTMLElement[];
    arrayOfChildren: childrenOfDivType[];
    dimensionOfParent: ClientRect;
    nextClick: number;

    constructor(element: string, settings?: SettingsType) {
        // get name and element of slider
        this.elementName = element;
        let elementHTML = this.elementHTML = $(element);
        this.arrayOfChildren = [];

        // document fragment
        let fragment = document.createDocumentFragment();
        let innerDiv = this.innerDiv = document.createElement('div');
        innerDiv.classList.add('m-slider__inner');

        // get dimension of parent element - just in case
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();

        // click counters
        this.nextClick = 0;

        // append innerDiv
        elementHTML.appendChild(innerDiv);
        // get elements and save them to array
        this.getElements(true);
        // init slider
        this.init();
        this.settings(settings);
    }

    getElements(init?: boolean) {
        // get children and save it to array => NodeList to array
        // only for the first time - later use method
        let nodeList = $$(this.elementName + ' > *:not(.m-slider__inner)');
        let childrenOfDiv = Array.prototype.slice.apply(nodeList);

        if (init) {
            childrenOfDiv.forEach((child, i) => {
                this.arrayOfChildren.push({
                    element: child,
                    active: i === 0 ? true : false
                });
            });
        } else {
            childrenOfDiv.forEach((child, i) => {
                this.arrayOfChildren[i].element = child;
            });
        }
    }

    sliderDimension() {
        console.log(this.arrayOfChildren[0].element.offsetLeft);
    }

    init() {
        let fragment = document.createDocumentFragment();
        // width for new innerDiv = dimension * count of divs
        let totalWidth = this.dimensionOfParent.width * this.arrayOfChildren.length;
        this.innerDiv.style.width = totalWidth + 'px';
        this.innerDiv.style.height = this.dimensionOfParent.height + 'px';

        // add classes to divs and parent div
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        this.arrayOfChildren.forEach((child) => {
            child.element.classList.add('m-slider__slide');
            if (child.active) {
                child.element.classList.add('m-slider__slide-active');
            }
            child.element.style.width = this.dimensionOfParent.width + 'px';
            this.innerDiv.appendChild(child.element);
        });

        fragment.appendChild(this.innerDiv);
        this.elementHTML.appendChild(fragment);
    }

    settings(settings?: SettingsType) {
        const fragment = document.createDocumentFragment();

        if (settings.hasOwnProperty('buttons')) {
            let nextButton = document.createElement('button');
            let prevButton = document.createElement('button');

            nextButton.setAttribute('type',  'button');
            nextButton.setAttribute('title', 'Next slide');

            prevButton.setAttribute('type',  'button');
            prevButton.setAttribute('title', 'Previous slide');

            nextButton.onclick = () => this.next();
            prevButton.onclick = () => this.prev();

            nextButton.textContent = 'Next';
            prevButton.textContent = 'Prev';

            nextButton.classList.add('m-slider__button', 'm-slider__button-next');
            prevButton.classList.add('m-slider__button', 'm-slider__button-prev');

            fragment.appendChild(nextButton);
            fragment.appendChild(prevButton);
        }
        
        this.elementHTML.appendChild(fragment);
    }

    next() {
        // get the active element
        let indexOfActiveElement = this.arrayOfChildren.findIndex((child) => child.active);
        // get count of elements
        let lengthOfElements = this.arrayOfChildren.length;
        // get current and next active element
        let currentActive = this.arrayOfChildren[indexOfActiveElement];
        let nextActive = this.arrayOfChildren[indexOfActiveElement + 1];
        // change current and next active element's state
        if (nextActive !== undefined) {
            currentActive.active = !currentActive.active;
            nextActive.active = !nextActive.active;
        } else {
            currentActive.active = !currentActive.active;
            this.arrayOfChildren[0].active = true;
        }
    }

    prev() {
        // get the active element
        let indexOfActiveElement = this.arrayOfChildren.findIndex((child) => child.active);
        // get count of elements
        let lengthOfElements = this.arrayOfChildren.length;
        // get current and next active element
        let currentActive = this.arrayOfChildren[indexOfActiveElement];
        let prevActive = this.arrayOfChildren[indexOfActiveElement - 1];
        // change current and next active element's state
        if (prevActive !== undefined) {
            currentActive.active = !currentActive.active;
            prevActive.active = !prevActive.active;
        } else {
            currentActive.active = !currentActive.active;
            this.arrayOfChildren[this.arrayOfChildren.length - 1].active = true;
        }
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
