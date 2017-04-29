"use strict";
var Slider = (function () {
    function Slider(element, settings) {
        var _this = this;
        this.elementName = element;
        this.elementHTML = $(element);
        this.arrayOfChildren = [];
        var nodeList = $$(this.elementName + ' > *');
        var childrenOfDiv = Array.prototype.slice.apply(nodeList);
        childrenOfDiv.forEach(function (child, i) {
            _this.arrayOfChildren.push({
                element: child,
                active: i === 0 ? true : false
            });
        });
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
        this.nextClick = 0;
        this.init();
        this.settings(settings);
    }
    Slider.prototype.sliderDimension = function () {
        console.log(this.arrayOfChildren[0].element.offsetLeft);
    };
    Slider.prototype.init = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var innerDiv = document.createElement('div');
        innerDiv.classList.add('m-slider__inner');
        var totalWidth = this.dimensionOfParent.width * this.arrayOfChildren.length;
        innerDiv.style.width = totalWidth + 'px';
        innerDiv.style.height = this.dimensionOfParent.height + 'px';
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        this.arrayOfChildren.forEach(function (child) {
            child.element.classList.add('m-slider__slide');
            if (child.active) {
                child.element.classList.add('m-slider__slide-active');
            }
            child.element.style.width = _this.dimensionOfParent.width + 'px';
            innerDiv.appendChild(child.element);
        });
        fragment.appendChild(innerDiv);
        this.elementHTML.appendChild(fragment);
        this.innerDiv = innerDiv;
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
        var lengthOfElements = this.arrayOfChildren.length;
        var currentActive = this.arrayOfChildren[indexOfActiveElement];
        var nextActive = this.arrayOfChildren[indexOfActiveElement + 1];
        if (nextActive !== undefined) {
            currentActive.active = !currentActive.active;
            nextActive.active = !nextActive.active;
        }
        else {
            currentActive.active = !currentActive.active;
            this.arrayOfChildren[0].active = true;
        }
    };
    Slider.prototype.prev = function () {
        var indexOfActiveElement = this.arrayOfChildren.findIndex(function (child) { return child.active; });
        var lengthOfElements = this.arrayOfChildren.length;
        var currentActive = this.arrayOfChildren[indexOfActiveElement];
        var prevActive = this.arrayOfChildren[indexOfActiveElement - 1];
        if (prevActive !== undefined) {
            currentActive.active = !currentActive.active;
            prevActive.active = !prevActive.active;
        }
        else {
            currentActive.active = !currentActive.active;
            this.arrayOfChildren[this.arrayOfChildren.length - 1].active = true;
        }
    };
    return Slider;
}());
function $(selector, container) {
    return (container ? document.querySelector(container) : document).querySelector(selector);
}
function $$(selector, container) {
    return (container ? document.querySelectorAll(container) : document).querySelectorAll(selector);
}
