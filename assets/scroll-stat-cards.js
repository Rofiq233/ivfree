(() => {

  'use strict';


  /* =========================================================
     NUMBER DECIMAL DETECTION
  ========================================================= */

  function getDecimalPlaces(value) {

    const stringValue = String(value);

    if (!stringValue.includes('.')) {
      return 0;
    }

    return stringValue.split('.')[1].length;

  }



  /* =========================================================
     COUNTER
  ========================================================= */

  class StatCounter {

    constructor(element) {

      this.element = element;

      this.target = Number(
        element.dataset.target || 0
      );

      this.prefix =
        element.dataset.prefix || '';

      this.suffix =
        element.dataset.suffix || '';

      this.decimals =
        getDecimalPlaces(
          element.dataset.target || 0
        );

      this.duration = 1400;

      this.started = false;

      this.startTime = null;

    }


    format(value) {

      return value.toFixed(
        this.decimals
      );

    }


    render(value) {

      this.element.textContent =
        `${this.prefix}${this.format(value)}${this.suffix}`;

    }


    animate(timestamp) {

      if (!this.startTime) {

        this.startTime = timestamp;

      }


      const elapsed =
        timestamp - this.startTime;


      const progress =
        Math.min(
          elapsed / this.duration,
          1
        );


      /*
       * Ease out
       */

      const eased =
        1 - Math.pow(
          1 - progress,
          4
        );


      const currentValue =
        this.target * eased;


      this.render(
        currentValue
      );


      if (progress < 1) {

        requestAnimationFrame(
          this.animate.bind(this)
        );

      } else {

        /*
         * Make sure final value
         * is always exact.
         */

        this.render(
          this.target
        );

      }

    }


    start() {

      if (this.started) {
        return;
      }


      this.started = true;

      this.startTime = null;


      requestAnimationFrame(
        this.animate.bind(this)
      );

    }

  }



  /* =========================================================
     INIT SECTION
  ========================================================= */

  function initSection(section) {

    if (!section) {
      return;
    }


    /*
     * Prevent duplicate initialization
     */

    if (
      section.dataset.counterInitialized === 'true'
    ) {

      return;

    }


    section.dataset.counterInitialized =
      'true';


    const counters =
      section.querySelectorAll(
        '[data-counter]'
      );


    if (!counters.length) {
      return;
    }


    const counterInstances =
      new Map();


    counters.forEach(
      (element) => {

        counterInstances.set(
          element,
          new StatCounter(element)
        );

      }
    );



    /* =======================================================
       INTERSECTION OBSERVER
    ======================================================== */

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting &&
                entry.intersectionRatio >= 0.25
              ) {

                const counter =
                  counterInstances.get(
                    entry.target
                  );


                if (counter) {

                  counter.start();

                }


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },

        {
          threshold: 0.25
        }

      );



    counters.forEach(
      (counter) => {

        observer.observe(
          counter
        );

      }
    );


    /*
     * Save observer for Shopify
     * theme editor cleanup
     */

    section.__statCounterObserver =
      observer;

  }



  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  function init() {

    const sections =
      document.querySelectorAll(
        '[data-scroll-stat-section]'
      );


    sections.forEach(
      (section) => {

        initSection(
          section
        );

      }
    );

  }



  /* =========================================================
     DOM READY
  ========================================================= */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }



  /* =========================================================
     SHOPIFY THEME EDITOR
  ========================================================= */

  document.addEventListener(
    'shopify:section:load',
    (event) => {

      const section =
        event.target.querySelector(
          '[data-scroll-stat-section]'
        );


      if (section) {

        initSection(
          section
        );

      }

    }
  );



  /* =========================================================
     SHOPIFY SECTION UNLOAD
  ========================================================= */

  document.addEventListener(
    'shopify:section:unload',
    (event) => {

      const section =
        event.target.querySelector(
          '[data-scroll-stat-section]'
        );


      if (
        section &&
        section.__statCounterObserver
      ) {

        section.__statCounterObserver.disconnect();

      }

    }
  );


})();