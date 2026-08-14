
// GSAP start here

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const textElements = document.querySelectorAll(".banner__box-left h6");

  textElements.forEach((element) => {
    const text = element.textContent;
    
    element.innerHTML = [...text]
      .map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`)
      .join("");

    const letters = element.querySelectorAll("span");

    gsap.set(letters, {
      opacity: 0,
      y: 20
    });

    const showLetters = () => {
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    };

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: showLetters,
      onEnterBack: showLetters
    });
  });


document.querySelectorAll(".counter-number").forEach((counter) => {
  const target = Number(counter.dataset.number);

  const animation = gsap.fromTo(
    counter,
    { innerText: 0 },
    {
      innerText: target,
      duration: 1.5,
      ease: "none",
      snap: {
        innerText: 1
      },
      paused: true
    }
  );

  ScrollTrigger.create({
    trigger: ".counter-section",
    start: "top 80%",
    onEnter: () => {
      animation.restart();
    },
    onEnterBack: () => {
      animation.restart();
    }
  });
});


});

// GSAP end here



// video js start here 


if (!customElements.get('custom-video-media')) {
  customElements.define(
    'custom-video-media',
    class DeferredMedia extends HTMLElement {
      constructor() {
        super();

        this.$ = this.querySelector.bind(this);
        this.sectionID = this.dataset.sectionId;
        this.idVideo = this.dataset.idVideo;
        this.typeVideo = this.dataset.type;
        this.eleVideo = `DeferredVideo-${this.sectionID}-` + this.idVideo;

        this.trigger = this.$('.js-load-media-trigger');
        this.playPauseButton = this.$('.video-play-pause-button');


        this.onPlayerStateYTChange = this.onPlayerStateYTChange.bind(this);
        this.onPlayerPlay = this.onPlayerPlay.bind(this);

        this.trigger?.addEventListener('click', () => this.handleToggle());


      }

      connectedCallback() {
        if (Shopify && Shopify.designMode && this.getAttribute('data-autoplay') === 'true') {
          this.loadContent();
        } else if (this.getAttribute('data-autoplay') === 'true') {
          this.loadContent();
        }
      }

      /* ===============================
         TOGGLE
      =============================== */
      handleToggle() {
        this.classList.add('playing');
        this.loadContent();

        const video = this.$('.js-media-item-video') || this.$('.js-media-item-video-mobile');

        if (video) {
          if (video.paused || video.ended) {
            this.pauseAllVideo(video);
            video.play();
            this.setButtonState(true);
          } else {
            video.pause();
            this.setButtonState(false);
          }
        }

        if (this.player && typeof this.player.getPlayerState === 'function') {
          const state = this.player.getPlayerState();

          if (
            state === YT.PlayerState.PAUSED ||
            state === YT.PlayerState.ENDED
          ) {
            this.pauseAllVideo(this.player);
            this.player.playVideo();
            this.setButtonState(true);
          } else if (state === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
            this.setButtonState(false);
          }
        }
      }

      /* ===============================
         BUTTON STATE
      =============================== */
      setButtonState(isPlaying) {
        if (!this.playPauseButton) return;
        this.playPauseButton.dataset.playing = isPlaying ? 'true' : 'false';
      }

      /* ===============================
         YOUTUBE
      =============================== */
      onYouTubeIframeAPIReady() {
        if (typeof YT !== 'undefined' && YT.Player) {
          this.player = new YT.Player(this.eleVideo, {
            videoId: this.idVideo,
            playerVars: { playsinline: 1 },
            events: {
              onReady: this.onPlayerYTReady,
              onStateChange: this.onPlayerStateYTChange,
            },
          });
        } else {
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          script.onload = () => this.onYouTubeIframeAPIReady();
          document.head.appendChild(script);
        }
      }

      onPlayerYTReady = () => {
        this.pauseAllVideo(this.player);
        this.player.playVideo();
      };

      onPlayerStateYTChange(t) {
        if (t.data === YT.PlayerState.PLAYING) {
          this.onPlayerPlay();
          this.setButtonState(true);
        } else if (
          t.data === YT.PlayerState.PAUSED ||
          t.data === YT.PlayerState.ENDED
        ) {
          this.setButtonState(false);
        }
      }

      onPlayerPlay() {
        this.pauseAllVideo(this.player);
      }

      /* ===============================
         VIMEO
      =============================== */
      onVimeoIframeAPIReady() {
        if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
          this.playerVimeo = new Vimeo.Player(this.eleVideo, {
            id: this.idVideo,
            autoplay: 1,
          });

          this.playerVimeo.on('play', () =>
            this.pauseAllVideo(this.playerVimeo)
          );
        } else {
          const script = document.createElement('script');
          script.src = 'https://player.vimeo.com/api/player.js';
          script.onload = () => this.onVimeoIframeAPIReady();
          document.head.appendChild(script);
        }
      }

      /* ===============================
         LOAD CONTENT
      =============================== */

      loadContent() {
        if (this.hasAttribute('loaded')) return;

        // 🔹 YOUTUBE / VIMEO → hide trigger only
        if (this.typeVideo === 'youtube' || this.typeVideo === 'vimeo') {
          this.trigger?.classList.add('d-none');
        }

        // 🔹 Load template if exists
        if (this.$('template')) {
          const node = this.$('template').content.firstElementChild.cloneNode(true);
          this.appendChild(node);

        } else {
          if (this.typeVideo === 'youtube') {
            this.onYouTubeIframeAPIReady();
            this.buttonWrapper?.classList.add('display-none');
          }

          if (this.typeVideo === 'vimeo') {
            this.onVimeoIframeAPIReady();
          }
        }


        // 🔹 Handle autoplay (lazy-load logic)
        if (this.getAttribute('data-autoplay') === 'true') {


          // HTML5 video
          const localVideo = this.$('video');


          if (localVideo) {
            const source = localVideo.querySelector('source');
            const src = source?.getAttribute('data-src');
            if (src) {
              source.setAttribute('src', src);
              localVideo.load();
              localVideo.muted = true
              localVideo.play().catch((err) => {
                console.warn("Autoplay failed:", err);
              });
            }
            else {
              console.warn("Missing data-src on local video source.");
            }
          }

          // iframe video (YouTube/Vimeo)
          const iframe = this.$('iframe');
          if (iframe) {
            const src = iframe.getAttribute('data-src');
            if (src) {
              iframe.setAttribute('src', src);

              iframe.addEventListener(
                'load',
                () => {
                  if (this.typeVideo === 'youtube') {
                    iframe.contentWindow.postMessage(
                      '{"event":"command","func":"playVideo","args":""}',
                      '*'
                    );
                  }

                  if (this.typeVideo === 'vimeo') {
                    iframe.contentWindow.postMessage('{"method":"play"}', '*');
                  }
                },
                { once: true }
              );
            }
          }
        }

        this.isLoaded(true);

        // 🔹 Trigger listeners remain
        const video = this.$('.js-media-item-video');
        if (video && !video.dataset.listenersAdded) {
          video.addEventListener('play', () => this.setButtonState(true));
          video.addEventListener('pause', () => this.setButtonState(false));
          video.addEventListener('ended', () => this.setButtonState(false));
          video.dataset.listenersAdded = 'true';
        }
      }

      /* ===============================
         PAUSE ALL
      =============================== */
      pauseAllVideo(current) {
        document
          .querySelectorAll(
            ".js-product-media-deferred-video:has([data-type='youtube'])"
          )
          .forEach((el) => {
            el.player && el.player !== current && el.player.pauseVideo();
          });

        document
          .querySelectorAll(
            ".js-product-media-deferred-video:has([data-type='vimeo'])"
          )
          .forEach((el) => {
            el.playerVimeo &&
              el.playerVimeo !== current &&
              el.playerVimeo.pause();
          });

        document
          .querySelectorAll('.js-media-item-video')
          .forEach((v) => v !== current && v.pause());
      }

      isLoaded(val) {
        val ? this.setAttribute('loaded', '') : this.removeAttribute('loaded');
      }
    }
  );
}


// video js end here 



// video slider js start here 


if (!customElements.get('slideshow-swiper')) {
  customElements.define('slideshow-swiper', class slideshowSwiper extends HTMLElement {

    constructor() {
      super();
      this.slider = null;
      this.boundResize = debounce(() => {
        if (!this.sliderWrapper) return;
        if (
          this.optionsData?.desktopSlider === false &&
          window.innerWidth >= 768
        ) {
          if (this.slider) {
            this.slider.destroy(true, true);
            this.slider = null;
          }
          return;
        }

        if (!this.slider) {
          this.initSlider();
        } else {
          this.slider.update();
        }

      }, 200);
    }

    connectedCallback() {

      this.sliderWrapper = this.querySelector(".slideshow__swiper");

      if (!this.sliderWrapper) return;

      this.optionsData = this.sliderWrapper.dataset.option
        ? JSON.parse(this.sliderWrapper.dataset.option)
        : {};

      this.initSlider();

      window.addEventListener('resize', this.boundResize, {
        passive: true,
      });
    }

    initSlider() {

      if (this.slider?.destroyed === false) return;

      if (
        this.optionsData?.desktopSlider === false &&
        window.innerWidth >= 768
      ) {
        return;
      }

      const next = this.querySelector(".arrow-next-button");
      const prev = this.querySelector(".arrow-prev-button");
      const pagination = this.querySelector(".swiper-pagination");
      const scrollbar = this.querySelector(".swiper-scrollbar");

      this.slider = new Swiper(this.sliderWrapper, {
        effect: "slide",
        slidesPerView: 1,
        centeredSlides: false,
        grabCursor: false,
        watchSlidesProgress: false,
        autoHeight: false,
        observer: false,
        observeParents: false,
        resizeObserver: false,
        updateOnWindowResize: false,
        loop: false,
        preloadImages: false,
        passiveListeners: true,
        speed: 400,
        

        scrollbar: {
          el: scrollbar,
          draggable: true,
        },
         navigation: {
          nextEl: next,
          prevEl: prev,
        },

        ...this.optionsData,

        on: {

          init: (swiper) => {
            swiper.el.classList.add('swiper-first-load');
            requestAnimationFrame(() => {
              swiper.el.classList.remove('swiper-first-load');
            });

          },

          slideChangeTransitionStart: () => {
            this.handleSlideChange();
          }

        }

      });

    }

    handleSlideChange() {

      this.querySelectorAll('video').forEach((video) => {
        video.pause();
      });

      this.querySelectorAll('.video-play-pause-button').forEach((btn) => {
        btn.dataset.playing = 'false';
      });

    }

    disconnectedCallback() {

      window.removeEventListener('resize', this.boundResize);

      if (this.slider) {
        this.slider.destroy(true, true);
        this.slider = null;
      }

    }

  });

}
// video slider js end here 




// product page marquee js 


document.addEventListener('DOMContentLoaded', () => {

  const marquees = document.querySelectorAll('.product-info-marquee');

  marquees.forEach((marquee) => {

    const items = [...marquee.querySelectorAll('.product-marquee')];

    if (!items.length) return;

    let position = 0;
    let lastTime = performance.now();

    const speed = 60; // px per second
    let paused = false;

    marquee.addEventListener('mouseenter', () => {
      paused = true;
    });

    marquee.addEventListener('mouseleave', () => {
      paused = false;
    });


    function animate(currentTime) {

      const delta = (currentTime - lastTime) / 1000;

      lastTime = currentTime;

      if (!paused) {

        position -= speed * delta;

        items.forEach((item) => {

          const width = item.offsetWidth;
          const gap = 30;
          const totalWidth = width + gap;

          item.style.transform =
            `translateX(${position}px)`;

        });


        /*
         * When first item completely leaves
         * the viewport, move it to the end.
         */

        const firstItem = items[0];

        if (
          firstItem.getBoundingClientRect().right < 
          marquee.getBoundingClientRect().left
        ) {

          const width =
            firstItem.offsetWidth + 30;

          position += width;

          marquee.appendChild(firstItem);

          items.push(items.shift());
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

  });

});


document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');

  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));

  if (!target) return;

  e.preventDefault();

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});


// var thumbsSwiper = new Swiper(".mySwiper", {
//   loop: true,
//   spaceBetween: 10,
//   slidesPerView: 4,
//   freeMode: true,
//   watchSlidesProgress: true,
//  navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },
//   breakpoints: {
//     0: {
//       slidesPerView: 3,
//     },
//     768: {
//       slidesPerView: 4,
//     },
//     1024: {
//       slidesPerView: 4,
//     },
//   },
// });


// window.productSwiper = new Swiper('.product__swiper', {
//   loop: true,
//   spaceBetween: 8,

//   thumbs: {
//     swiper: thumbsSwiper,
//   },
  
// });

const thumbsSwiper = new Swiper(".mySwiper", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,

  breakpoints: {
    0: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});


window.productSwiper = new Swiper(".product__swiper", {
  loop: true,
  spaceBetween: 8,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  thumbs: {
    swiper: thumbsSwiper,
  },
});