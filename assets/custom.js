
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