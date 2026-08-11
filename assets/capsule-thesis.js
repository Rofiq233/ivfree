document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded.");
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    console.warn("ScrollTrigger is not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const sections = document.querySelectorAll(".capsule-thesis");

  sections.forEach((section) => {
    const capsule = section.querySelector(".capsule-animation");

    if (!capsule) return;

    const pieces = [
      capsule.querySelector(".capsule-piece--top"),
      capsule.querySelector(".capsule-piece--middle-one"),
      capsule.querySelector(".capsule-piece--middle-two"),
      capsule.querySelector(".capsule-piece--bottom")
    ].filter(Boolean);

    if (!pieces.length) return;


    /* =====================================================
       GET SETTINGS
    ===================================================== */

    const getNumber = (name, fallback = 0) => {
      const value = Number(capsule.dataset[name]);

      return Number.isFinite(value) ? value : fallback;
    };


    /* =====================================================
       CALCULATE AUTOMATIC ASSEMBLED POSITION
    ===================================================== */

const setupCapsule = () => {

  let currentTop = 0;

  pieces.forEach((piece) => {

    gsap.set(piece, {
      top: currentTop,
      xPercent: -50,
      y: 0,
      rotation: 0
    });

    const height = piece.getBoundingClientRect().height;

    currentTop += height;

    const overlap = 60;

    currentTop -= overlap;

  });

  capsule.style.height = `${currentTop}px`;

  // Fit capsule inside viewport
  const maxHeight = window.innerHeight * 0.78;

  const scale = Math.min(
    1,
    maxHeight / currentTop
  );

  gsap.set(capsule, {
    scale: scale
  });
};


    /* =====================================================
       WAIT FOR IMAGES
    ===================================================== */

    const images = capsule.querySelectorAll("img");

    const waitForImages = () => {
      const promises = [...images].map((img) => {

        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {

          img.addEventListener(
            "load",
            resolve,
            { once: true }
          );

          img.addEventListener(
            "error",
            resolve,
            { once: true }
          );

        });
      });

      return Promise.all(promises);
    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    waitForImages().then(() => {

      setupCapsule();


      /* ===================================================
         GSAP TIMELINE
      =================================================== */

      const timeline = gsap.timeline({

        defaults: {
          ease: "none"
        },

        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: "bottom bottom",

          scrub: 1,

          invalidateOnRefresh: true
        }

      });


      /* ===================================================
         TOP
      =================================================== */

      const top = capsule.querySelector(
        ".capsule-piece--top"
      );

      if (top) {

        timeline.to(
          top,
          {
            x: getNumber("topX"),
            y: getNumber("topY"),
            rotation: getNumber("topRotation")
          },
          0
        );

      }


      /* ===================================================
         MIDDLE ONE
      =================================================== */

      const middleOne = capsule.querySelector(
        ".capsule-piece--middle-one"
      );

      if (middleOne) {

        timeline.to(
          middleOne,
          {
            x: getNumber("middleOneX"),
            y: getNumber("middleOneY"),
            rotation: getNumber("middleOneRotation")
          },
          0
        );

      }


      /* ===================================================
         MIDDLE TWO
      =================================================== */

      const middleTwo = capsule.querySelector(
        ".capsule-piece--middle-two"
      );

      if (middleTwo) {

        timeline.to(
          middleTwo,
          {
            x: getNumber("middleTwoX"),
            y: getNumber("middleTwoY"),
            rotation: getNumber("middleTwoRotation")
          },
          0
        );

      }


      /* ===================================================
         BOTTOM
      =================================================== */

      const bottom = capsule.querySelector(
        ".capsule-piece--bottom"
      );

      if (bottom) {

        timeline.to(
          bottom,
          {
            x: getNumber("bottomX"),
            y: getNumber("bottomY"),
            rotation: getNumber("bottomRotation")
          },
          0
        );

      }


      /* ===================================================
         REFRESH
      =================================================== */

      ScrollTrigger.refresh();


      /* ===================================================
         RESIZE
      =================================================== */

      let resizeTimer;

      window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

          /*
            Recalculate SVG positions because
            SVG dimensions can change on resize.
          */

          setupCapsule();

          ScrollTrigger.refresh();

        }, 150);

      });

    });

  });

});


// document.addEventListener("DOMContentLoaded", () => {

//   if (typeof gsap === "undefined") {
//     console.warn("GSAP is not loaded.");
//     return;
//   }

//   if (typeof ScrollTrigger === "undefined") {
//     console.warn("ScrollTrigger is not loaded.");
//     return;
//   }

//   gsap.registerPlugin(ScrollTrigger);


//   const sections = document.querySelectorAll(
//     ".capsule-thesis"
//   );


//   sections.forEach((section) => {

//     const capsule =
//       section.querySelector(".capsule-animation");


