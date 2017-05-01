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
// [x] updatetovat active class u dots
// [x] custom buttons
// [x] upravit velikosti po resizu

type customButtons = {
    prev: string,
    next: string
}

type SettingsType = {
    defaultButtons?: boolean;
    dots?: boolean;
    floatingDots?: boolean;
    customButtons?: customButtons;
};

type StoreType = {
    element?: HTMLElement;
    dots?: HTMLElement;
    active?: boolean;
};

class Slider {
    elementName: string;
    elementHTML: HTMLElement;
    innerDiv: HTMLElement;
    childrenOfDiv: HTMLElement[];
    store: StoreType[];
    dimensionOfParent: ClientRect;
    defaultSettings: SettingsType;
    settings: SettingsType;

    constructor(element: string, settings?: SettingsType) {
        // get name and element of slider
        let elementHTML = this.elementHTML = $(element);
        this.elementName = element;
        this.store = [];
        var resizeTimer;

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
            defaultButtons: true,
            dots: false,
            floatingDots: true,
            customButtons: undefined
        }
        this.settings = Object.assign({}, settings);
                
        // set slider according to given settings
        this.setSlider();

        window.addEventListener('resize', () => {
            this.elementHTML.classList.add('m-slider-resizing');
            clearTimeout(resizeTimer);

            // check if resizing has stopped
            // and if yes, remove class
            resizeTimer = setTimeout(() => {
                this.elementHTML.classList.remove('m-slider-resizing');
            }, 250);

            this.sliderDimension();
        });
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
                this.store.push({
                    element: child,
                    active: i === 0 ? true : false
                });
            });
        } else {
            childrenOfDiv.forEach((child, i) => {
                this.store[i].element = child;
            });
        }
    }

    sliderDimension() {
        // get and save new dimensions of parent
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
        // new width
        let totalWidth = this.dimensionOfParent.width * this.store.length;
        this.innerDiv.style.width = totalWidth + 'px';

        // for every div set correct size
        this.store.forEach((child) => {
            child.element.style.width = this.dimensionOfParent.width + 'px';
        });

        // set correct position of innerDiv
        this.innerDiv.style.transform = `translate3d(-${this.store[findIndex(this.store, 'active')].element.offsetLeft}px, 0, 0)`;
        this.innerDiv.style.overflow = 'auto';
    }

    init(): void {
        let fragment = document.createDocumentFragment();
        // width for new innerDiv = dimension * count of divs
        let totalWidth = this.dimensionOfParent.width * this.store.length;
        this.innerDiv.style.width = totalWidth + 'px';
        this.innerDiv.style.height = this.dimensionOfParent.height + 'px';

        // add classes to divs and parent div
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        this.store.forEach((child) => {
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

        if (this.settings.customButtons !== undefined && this.settings.defaultButtons === false) {
            if (this.settings.customButtons.hasOwnProperty('prev') 
                && this.settings.customButtons.hasOwnProperty('next')) {
                let buttons = this.customButtons();
                fragment.appendChild(buttons);
            }
        } else if (this.settings.defaultButtons || this.defaultSettings.defaultButtons) {
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
        let indexOfActiveElement = findIndex(this.store, 'active');

        // get current and next active element
        let currentActive = this.store[indexOfActiveElement];
        let nextActive = this.store[indexOfActiveElement + 1];
        
        // change current and next active element's state
        if (nextActive === undefined) {
            nextActive = this.store[0];
        }
        
        currentActive.active = !currentActive.active;
        nextActive.active = !nextActive.active;
        
        currentActive.element.classList.remove('m-slider__slide-active');
        nextActive.element.classList.add('m-slider__slide-active');

        if (nextActive.dots !== undefined) {
            currentActive.dots.classList.remove('m-slider__dots-active');
            nextActive.dots.classList.add('m-slider__dots-active');
        }

        this.getElements();
        this.innerDiv.style.transform = `translate3d(-${this.store[findIndex(this.store, 'active')].element.offsetLeft}px, 0, 0)`;
        this.innerDiv.style.overflow = 'auto';
    }

    prev(): void {
        // get the active element
        let indexOfActiveElement = findIndex(this.store, 'active');

        // get current and next active element
        let currentActive = this.store[indexOfActiveElement];
        let prevActive = this.store[indexOfActiveElement - 1];

        // change current and next active element's state
        if (prevActive === undefined) {
            prevActive = this.store[this.store.length - 1];
        }
            
        currentActive.active = !currentActive.active;
        prevActive.active = !prevActive.active;

        currentActive.element.classList.remove('m-slider__slide-active');
        prevActive.element.classList.add('m-slider__slide-active');

        if (prevActive.dots !== undefined) {
            currentActive.dots.classList.remove('m-slider__dots-active');
            prevActive.dots.classList.add('m-slider__dots-active');
        }

        this.getElements();
        this.innerDiv.style.transform = 
            `translate3d(-${this.store[findIndex(this.store, 'active')].element.offsetLeft}px, 0, 0)`;
        this.innerDiv.style.overflow = 'auto';
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

    customButtons() {
        let fragment = document.createDocumentFragment();
        let prevButtonDiv = document.createElement('div');
        let nextButtonDiv = document.createElement('div');
        let prevButton = this.settings.customButtons.prev;
        let nextButton = this.settings.customButtons.next;

        prevButtonDiv.innerHTML = prevButton;
        nextButtonDiv.innerHTML = nextButton;

        prevButtonDiv.classList.add('m-slider__button', 'm-slider__button-prev');
        nextButtonDiv.classList.add('m-slider__button', 'm-slider__button-next');

        prevButtonDiv.addEventListener('click', () => this.prev());
        nextButtonDiv.addEventListener('click', () => this.next());

        fragment.appendChild(prevButtonDiv);
        fragment.appendChild(nextButtonDiv);

        return fragment;
    }

    initDots() {
        let fragment = document.createDocumentFragment();
        let div = document.createElement('div');
        let ul = document.createElement('ul');

        this.store.forEach((div, i) => {
            let li = document.createElement('li');
            if (div.active) {
                li.classList.add('m-slider__dots-active');
            }

            li.innerHTML = 
                `<button type='button' class='m-slider__dots-btn'></button>`;

            div.dots = li;

            ul.appendChild(li);
        })

        div.classList.add('m-slider__dots', 'm-slider__dots-floating');

        if (this.settings.floatingDots === false) {
            div.classList.remove('m-slider__dots-floating');
            
            // if no floating dots => set new height to parent element

            //this.elementHTML.style.height = this.dimensionOfParent.height + div.getBoundingClientRect().height + 'px';
            //console.log(div.getBoundingClientRect().height);
        }

        div.appendChild(ul);
        fragment.appendChild(div);

        return fragment;
    }
}

/*
    MY LITTLE JQUERY - HELPERS FUNCTIONS
*/

function $(selector?: any, container?: any): HTMLElement {
    return (container ? document.querySelector(container) : document).querySelector(selector);
}

function $$(selector?: any, container?: any): HTMLElement[] {
    return (container ? document.querySelectorAll(container) : document).querySelectorAll(selector);
}

function findIndex(arr: any[], lookingFor: string): number {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][lookingFor]) {
            index = i;
        }
    }
    return index;
}