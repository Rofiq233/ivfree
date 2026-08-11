(function () {

  'use strict';


  /* =========================================================
     LOAD SWIPER
  ========================================================= */

  function loadSwiper(callback) {

    if (typeof Swiper !== 'undefined') {
      callback();
      return;
    }


    /* Load Swiper CSS */

    if (!document.querySelector('#vitamin-swiper-css')) {

      const css = document.createElement('link');

      css.id = 'vitamin-swiper-css';

      css.rel = 'stylesheet';

      css.href =
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';

      document.head.appendChild(css);
    }


    /* Load Swiper JS */

    const existingScript =
      document.querySelector('#vitamin-swiper-js');


    if (existingScript) {

      existingScript.addEventListener(
        'load',
        callback,
        { once: true }
      );

      return;
    }


    const script = document.createElement('script');

    script.id = 'vitamin-swiper-js';

    script.src =
      'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';

    script.onload = callback;

    document.head.appendChild(script);

  }



  /* =========================================================
     INIT
  ========================================================= */

  function initVitaminTimeline(section) {

    if (!section) return;


    /* Prevent duplicate initialization */

    if (section.dataset.initialized === 'true') {
      return;
    }


    section.dataset.initialized = 'true';


    const slider =
      section.querySelector('.vitamin-timeline__slider');


    const tabs =
      section.querySelectorAll(
        '.vitamin-timeline__item'
      );


    const paginationDots =
      section.querySelectorAll(
        '.vitamin-timeline__pagination-dot'
      );


    const mobileContents =
      section.querySelectorAll(
        '.vitamin-timeline__mobile-content-item'
      );


    if (!slider || !tabs.length) {
      return;
    }


    /* =======================================================
       SWIPER
    ======================================================== */

    const swiper = new Swiper(slider, {

      slidesPerView: 1,

      spaceBetween: 0,

      speed: 500,

      grabCursor: true,

      allowTouchMove: true,

      observer: true,

      observeParents: true,

      watchOverflow: true,


      on: {

        init: function () {

          updateActiveState(
            this.activeIndex
          );

        },


        slideChange: function () {

          updateActiveState(
            this.activeIndex
          );

        }

      }

    });



    /* =======================================================
       UPDATE ACTIVE STATE
    ======================================================== */

    function updateActiveState(index) {


      /* ---------------------------------------------
         LEFT TABS
      ---------------------------------------------- */

      tabs.forEach(function (tab, tabIndex) {

        if (tabIndex === index) {

          tab.classList.add('is-active');

        } else {

          tab.classList.remove('is-active');

        }

      });



      /* ---------------------------------------------
         PAGINATION
      ---------------------------------------------- */

      paginationDots.forEach(
        function (dot, dotIndex) {

          if (dotIndex === index) {

            dot.classList.add('is-active');

          } else {

            dot.classList.remove('is-active');

          }

        }
      );



      /* ---------------------------------------------
         MOBILE CONTENT
      ---------------------------------------------- */

      mobileContents.forEach(
        function (content, contentIndex) {

          if (contentIndex === index) {

            content.classList.add('is-active');

          } else {

            content.classList.remove('is-active');

          }

        }
      );



      /* ---------------------------------------------
         MOBILE TAB AUTO SCROLL
      ---------------------------------------------- */

      if (
        window.innerWidth <= 749 &&
        tabs[index]
      ) {

        const activeTab = tabs[index];


        const parent =
          activeTab.parentElement;


        const parentRect =
          parent.getBoundingClientRect();


        const tabRect =
          activeTab.getBoundingClientRect();


        const tabCenter =
          tabRect.left +
          (tabRect.width / 2);


        const parentCenter =
          parentRect.left +
          (parentRect.width / 2);


        const scrollAmount =
          tabCenter -
          parentCenter;


        parent.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });

      }

    }



    /* =======================================================
       TAB CLICK
    ======================================================== */

    tabs.forEach(function (tab) {

      tab.addEventListener(
        'click',
        function () {

          const index =
            parseInt(
              this.dataset.index,
              10
            );


          if (
            Number.isNaN(index)
          ) {
            return;
          }


          swiper.slideTo(
            index
          );

        }
      );

    });



    /* =======================================================
       PAGINATION CLICK
    ======================================================== */

    paginationDots.forEach(
      function (dot) {

        dot.addEventListener(
          'click',
          function () {

            const index =
              parseInt(
                this.dataset.paginationIndex,
                10
              );


            if (
              Number.isNaN(index)
            ) {
              return;
            }


            swiper.slideTo(index);

          }
        );

      }
    );



    /* =======================================================
       RESIZE
    ======================================================== */

    let resizeTimer;


    window.addEventListener(
      'resize',
      function () {

        clearTimeout(resizeTimer);


        resizeTimer =
          setTimeout(
            function () {

              swiper.update();

            },
            150
          );

      }
    );

  }



  /* =========================================================
     INIT ALL SECTIONS
  ========================================================= */

  function initAllVitaminTimelines() {

    const sections =
      document.querySelectorAll(
        '.vitamin-timeline-section'
      );


    if (!sections.length) {
      return;
    }


    loadSwiper(function () {

      sections.forEach(
        function (section) {

          initVitaminTimeline(section);

        }
      );

    });

  }



  /* =========================================================
     DOM READY
  ========================================================= */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initAllVitaminTimelines
    );

  } else {

    initAllVitaminTimelines();

  }



  /* =========================================================
     SHOPIFY THEME EDITOR
  ========================================================= */

  document.addEventListener(
    'shopify:section:load',
    function (event) {

      const section =
        event.target.querySelector(
          '.vitamin-timeline-section'
        );


      if (!section) {
        return;
      }


      section.dataset.initialized =
        'false';


      loadSwiper(function () {

        initVitaminTimeline(
          section
        );

      });

    }
  );


})();