//     if (!capsule) return;


//     const pieces = [
//       capsule.querySelector(".capsule-piece--top"),
//       capsule.querySelector(".capsule-piece--middle-one"),
//       capsule.querySelector(".capsule-piece--middle-two"),
//       capsule.querySelector(".capsule-piece--bottom")
//     ].filter(Boolean);


//     if (!pieces.length) return;


//     /* =====================================================
//        GET SETTINGS
//     ===================================================== */

//     const getNumber = (name, fallback = 0) => {

//       const value = Number(
//         capsule.dataset[name]
//       );

//       return Number.isFinite(value)
//         ? value
//         : fallback;
//     };


//     /* =====================================================
//        CALCULATE ASSEMBLED POSITIONS
//     ===================================================== */

//     const setupCapsule = () => {

//       let currentTop = 0;


//       pieces.forEach((piece, index) => {

//         /*
//           Put every piece in normal assembled position.
//         */

//         gsap.set(piece, {
//           top: currentTop,
//           xPercent: -50,
//           y: 0,
//           rotation: 0
//         });


//         /*
//           Get actual rendered height.
//         */

//         const height =
//           piece.getBoundingClientRect().height;


//         /*
//           Next piece starts after this piece.
//         */

//         currentTop += height;


//         /*
//           Small overlap.

//           This prevents tiny gaps caused by
//           SVG rounding / browser rendering.
//         */

//         const overlap = 1;

//         currentTop -= overlap;

//       });


//       /*
//         Set capsule's total calculated height.
//       */

//       capsule.style.height =
//         `${currentTop}px`;
//     };


//     /* =====================================================
//        WAIT FOR ALL IMAGES
//     ===================================================== */

//     const images =
//       capsule.querySelectorAll("img");


//     const waitForImages = () => {

//       const promises = [...images].map((img) => {

//         if (img.complete) {
//           return Promise.resolve();
//         }

//         return new Promise((resolve) => {

//           img.addEventListener(
//             "load",
//             resolve,
//             { once: true }
//           );

//           img.addEventListener(
//             "error",
//             resolve,
//             { once: true }
//           );

//         });

//       });


//       return Promise.all(promises);
//     };


//     /* =====================================================
//        INITIALIZE
//     ===================================================== */

//     waitForImages().then(() => {

//       setupCapsule();


//       /* ===================================================
//          GSAP TIMELINE
//       =================================================== */

//       const timeline = gsap.timeline({

//         defaults: {
//           ease: "none"
//         },

//         scrollTrigger: {

//           trigger: section,

//           start: "top top",

//           end: "bottom bottom",

//           scrub: 1,

//           invalidateOnRefresh: true

//         }

//       });


//       /* ===================================================
//          TOP
//       =================================================== */

//       const top =
//         capsule.querySelector(
//           ".capsule-piece--top"
//         );


//       if (top) {

//         timeline.to(
//           top,
//           {
//             y: getNumber("topY"),
//             rotation: getNumber(
//               "topRotation"
//             )
//           },
//           0
//         );

//       }


//       /* ===================================================
//          MIDDLE ONE
//       =================================================== */

//       const middleOne =
//         capsule.querySelector(
//           ".capsule-piece--middle-one"
//         );


//       if (middleOne) {

//         timeline.to(
//           middleOne,
//           {
//             y: getNumber(
//               "middleOneY"
//             ),

//             rotation: getNumber(
//               "middleOneRotation"
//             )
//           },
//           0
//         );

//       }


//       /* ===================================================
//          MIDDLE TWO
//       =================================================== */

//       const middleTwo =
//         capsule.querySelector(
//           ".capsule-piece--middle-two"
//         );


//       if (middleTwo) {

//         timeline.to(
//           middleTwo,
//           {
//             y: getNumber(
//               "middleTwoY"
//             ),

//             rotation: getNumber(
//               "middleTwoRotation"
//             )
//           },
//           0
//         );

//       }


//       /* ===================================================
//          BOTTOM
//       =================================================== */

//       const bottom =
//         capsule.querySelector(
//           ".capsule-piece--bottom"
//         );


//       if (bottom) {

//         timeline.to(
//           bottom,
//           {
//             y: getNumber(
//               "bottomY"
//             ),

//             rotation: getNumber(
//               "bottomRotation"
//             )
//           },
//           0
//         );

//       }


//       /* ===================================================
//          REFRESH
//       =================================================== */

//       ScrollTrigger.refresh();

//     });


//     /* =====================================================
//        RESIZE
//     ===================================================== */

//     let resizeTimer;


//     window.addEventListener("resize", () => {

//       clearTimeout(resizeTimer);


//       resizeTimer = setTimeout(() => {

//         setupCapsule();

//         ScrollTrigger.refresh();

//       }, 150);

//     });

//   });

// });