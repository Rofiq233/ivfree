document.addEventListener('DOMContentLoaded', function () {

  const sections = document.querySelectorAll(
    '.information-tabs'
  );


  sections.forEach(function (section) {

    const tabs = section.querySelectorAll(
      '.information-tabs__tab'
    );

    const panels = section.querySelectorAll(
      '.information-tabs__panel'
    );


    if (!tabs.length || !panels.length) {
      return;
    }


    tabs.forEach(function (tab) {

      tab.addEventListener('click', function () {

        const targetId = tab.dataset.tabId;


        /* =====================================
           UPDATE TABS
        ===================================== */

        tabs.forEach(function (item) {

          const active = item === tab;

          item.classList.toggle(
            'is-active',
            active
          );

          item.setAttribute(
            'aria-selected',
            active ? 'true' : 'false'
          );

        });

        panels.forEach(function (panel) {

          const active =
            panel.dataset.panelId === targetId;


          if (active) {

            panel.hidden = false;

            panel.classList.add(
              'is-active'
            );

          } else {

            panel.hidden = true;

            panel.classList.remove(
              'is-active'
            );

          }

        });

      });

    });

  });

});