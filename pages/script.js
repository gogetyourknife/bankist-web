'use strict';

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinkContainer = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const scroll = function (e) {
  /*const s1coords = section1.getBoundingClientRect();
      window.scrollTo({
      left: s1coords.left + window.scrollX,
      top: s1coords.top + window.scrollY,
      behavior: 'smooth',
    }); */
  section1.scrollIntoView({ behavior: 'smooth' });
};

/* navLinkContainer.forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  })
}); */

// Fade nav menu

const handleNavMenuHover = function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  };
};

// Tabbed comp

const toggleTabs = function (e) {
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');
  const opetationsContent = document.querySelector(`.operations__content--${clicked.dataset.tab}`)

  // guard clause
  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  opetationsContent.classList.add('operations__content--active');
};

// Sticky nav old way

/* const initialCords = section1.getBoundingClientRect();

const toggleStickyNavMenu = function () {
  window.scrollY > initialCords.top ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
}; */

// Sticky nav new way

const navHeight = nav.getBoundingClientRect().height;

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const obsCallback = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting ? nav.classList.add('sticky') : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);


// Reveal sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry)
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObsOpt = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, sectionObsOpt);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const imgObjObs = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // replace the src data

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, imgObjObs);

imgTargets.forEach(img => imgObserver.observe(img));

// Slider

let currentSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
};

goToSlide(0);

const nextSlide = function () {
  currentSlide === maxSlide - 1 ? currentSlide = 0 : currentSlide++;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const prevSlide = function () {
  currentSlide === 0 ? currentSlide = maxSlide - 1 : currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

// Slider dots

const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`)
  })
};

createDots();

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

activateDot(0);

// Listeners

navLinkContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

btnScrollTo.addEventListener('click', scroll);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

tabsContainer.addEventListener('click', toggleTabs);
navLinkContainer.addEventListener('mouseover', handleNavMenuHover.bind(0.5));
navLinkContainer.addEventListener('mouseout', handleNavMenuHover.bind(1));
btnSliderRight.addEventListener('click', nextSlide);
btnSliderLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' ? prevSlide() :
    e.key === 'ArrowRight' && nextSlide();
})