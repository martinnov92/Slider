"use strict";
var Slider = (function () {
    function Slider(element, settings) {
        this.elementName = element;
        this.elementHTML = $(element);
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
        this.nextClick = 0;
        this.init();
        this.settings(settings);
    }
    Slider.prototype.sliderDimension = function () {
    };
    Slider.prototype.init = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var innerDiv = document.createElement('div');
        innerDiv.classList.add('m-slider__inner');
        var nodeList = $$(this.elementName + ' > *');
        var childrenOfDiv = Array.prototype.slice.apply(nodeList);
        var totalWidth = this.dimensionOfParent.width * childrenOfDiv.length;
        innerDiv.style.width = totalWidth + 'px';
        innerDiv.style.height = this.dimensionOfParent.height + 'px';
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        childrenOfDiv.forEach(function (div) {
            div.classList.add('m-slider__slide');
            div.style.width = _this.dimensionOfParent.width + 'px';
            innerDiv.appendChild(div);
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
            nextButton.onclick = function () { return _this.next(_this.innerDiv); };
            prevButton.onclick = this.prev;
            nextButton.textContent = 'Next';
            prevButton.textContent = 'Prev';
            nextButton.classList.add('m-slider__button', 'm-slider__button-next');
            prevButton.classList.add('m-slider__button', 'm-slider__button-prev');
            fragment.appendChild(nextButton);
            fragment.appendChild(prevButton);
        }
        this.elementHTML.appendChild(fragment);
    };
    Slider.prototype.next = function (element) {
        this.nextClick += 1;
        var totalTranslate = this.dimensionOfParent.width * this.nextClick;
        element.style.transform = "translate3d(-" + totalTranslate + "px, 0, 0)";
    };
    Slider.prototype.prev = function () {
        console.log('prev');
    };
    return Slider;
}());
function $(selector, container) {
    return (container ? document.querySelector(container) : document).querySelector(selector);
}
function $$(selector, container) {
    return (container ? document.querySelectorAll(container) : document).querySelectorAll(selector);
}
