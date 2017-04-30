// TODO

// [ ] propočty velikostí dát do samostatné funkce, která se bude volat např. po resizu
// [x] zkusit nastavit gulp pro minifikaci
// [x] zjistit všechny potomky zadaného elementu 
// [x] zjistit velikost rodičovského elementu a tu nastavit slideru
// [x] při inicializaci vytvořit nový inner div, který bude mít nastavenou
//     správnou šířku 
// [x] přidat tlačítka
// [x] vymyslet jak updatovat divy v innerDiv např po resizu, aby se správně nastavil offsetLeft, ...
//     asi bude stačit zavolat getDimension()
// [ ]
// [ ]

type SettingsType = {
    buttons?: boolean;
    dots?: boolean;
};

type childrenOfDivType = {
    element?: HTMLElement;
    active?: boolean;
};

class Slider {
    elementName: string;
    elementHTML: HTMLElement;
    innerDiv: HTMLElement;
    childrenOfDiv: HTMLElement[];
    arrayOfChildren: childrenOfDivType[];
    dimensionOfParent: ClientRect;
    defaultSettings: SettingsType;
    settings: SettingsType;

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

        // append innerDiv
        elementHTML.appendChild(innerDiv);

        // init slider
        this.getElements(true);
        this.init();

        // default settings
        this.defaultSettings = {
            buttons: true,
            dots: false
        }

        this.settings = Object.assign({}, settings);
                
        // settings
        this.setSlider();
    }

    getElements(init?: boolean): void {
        // get children and save it to array => NodeList to array
        // only for the first time - later use method
        let nodeList = [];

        if (init) {
            nodeList = $$(this.elementName + ' > *:not(.m-slider__inner)');
        } else {
            nodeList = $$(this.elementName + ' > div > div[class="m-slider__slide"]');
        }

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

    init(): void {
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

    setSlider(): void {
        const fragment = document.createDocumentFragment();

        if (this.settings.buttons || this.defaultSettings.buttons) {
            let buttons = this.initButtons();
            fragment.appendChild(buttons);
        }

        if (this.settings.dots || this.defaultSettings.dots) {
            let dots = this.initDots();
            fragment.appendChild(dots);
        }
        
        this.elementHTML.appendChild(fragment);
    }

    next(): void {
        // get the active element
        let indexOfActiveElement = this.arrayOfChildren.findIndex((child) => child.active);
        
        // get current and next active element
        let currentActive = this.arrayOfChildren[indexOfActiveElement];
        let nextActive = this.arrayOfChildren[indexOfActiveElement + 1];
        
        // change current and next active element's state
        if (nextActive === undefined) {
            nextActive = this.arrayOfChildren[0];
        }
        
        currentActive.active = !currentActive.active;
        nextActive.active = !nextActive.active;
        
        currentActive.element.classList.remove('m-slider__slide-active');
        nextActive.element.classList.add('m-slider__slide-active');

        this.getElements();
        this.innerDiv.style.transform = `translate3d(-${this.arrayOfChildren[this.arrayOfChildren.findIndex((child) => child.active)].element.offsetLeft}px, 0, 0)`;
        this.innerDiv.style.overflow = 'auto';
    }

    prev(): void {
        // get the active element
        let indexOfActiveElement = this.arrayOfChildren.findIndex((child) => child.active);

        // get current and next active element
        let currentActive = this.arrayOfChildren[indexOfActiveElement];
        let prevActive = this.arrayOfChildren[indexOfActiveElement - 1];

        // change current and next active element's state
        if (prevActive === undefined) {
            prevActive = this.arrayOfChildren[this.arrayOfChildren.length - 1];
        }
            
        currentActive.active = !currentActive.active;
        prevActive.active = !prevActive.active;

        currentActive.element.classList.remove('m-slider__slide-active');
        prevActive.element.classList.add('m-slider__slide-active');

        this.getElements();
    }

    initButtons() {
        let fragment = document.createDocumentFragment();
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

        return fragment;
    }

    initDots() {
        let fragment = document.createDocumentFragment();
        let div = document.createElement('div');
        let ul = document.createElement('ul');

        this.arrayOfChildren.forEach((div, i) => {
            let li = document.createElement('li');
            if (div.active) {
                li.classList.add('m-slider__dots-active');
            }

            li.innerHTML = 
                `<button type='button' class='m-slider__dots-btn'></button>`;

            ul.appendChild(li);
        })

        div.classList.add('m-slider__dots');
        div.appendChild(ul);

        fragment.appendChild(div);

        return fragment;
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
