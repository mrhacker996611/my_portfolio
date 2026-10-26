(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  document.documentElement.classList.add('js-enabled');

  const menuButton = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileNav');

  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      mobileMenu.classList.toggle('hidden', isOpen);
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    });

    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  }

  const revealElements = document.querySelectorAll('.scroll-animate, .fade-up');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    revealElements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.classList.add('is-visible');
      } else {
        revealObserver.observe(element);
      }
    });
  }

  const sections = document.querySelectorAll('#services, #education, #projects, #experience, #achievements');
  const sectionLinks = document.querySelectorAll('nav a[href^="#"]');
  if ('IntersectionObserver' in window && sections.length) {
    const navigationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('nav-active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -65% 0px' });

    sections.forEach(section => navigationObserver.observe(section));
  }

  const greeting = document.getElementById('typed-greeting');
  if (greeting && !reducedMotion) {
    const messages = [
      'Hi there!',
      'I am Md. Shahed Mahmud.',
      'IT Support | Designer | Developer'
    ];
    let messageIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const typeNextCharacter = () => {
      const message = messages[messageIndex];
      characterIndex += deleting ? -1 : 1;
      greeting.textContent = message.slice(0, characterIndex) || '\u00a0';

      let delay = deleting ? 32 : 58;
      if (!deleting && characterIndex === message.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        delay = 350;
      }

      window.setTimeout(typeNextCharacter, delay);
    };

    greeting.textContent = '';
    window.setTimeout(typeNextCharacter, 400);
  }

  const tiltContainer = document.querySelector('.tilt-container');
  const tiltCard = document.querySelector('.tilt-inner');
  if (tiltContainer && tiltCard && !reducedMotion && canHover) {
    tiltContainer.addEventListener('pointermove', event => {
      const bounds = tiltContainer.getBoundingClientRect();
      const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
      const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;
      tiltCard.style.setProperty('--tilt-x', `${horizontalPosition * 12}deg`);
      tiltCard.style.setProperty('--tilt-y', `${verticalPosition * -12}deg`);
    });

    tiltContainer.addEventListener('pointerleave', () => {
      tiltCard.style.setProperty('--tilt-x', '0deg');
      tiltCard.style.setProperty('--tilt-y', '0deg');
    });
  }

  const animateCount = element => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;

    const suffix = element.dataset.countSuffix || '';
    if (reducedMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1100;
    const startedAt = performance.now();
    const update = now => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      element.textContent = `${Math.round(target * easedProgress)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  };

  const counters = document.querySelectorAll('[data-count]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(animateCount);
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  const scrollTrack = (track, direction) => {
    const card = track.firstElementChild;
    if (!card) return;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap) || 16;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };

  document.querySelectorAll('.prevBtn').forEach(button => {
    const track = button.parentElement.querySelector('.sliderTrack');
    if (track) button.addEventListener('click', () => scrollTrack(track, -1));
  });

  document.querySelectorAll('.nextBtn').forEach(button => {
    const track = button.parentElement.querySelector('.sliderTrack');
    if (track) button.addEventListener('click', () => scrollTrack(track, 1));
  });

  const certificateDialog = document.getElementById('certificateImageDialog');
  const certificatePreview = document.getElementById('certificateImagePreview');
  const certificateCloseButton = certificateDialog && certificateDialog.querySelector('.certificate-image-close');
  if (certificateDialog instanceof HTMLDialogElement && certificatePreview instanceof HTMLImageElement && certificateCloseButton) {
    let previousFocus;

    document.querySelectorAll('.certificate-card').forEach(card => {
      const image = card.querySelector('img');
      if (!image) return;

      const zoomButton = document.createElement('button');
      zoomButton.type = 'button';
      zoomButton.className = 'certificate-zoom-button';
      zoomButton.setAttribute('aria-label', `Enlarge ${image.alt || 'certificate image'}`);
      zoomButton.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i>';
      card.append(zoomButton);

      zoomButton.addEventListener('click', () => {
        previousFocus = zoomButton;
        certificatePreview.src = image.currentSrc || image.src;
        certificatePreview.alt = image.alt || 'Certificate image';
        certificateDialog.showModal();
      });
    });

    certificateCloseButton.addEventListener('click', () => certificateDialog.close());
    certificateDialog.addEventListener('click', event => {
      if (event.target === certificateDialog) certificateDialog.close();
    });
    certificateDialog.addEventListener('close', () => {
      if (previousFocus) previousFocus.focus();
    });
  }

  if (!reducedMotion) {
    document.querySelectorAll('.sliderTrack').forEach(track => {
      let isPaused = false;
      track.addEventListener('pointerenter', () => { isPaused = true; });
      track.addEventListener('pointerleave', () => { isPaused = false; });
      track.addEventListener('focusin', () => { isPaused = true; });
      track.addEventListener('focusout', event => {
        if (!track.contains(event.relatedTarget)) isPaused = false;
      });
      track.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollTrack(track, 1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollTrack(track, -1);
        }
      });

      window.setInterval(() => {
        if (isPaused || document.hidden || track.scrollWidth <= track.clientWidth) return;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        track.scrollTo({
          left: atEnd ? 0 : track.scrollLeft + track.clientWidth * 0.8,
          behavior: 'smooth'
        });
      }, 5000);
    });
  }
})();
