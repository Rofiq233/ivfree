(function () {
  class VideoContentShowcase {
    constructor(section) {
      this.section = section;
      this.video = section.querySelector(
        '.video-content-showcase__video'
      );

      if (!this.video) return;

      this.init();
    }

    init() {
      this.video.muted = true;
      this.video.autoplay = true;
      this.video.loop = true;
      this.video.playsInline = true;

      this.observeVideo();

      /*
       * Try autoplay immediately
       */
      this.playVideo();

      /*
       * Shopify Theme Editor
       */
      document.addEventListener(
        'shopify:section:select',
        (event) => {
          if (
            event.target.contains(this.section)
          ) {
            this.playVideo();
          }
        }
      );
    }

    playVideo() {
      const promise = this.video.play();

      if (promise !== undefined) {
        promise.catch(() => {
          /*
           * Browser may block autoplay.
           * Muted autoplay is normally allowed,
           * but we silently handle failures.
           */
        });
      }
    }

    pauseVideo() {
      if (!this.video.paused) {
        this.video.pause();
      }
    }

    observeVideo() {
      if (!('IntersectionObserver' in window)) {
        return;
      }

      const observer =
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.playVideo();
              } else {
                this.pauseVideo();
              }
            });
          },
          {
            threshold: 0.1
          }
        );

      observer.observe(this.section);

      this.observer = observer;
    }

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }


  function initVideoShowcase() {
    document
      .querySelectorAll('[data-video-showcase]')
      .forEach((section) => {

        if (!section.videoShowcaseInstance) {
          section.videoShowcaseInstance =
            new VideoContentShowcase(section);
        }

      });
  }


  /*
   * Initial page load
   */

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      initVideoShowcase
    );

  } else {

    initVideoShowcase();

  }


  /*
   * Shopify Theme Editor
   */

  document.addEventListener(
    'shopify:section:load',
    (event) => {

      const section =
        event.target.matches(
          '[data-video-showcase]'
        )
          ? event.target
          : event.target.querySelector(
              '[data-video-showcase]'
            );

      if (section) {

        section.videoShowcaseInstance =
          new VideoContentShowcase(section);

      }

    }
  );


  /*
   * Shopify Theme Editor section unload
   */

  document.addEventListener(
    'shopify:section:unload',
    (event) => {

      const section =
        event.target.querySelector(
          '[data-video-showcase]'
        );

      if (
        section &&
        section.videoShowcaseInstance
      ) {

        section.videoShowcaseInstance.destroy();

      }

    }
  );

})();