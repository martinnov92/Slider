"use strict";
var Slider = (function () {
    function Slider(element, settings) {
        this.elementName = element;
        var elementHTML = this.elementHTML = $(element);
        this.arrayOfChildren = [];
        var fragment = document.createDocumentFragment();
        var innerDiv = this.innerDiv = document.createElement('div');
        innerDiv.classList.add('m-slider__inner');
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
        this.nextClick = 0;
        elementHTML.appendChild(innerDiv);
        this.getElements(true);
        this.init();
        this.settings(settings);
    }
    Slider.prototype.getElements = function (init) {
        var _this = this;
        var nodeList = [];
        if (init) {
            nodeList = $$(this.elementName + ' > *:not(.m-slider__inner)');
        }
        else {
            nodeList = $$(this.elementName + ' > div > *');
        }
        var childrenOfDiv = Array.prototype.slice.apply(nodeList);
        if (init) {
            childrenOfDiv.forEach(function (child, i) {
                _this.arrayOfChildren.push({
                    element: child,
                    active: i === 0 ? true : false
                });
            });
        }
        else {
            childrenOfDiv.forEach(function (child, i) {
                _this.arrayOfChildren[i].element = child;
            });
        }
    };
    Slider.prototype.sliderDimension = function () {
        console.log(this.arrayOfChildren[0].element.offsetLeft);
    };
    Slider.prototype.init = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var totalWidth = this.dimensionOfParent.width * this.arrayOfChildren.length;
        this.innerDiv.style.width = totalWidth + 'px';
        this.innerDiv.style.height = this.dimensionOfParent.height + 'px';
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        this.arrayOfChildren.forEach(function (child) {
            child.element.classList.add('m-slider__slide');
            if (child.active) {
                child.element.classList.add('m-slider__slide-active');
            }
            child.element.style.width = _this.dimensionOfParent.width + 'px';
            _this.innerDiv.appendChild(child.element);
        });
        fragment.appendChild(this.innerDiv);
        this.elementHTML.appendChild(fragment);
    };
    Slider.prototype.settings = function (settings) {
        var _this = this;
        var fragment = document.createDocumentFragment();
        if (settings.hasOwnProperty('buttons')) {
            var nextButton = document.createElement('button');
            var prevButton = document.createElement('button');
            nextButton.setAttribute('type', 'button');
            nextButton.setAttribute('title', 'Next slide');
            prevButton.setAttribute('type', 'button');
            prevButton.setAttribute('title', 'Previous slide');
            nextButton.onclick = function () { return _this.next(); };
            prevButton.onclick = function () { return _this.prev(); };
            nextButton.textContent = 'Next';
            prevButton.textContent = 'Prev';
            nextButton.classList.add('m-slider__button', 'm-slider__button-next');
            prevButton.classList.add('m-slider__button', 'm-slider__button-prev');
            fragment.appendChild(nextButton);
            fragment.appendChild(prevButton);
        }
        this.elementHTML.appendChild(fragment);
    };
    Slider.prototype.next = function () {
        var indexOfActiveElement = this.arrayOfChildren.findIndex(function (child) { return child.active; });
        var currentActive = this.arrayOfChildren[indexOfActiveElement];
        var nextActive = this.arrayOfChildren[indexOfActiveElement + 1];
        if (nextActive === undefined) {
            nextActive = this.arrayOfChildren[0];
        }
        currentActive.active = !currentActive.active;
        nextActive.active = !nextActive.active;
        currentActive.element.classList.remove('m-slider__slide-active');
        nextActive.element.classList.add('m-slider__slide-active');
        this.getElements();
    };
    Slider.prototype.prev = function () {
        var indexOfActiveElement = this.arrayOfChildren.findIndex(function (child) { return child.active; });
        var currentActive = this.arrayOfChildren[indexOfActiveElement];
        var prevActive = this.arrayOfChildren[indexOfActiveElement - 1];
        if (prevActive === undefined) {
            prevActive = this.arrayOfChildren[this.arrayOfChildren.length - 1];
        }
        currentActive.active = !currentActive.active;
        prevActive.active = !prevActive.active;
        currentActive.element.classList.remove('m-slider__slide-active');
        prevActive.element.classList.add('m-slider__slide-active');
        this.getElements();
    };
    return Slider;
}());
function $(selector, container) {
    return (container ? document.querySelector(container) : document).querySelector(selector);
}
function $$(selector, container) {
    return (container ? document.querySelectorAll(container) : document).querySelectorAll(selector);
}
