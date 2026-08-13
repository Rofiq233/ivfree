document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(
    ".faq-image-section"
  );

  sections.forEach((section) => {
    const items = section.querySelectorAll(".faq-item");

    items.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!button || !answer) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        /*
         * Close all FAQ items
         */
        items.forEach((otherItem) => {
          const otherButton =
            otherItem.querySelector(".faq-question");

          const otherAnswer =
            otherItem.querySelector(".faq-answer");

          if (!otherButton || !otherAnswer) return;

          otherItem.classList.remove("is-open");

          otherButton.setAttribute(
            "aria-expanded",
            "false"
          );

          otherAnswer.hidden = true;
        });

        /*
         * Open clicked FAQ
         */
        if (!isOpen) {
          item.classList.add("is-open");

          button.setAttribute(
            "aria-expanded",
            "true"
          );

          answer.hidden = false;
        }
      });
    });
  });
});

