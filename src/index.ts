// TODO

// [ ] !! zkusit nastavit gulp pro minifikaci

// [x] zjistit všechny potomky zadaného elementu 
// [ ] propočty velikostí dát do samostatné funkce, která se bude volat např. po resizu
// [x] zjistit velikost rodičovského elementu a tu nastavit slideru
// [x] při inicializaci vytvořit nový inner div, který bude mít nastavenou
//     správnou šířku 

type SettingsType = {
    buttons?: Boolean;
}

class Slider {
    elementName: string;
    elementHTML: HTMLElement;
    dimensionOfParent: ClientRect;

    constructor(element: string, settings?: SettingsType) {
        // get name and element of slider
        this.elementName = element;
        this.elementHTML = $(element);
        // get dimension of parent element - just in case
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();

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

        // display info
        console.log(childrenOfDiv);
    }

    settings(settings?: SettingsType) {
        if (settings.hasOwnProperty('buttons')) {
            console.log(settings);
        } else {
            console.log('nemá');
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
