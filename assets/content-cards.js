document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll(
    '.content-cards-section'
  );

  sections.forEach(function (section) {
    const track = section.querySelector(
      '.content-cards-track'
    );

    const progressBar = section.querySelector(
      '.content-cards-progress-bar'
    );

    if (!track || !progressBar) return;

    function updateProgress() {
      const maxScroll =
        track.scrollWidth - track.clientWidth;

      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        progressBar.style.transform = 'translateX(0)';
        return;
      }

      /*
       * How much content is visible
       */
      const visibleRatio =
        track.clientWidth / track.scrollWidth;

      /*
       * Progress thumb width
       */
      const barWidth =
        Math.max(visibleRatio * 100, 25);

      /*
       * Current scroll percentage
       */
      const scrollRatio =
        track.scrollLeft / maxScroll;

      /*
       * Available movement
       */
      const availableMove =
        100 - barWidth;

      const translate =
        scrollRatio * availableMove;

      progressBar.style.width =
        `${barWidth}%`;

      progressBar.style.transform =
        `translateX(${translate}%)`;
    }

    track.addEventListener(
      'scroll',
      updateProgress,
      {
        passive: true
      }
    );

    window.addEventListener(
      'resize',
      updateProgress
    );

    updateProgress();
  });
});