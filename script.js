'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ---------------------------------------- FEATURES --------------------------------------------
// ----- Button scrolling -----
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});
// ----- Page navigation -----
const nav = document.querySelector('.nav');

nav.addEventListener('click', function (e) {
  e.preventDefault();
  // Guard clause
  if (!e.target.getAttribute('href')?.includes('section')) return;

  const href = e.target.getAttribute('href');

  const section = document.querySelector(href);

  section.scrollIntoView({ behavior: 'smooth' });
});

// ----- Menu fade animation -----
const navTransform = function (e) {
  // Guard clause
  if (!e.target.classList.contains('nav__link')) return;

  document.querySelectorAll('.nav__link').forEach(link => {
    if (link !== e.target) link.style.opacity = this;
  });
};

nav.addEventListener('mouseover', navTransform.bind(0.5));
nav.addEventListener('mouseout', navTransform.bind(1));

// ----- Tabbed component -----
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  // Guard clause
  if (!e.target.closest('.operations__tab')) return;

  const clicked = e.target.closest('.operations__tab');

  // Active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Active content
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ----- Sticky navigation: Intersection Observer API -----
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const headerCallback = function (entries, Observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(headerCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// ----- Reveal sections -----
const sections = document.querySelectorAll('.section');
sections.forEach(section => section.classList.add('section--hidden'));

const sectionCallback = function (entries, observer) {
  const entry = entries[0];

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.2,
});

sections.forEach(section => sectionsObserver.observe(section));

// ----- Lazy loading images -----
const imgs = document.querySelectorAll('img[data-src]');

const imgCallback = function (entries, observer) {
  const entry = entries[0];

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgsObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgs.forEach(img => imgsObserver.observe(img));

// ----- Slider -----
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// Create dots
slides.forEach(function (_, i) {
  const dot = document.createElement('button');
  dot.classList.add('dots__dot');
  dot.dataset.slide = i;

  dotsContainer.append(dot);
});

// Go Slide Function
const goToSlide = function (currentSlide) {
  slides.forEach(function (slide, i) {
    slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });

  // Active dot
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${currentSlide}"]`)
    .classList.add('dots__dot--active');
};

// Go Previous Slide Function
const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxIndexSlide;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
};

// Go Next Slide Function
const nextSlide = function () {
  if (currentSlide === maxIndexSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
};

let currentSlide = 0;
const maxIndexSlide = slides.length - 1;
goToSlide(0);

// Button Click
btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener('click', nextSlide);

// Key Press
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

// Dot Click
dotsContainer.addEventListener('click', function (e) {
  // Guard clause
  if (!e.target.classList.contains('dots__dot')) return;

  goToSlide(e.target.dataset.slide);
});
