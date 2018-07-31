//= arrayfrompolyfill.js
'use strict;'

const base = {

    _createElement(tag, props, ...children)  {
        const element = document.createElement(tag);

        if ( props ) {
            Object.keys(props).forEach(key => element[key] = props[key]);
        }

        if ( children.length > 0 ) {
            children.forEach(child => {
                if (typeof child == 'string') {
                    child = document.createTextNode(child)
                }
                element.appendChild(child)
            })
        }
        return element;
    },

    _homeSliderPopularProducts() {
        const swiper = new Swiper ('[data-widget="home-slider"].popular-products .swiper-container', {
            draggable: false,
			watchOverflow: true,
			loop: true,
            slidesPerView: 2,
            spaceBetween: 0,
            breakpoints: {
                480: {
                    slidesPerView: 1,
                }
            },
            navigation: {
                nextEl: '[data-widget="home-slider"] .swiper-button-next',
                prevEl: '[data-widget="home-slider"] .swiper-button-prev',
            },
        })
    },

    _homeSliderPopularCategories(){

        const parentOfSlider = document.querySelector('#prod_cat_slider');

        const productNavigation = [...document.querySelectorAll('.product-categories_navigation > .item')];

        const createSlide = (image, link) => {

            const img =  this._createElement('img', {className: ''});
            img.setAttribute('src', image);

            const aTag = this._createElement('a', {className: ''}, img);
            aTag.setAttribute('href', link);

            const imgContainer=  this._createElement('div', {className: ''}, aTag);
            imgContainer.setAttribute('data-component', 'image');

            const slide = this._createElement('div', {className: 'swiper-slide'}, imgContainer);

            return slide;
        }

        const swiperNavigationPrev = this._createElement('div', {className: 'swiper-button-prev'});
        const swiperNavigationNext = this._createElement('div', {className: 'swiper-button-next'});

        const swiperNavigation = this._createElement('div', {className: 'swiper-navigation'}, swiperNavigationPrev, swiperNavigationNext)

        const swiperWrapper = this._createElement('div', {className: 'swiper-wrapper'})
        const swiperContainer = this._createElement('div', {className: 'swiper-container'}, swiperWrapper, swiperNavigation)
        const swiperWidget = this._createElement('div', {className: "product-categories"}, swiperContainer);
        swiperWidget.setAttribute('data-widget', "home-slider");

        parentOfSlider.appendChild(swiperWidget);

        const swiperOptions = {
            runCallbacksOnInit: true,
            draggable: true,
            initialSlide: 0,
            loop: false,
            slidesPerView: 4,
            spaceBetween: 30,
            navigation: {
                nextEl: '[data-widget="home-slider"] .swiper-button-next',
                prevEl: '[data-widget="home-slider"] .swiper-button-prev',
            }
        };

        const swiper = new Swiper (swiperContainer, swiperOptions);

        const navigationClickHandler = (e) => {
            productNavigation.forEach(navigationItem => {
                if ( navigationItem === e.target) {
                    navigationItem.classList.add('active');
                    getCurrentSlideList(productNavigation.indexOf(navigationItem))
                } else {
                    navigationItem.classList.remove('active');
                }
            })
        };

        const getCurrentSlideList = (index = 0) => {
            swiper.removeAllSlides();
            product_categories[index].forEach(element => {
                swiper.appendSlide(createSlide(element.img, element.link));
            })
        }

        getCurrentSlideList();

        productNavigation.forEach(navigationItem => {
            navigationItem.addEventListener('click', (e) => { navigationClickHandler(e) })
        })
    },

    _navButtonHandler(){
        const nav = document.querySelector('.navmobile');
        const navBlock = document.querySelector('[data-template="navigation"]');

        nav.addEventListener('click', () => {
            navBlock.classList.toggle('open');
        })
    },

    init() {
        this._navButtonHandler();
        this._homeSliderPopularProducts();
        this._homeSliderPopularCategories();
    }
}

base.init();

//observer: true
