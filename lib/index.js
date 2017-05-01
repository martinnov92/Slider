"use strict";
var Slider = (function () {
    function Slider(element, settings) {
        var _this = this;
        var elementHTML = this.elementHTML = $(element);
        this.elementName = element;
        this.store = [];
        var resizeTimer;
        var fragment = document.createDocumentFragment();
        var innerDiv = this.innerDiv = document.createElement('div');
        innerDiv.classList.add('m-slider__inner');
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
        elementHTML.appendChild(innerDiv);
        this.getElements(true);
        this.init();
        this.defaultSettings = {
            defaultButtons: true,
            dots: false,
            floatingDots: true,
            customButtons: undefined
        };
        this.settings = Object.assign({}, settings);
        this.setSlider();
        window.addEventListener('resize', function () {
            _this.elementHTML.classList.add('m-slider-resizing');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                _this.elementHTML.classList.remove('m-slider-resizing');
            }, 250);
            _this.sliderDimension();
        });
    }
    Slider.prototype.init = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var totalWidth = this.dimensionOfParent.width * this.store.length;
        this.innerDiv.style.width = totalWidth + 'px';
        this.innerDiv.style.height = this.dimensionOfParent.height + 'px';
        this.elementHTML.classList.add('m-slider__wrapper', 'm-slider__init');
        this.store.forEach(function (child) {
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
    Slider.prototype.getElements = function (init) {
        var _this = this;
        var nodeList = [];
        if (init) {
            nodeList = $$(this.elementName + ' > *:not(.m-slider__inner)');
        }
        else {
            nodeList = $$(this.elementName + ' > div > div[class="m-slider__slide"]');
        }
        var childrenOfDiv = Array.prototype.slice.apply(nodeList);
        if (init) {
            childrenOfDiv.forEach(function (child, i) {
                _this.store.push({
                    element: child,
                    active: i === 0 ? true : false
                });
            });
        }
        else {
            childrenOfDiv.forEach(function (child, i) {
                _this.store[i].element = child;
            });
        }
    };
    Slider.prototype.setSlider = function () {
        var fragment = document.createDocumentFragment();
        if (this.settings.customButtons !== undefined && this.settings.defaultButtons === false) {
            if (this.settings.customButtons.hasOwnProperty('prev')
                && this.settings.customButtons.hasOwnProperty('next')) {
                var buttons = this.customButtons();
                fragment.appendChild(buttons);
            }
        }
        else if (this.settings.defaultButtons || this.defaultSettings.defaultButtons) {
            var buttons = this.initButtons();
            fragment.appendChild(buttons);
        }
        if (this.settings.dots || this.defaultSettings.dots) {
            var dots = this.initDots();
            fragment.appendChild(dots);
        }
        this.elementHTML.appendChild(fragment);
    };
    Slider.prototype.next = function () {
        var indexOfActiveElement = findIndex(this.store, 'active');
        var currentActive = this.store[indexOfActiveElement];
        var nextActive = this.store[indexOfActiveElement + 1];
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
        this.moveSlide(this.store[findIndex(this.store, 'active')].element.offsetLeft);
        this.sliderDimension();
    };
    Slider.prototype.prev = function () {
        var indexOfActiveElement = findIndex(this.store, 'active');
        var currentActive = this.store[indexOfActiveElement];
        var prevActive = this.store[indexOfActiveElement - 1];
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
        this.moveSlide(this.store[findIndex(this.store, 'active')].element.offsetLeft);
        this.sliderDimension();
    };
    Slider.prototype.initButtons = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var nextButton = document.createElement('button');
        var prevButton = document.createElement('button');
        nextButton.setAttribute('type', 'button');
        nextButton.setAttribute('title', 'Next slide');
        prevButton.setAttribute('type', 'button');
        prevButton.setAttribute('title', 'Previous slide');
        nextButton.onclick = function () { return _this.next(); };
        prevButton.onclick = function () { return _this.prev(); };
        nextButton.textContent = '>';
        prevButton.textContent = '<';
        nextButton.classList.add('m-slider__button', 'm-slider__button-next');
        prevButton.classList.add('m-slider__button', 'm-slider__button-prev');
        fragment.appendChild(nextButton);
        fragment.appendChild(prevButton);
        return fragment;
    };
    Slider.prototype.customButtons = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var prevButtonDiv = document.createElement('div');
        var nextButtonDiv = document.createElement('div');
        var prevButton = this.settings.customButtons.prev;
        var nextButton = this.settings.customButtons.next;
        prevButtonDiv.innerHTML = prevButton;
        nextButtonDiv.innerHTML = nextButton;
        prevButtonDiv.classList.add('m-slider__button', 'm-slider__button-prev');
        nextButtonDiv.classList.add('m-slider__button', 'm-slider__button-next');
        prevButtonDiv.addEventListener('click', function () { return _this.prev(); });
        nextButtonDiv.addEventListener('click', function () { return _this.next(); });
        fragment.appendChild(prevButtonDiv);
        fragment.appendChild(nextButtonDiv);
        return fragment;
    };
    Slider.prototype.initDots = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var div = document.createElement('div');
        var ul = document.createElement('ul');
        this.store.forEach(function (div, i) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.classList.add('m-slider__dots-btn');
            btn.onclick = function () { return _this.handleDotClick(i); };
            if (div.active) {
                li.classList.add('m-slider__dots-active');
            }
            li.appendChild(btn);
            div.dots = li;
            ul.appendChild(li);
        });
        div.classList.add('m-slider__dots', 'm-slider__dots-floating');
        if (this.settings.floatingDots === false) {
            div.classList.remove('m-slider__dots-floating');
        }
        div.appendChild(ul);
        fragment.appendChild(div);
        return fragment;
    };
    Slider.prototype.handleDotClick = function (index) {
        var currentActive = findIndex(this.store, 'active');
        this.store[currentActive].active = false;
        this.store[currentActive].element.classList.remove('m-slider__slide-active');
        this.store[currentActive].dots.classList.remove('m-slider__dots-active');
        this.store[index].active = true;
        this.store[index].element.classList.add('m-slider__slide-active');
        this.store[index].dots.classList.add('m-slider__dots-active');
        this.moveSlide(this.store[findIndex(this.store, 'active')].element.offsetLeft);
    };
    Slider.prototype.sliderDimension = function () {
        var _this = this;
        this.dimensionOfParent = this.elementHTML.getBoundingClientRect();
        var totalWidth = this.dimensionOfParent.width * this.store.length;
        this.innerDiv.style.width = totalWidth + 'px';
        this.store.forEach(function (child) {
            child.element.style.width = _this.dimensionOfParent.width + 'px';
        });
        this.moveSlide(this.store[findIndex(this.store, 'active')].element.offsetLeft);
    };
    Slider.prototype.moveSlide = function (offset) {
        this.innerDiv.style.transform = "translate3d(-" + offset + "px, 0, 0)";
        this.innerDiv.style.overflow = 'auto';
    };
    return Slider;
}());
function $(selector, container) {
    return (container ? document.querySelector(container) : document).querySelector(selector);
}
function $$(selector, container) {
    return (container ? document.querySelectorAll(container) : document).querySelectorAll(selector);
}
function findIndex(arr, lookingFor) {
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][lookingFor]) {
            index = i;
        }
    }
    return index;
}
