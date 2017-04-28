"use strict";
var Slider = (function () {
    function Slider(element, settings) {
        this.elementName = element;
        this.elementHTML = $(element);
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
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
        console.log(childrenOfDiv);
    };
    Slider.prototype.settings = function (settings) {
        if (settings.hasOwnProperty('buttons')) {
            console.log(settings);
        }
        else {
            console.log('nemá');
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
