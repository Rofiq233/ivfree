document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(
    "[data-ingredients-toggle]"
  );

  buttons.forEach((button) => {
    const section = button.closest(
      ".traceable-ingredients"
    );

    if (!section) return;

    const cards = [
      ...section.querySelectorAll(
        "[data-ingredient-card]"
      )
    ];

    const toggleText = button.querySelector(
      "[data-toggle-text]"
    );

    const initialItems = Number(
      section.dataset.initialItems || 6
    );

    let expanded = false;

    /* =========================================
       INITIAL STATE
    ========================================= */

    cards.forEach((card, index) => {
      if (index >= initialItems) {
        card.classList.add(
          "traceable-ingredient-card--hidden"
        );
      }
    });

    /* Initial button text */
    if (toggleText) {
      toggleText.textContent =
        cards.length > initialItems
          ? `See All ${cards.length}`
          : "";
    }

    /* Hide button if there are no extra items */
    if (cards.length <= initialItems) {
      button.style.display = "none";
    }

    /* =========================================
       TOGGLE
    ========================================= */

    button.addEventListener("click", () => {
      expanded = !expanded;

      cards.forEach((card, index) => {
        if (index < initialItems) return;

        if (expanded) {
          card.classList.remove(
            "traceable-ingredient-card--hidden"
          );
        } else {
          card.classList.add(
            "traceable-ingredient-card--hidden"
          );
        }
      });

      button.setAttribute(
        "aria-expanded",
        expanded ? "true" : "false"
      );

      if (toggleText) {
        toggleText.textContent = expanded
          ? "Show Less"
          : `See All ${cards.length}`;
      }
    });
  });
});