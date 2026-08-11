(function () {
  function initContentScienceAccordion(section) {
    if (!section || section.dataset.csaInitialized === 'true') {
      return;
    }

    section.dataset.csaInitialized = 'true';

    const items = section.querySelectorAll(
      '.content-science-accordion__item'
    );

    if (!items.length) return;


    items.forEach((item) => {
      const trigger = item.querySelector(
        '.content-science-accordion__trigger'
      );

      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('is-active');

        /*
         * Close all accordion items
         */
        items.forEach((otherItem) => {
          otherItem.classList.remove('is-active');

          const otherTrigger = otherItem.querySelector(
            '.content-science-accordion__trigger'
          );

          if (otherTrigger) {
            otherTrigger.setAttribute(
              'aria-expanded',
              'false'
            );
          }
        });


        /*
         * Open clicked item
         */
        if (!isActive) {
          item.classList.add('is-active');

          trigger.setAttribute(
            'aria-expanded',
            'true'
          );
        }
      });
    });
  }


  /*
   * Normal page load
   */
  document.addEventListener('DOMContentLoaded', () => {
    document
      .querySelectorAll('.content-science-accordion')
      .forEach(initContentScienceAccordion);
  });


  /*
   * Shopify Theme Editor support
   */
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector(
      '.content-science-accordion'
    );

    initContentScienceAccordion(section);
  });

})();