//   ENHANCEMENTS.JS 

(function() {
  'use strict';

  // 1. INTERACTIVE PARTICLE BACKGROUND

  function initParticles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var mouse = { x: null, y: null, radius: 150 };
    var pCount = window.innerWidth > 768 ? 70 : 25;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function Particle() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    Particle.prototype.update = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > width || this.x < 0) this.speedX *= -1;
      if (this.y > height || this.y < 0) this.speedY *= -1;
      if (mouse.x !== null) {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var distSq = dx * dx + dy * dy;
        var rSq = mouse.radius * mouse.radius;
        if (distSq < rSq) {
          var dist = Math.sqrt(distSq);
          var force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }
    };
    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(39,174,96,' + this.opacity + ')';
      ctx.fill();
    };

    function connectParticles() {
      var maxDist = 120;
      var maxDistSq = maxDist * maxDist;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            var dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(39,174,96,' + (0.12 * (1 - dist / maxDist)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animate);
    }

    resize();
    for (var i = 0; i < pCount; i++) particles.push(new Particle());
    animate();

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', function() { mouse.x = null; mouse.y = null; });
  }


  // 2. ENHANCED PRELOADER (with percentage counter)
 
  window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Add counter & progress bar dynamically
    var progressWrap = document.createElement('div');
    progressWrap.className = 'preloader-progress';
    var progressBar = document.createElement('div');
    progressBar.className = 'preloader-progress-bar';
    progressWrap.appendChild(progressBar);
    preloader.appendChild(progressWrap);

    var counter = document.createElement('div');
    counter.className = 'preloader-counter';
    counter.textContent = '0%';
    preloader.appendChild(counter);

    // Animate counter 0→100
    var count = 0;
    var duration = 1600; 
    var interval = duration / 100;
    var countInterval = setInterval(function() {
      count++;
      counter.textContent = count + '%';
      progressBar.style.width = count + '%';
      if (count >= 100) {
        clearInterval(countInterval);
        // Dramatic exit after brief pause
        setTimeout(function() { exitPreloader(preloader); }, 300);
      }
    }, interval);
  });

  function exitPreloader(preloader) {
    if (typeof gsap === 'undefined') {
      preloader.style.display = 'none';
      onPreloaderDone();
      return;
    }

    var tl = gsap.timeline();
    // Flash the counter green
    tl.to(preloader.querySelector('.preloader-counter'), {
      scale: 1.2, color: '#6fea9c', duration: 0.2, ease: 'power2.out'
    });
    // Slide preloader up dramatically
    tl.to(preloader, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut',
      onComplete: function() {
        preloader.style.display = 'none';
        onPreloaderDone();
      }
    }, '+=0.1');
  }

  function onPreloaderDone() {
    initParticles();
    runHeaderEntry();
  }

  // 3. CINEMATIC HEADER ENTRY

  function runHeaderEntry() {
    if (typeof gsap === 'undefined') return;

    var hShape = document.querySelector('.header-content .left-header .h-shape');
    var headerImage = document.querySelector('.header-content .left-header .image');
    var nameEl = document.querySelector('.header-content .right-header .name');
    var headerP = document.querySelector('.header-content .right-header p');
    var btnWrapper = document.querySelector('.header-content .right-header .btn-social-wrapper');

    var tl = gsap.timeline();

    // h-shape clip reveal
    if (hShape) {
      tl.fromTo(hShape,
        { clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)', opacity: 0 },
        { clipPath: 'polygon(0 0, 46% 0, 79% 100%, 0% 100%)', opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    // Image slides in
    if (headerImage) {
      tl.fromTo(headerImage,
        { x: -80, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform' },
        '-=0.4'
      );
    }
    // Name: letters fly in from random positions
    if (nameEl) {
      tl.fromTo(nameEl, { opacity: 0 }, { opacity: 1, duration: 0.01 }, '-=0.2');
      tl.add(function() {
        // animate letters
        splitTextToLetters();
        var letters = nameEl.querySelectorAll('.letter');
        if (letters.length) {
          gsap.fromTo(letters,
            { opacity: 0, y: function() { return gsap.utils.random(-25, 25); }, rotateZ: function() { return gsap.utils.random(-20, 20); } },
            { opacity: 1, y: 0, rotateZ: 0, duration: 0.5, stagger: 0.02, ease: 'back.out(1.5)', clearProps: 'transform' }
          );
        }
      });
    }
    // Paragraph: clip-path reveal (left to right curtain)
    if (headerP) {
      tl.fromTo(headerP,
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 1 },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'power2.inOut', clearProps: 'clipPath' },
        '-=0.2'
      );
    }
    // Social + CV stagger up
    if (btnWrapper) {
      tl.fromTo(btnWrapper,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
        '-=0.3'
      );
    }
  }

  // 4. TRANSITION BARS (Cinematic Bar Wipe)

  var transitionBars = [];

  function createTransitionBars() {
    var container = document.createElement('div');
    container.className = 'transition-bars';
    for (var i = 0; i < 5; i++) {
      var bar = document.createElement('div');
      bar.className = 'transition-bar';
      container.appendChild(bar);
      transitionBars.push(bar);
    }
    document.body.appendChild(container);
  }


  // 5. SECTION SWITCH (Cinematic Wipe Transition)

  var isTransitioning = false;

  window.switchSection = function(currentEl, nextEl) {
    if (!currentEl || !nextEl || currentEl === nextEl) return;
    if (isTransitioning) return;

    if (typeof gsap === 'undefined' || transitionBars.length === 0) {
      currentEl.classList.remove('active');
      nextEl.classList.add('active');
      return;
    }

    isTransitioning = true;
    var tl = gsap.timeline({
      onComplete: function() { isTransitioning = false; }
    });

    // Bars sweep IN from left
    tl.fromTo(transitionBars,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.35, stagger: 0.05, ease: 'power4.inOut' }
    );

    // While fully covered, switch sections
    tl.add(function() {
      gsap.set(currentEl, { clearProps: 'all' });
      currentEl.classList.remove('active');
      nextEl.classList.add('active');
    });

    // Brief pause while covered (for drama)
    tl.to({}, { duration: 0.08 });

    // Bars sweep OUT to right
    tl.fromTo(transitionBars,
      { scaleX: 1, transformOrigin: 'right center' },
      { scaleX: 0, duration: 0.35, stagger: 0.05, ease: 'power4.inOut' }
    );


    tl.add(function() {
      animateSectionContent(nextEl.id);
    }, '-=0.25');
  };

  // 6. SECTION CONTENT ENTRY ANIMATIONS

  var animatedSections = {};

  function animateSectionContent(sectionId) {
    if (typeof gsap === 'undefined') return;
    if (animatedSections[sectionId]) return;
    animatedSections[sectionId] = true;

    var section = document.getElementById(sectionId);
    if (!section) return;

    if (sectionId === 'about') {
      var items = section.querySelectorAll('.about-item');
      var timelineItems = section.querySelectorAll('.timeline-item');
      var progressBars = section.querySelectorAll('.progress-bar');

      if (items.length) {
        gsap.fromTo(items,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)', clearProps: 'all' }
        );
      }
      // Animated counters
      animateCounters(section);

      if (timelineItems.length) {
        for (var i = 0; i < timelineItems.length; i++) {
          var fromX = (i % 2 === 0) ? -40 : 40;
          gsap.fromTo(timelineItems[i],
            { x: fromX, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.45, delay: 0.15 + i * 0.08, ease: 'power2.out', clearProps: 'all' }
          );
        }
      }
      // Skill bars fill
      animateSkillBars(section);

      if (progressBars.length) {
        gsap.fromTo(progressBars,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.2, clearProps: 'all' }
        );
      }
    }

    if (sectionId === 'portfolio') {
      var portItems = section.querySelectorAll('.portfolio-item');
      if (portItems.length) {
        gsap.fromTo(portItems,
          { scale: 0.85, opacity: 0, rotateY: 8 },
          { scale: 1, opacity: 1, rotateY: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.3)', clearProps: 'all' }
        );
      }
    }

    if (sectionId === 'contact') {
      var leftContact = section.querySelector('.left-contact');
      var rightContact = section.querySelector('.right-contact');
      var contactMap = section.querySelector('#contact-map');

      if (leftContact) {
        gsap.fromTo(leftContact,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
        );
      }
      if (rightContact) {
        gsap.fromTo(rightContact,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1, clearProps: 'all' }
        );
      }
      if (contactMap) {
        gsap.fromTo(contactMap,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2, clearProps: 'all' }
        );
      }
      initMap();
    }
  }

  window.animateSectionEntry = animateSectionContent;

  // 7. ANIMATED COUNTERS (stat cards count up)

  function animateCounters(section) {
    if (typeof gsap === 'undefined') return;
    var largeTexts = section.querySelectorAll('.large-text');
    largeTexts.forEach(function(el) {
      var text = el.textContent.trim();
      var num = parseInt(text);
      if (isNaN(num)) {
        // Text like "Active" — scramble reveal
        scrambleText(el, text);
        return;
      }
      var suffix = text.replace(num.toString(), ''); 
      el.textContent = '0' + suffix;
      var obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 2,
        ease: 'power2.out',
        delay: 0.3,
        onUpdate: function() {
          el.textContent = Math.round(obj.val) + suffix;
        }
      });
    });
  }

  // 8. TEXT SCRAMBLE EFFECT

  function scrambleText(el, finalText) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';
    var iterations = 0;
    var interval = setInterval(function() {
      el.textContent = finalText.split('').map(function(char, idx) {
        if (idx < iterations) return finalText[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iterations >= finalText.length) clearInterval(interval);
      iterations += 1 / 2;
    }, 40);
  }

  // 9. SKILL BARS FILL ANIMATION

  function animateSkillBars(section) {
    var bars = section.querySelectorAll('.progress span');
    bars.forEach(function(bar) {
      var targetWidth = window.getComputedStyle(bar).width;
      bar.style.width = '0px';
      gsap.to(bar, {
        width: targetWidth,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.5
      });
    });
  }

  // 10. LETTER-BY-LETTER HOVER

  var letterized = false;
  function splitTextToLetters() {
    var nameEl = document.querySelector('.header-content .right-header .name');
    if (!nameEl || letterized) return;
    letterized = true;
    nameEl.classList.add('letter-hover-target');

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var text = node.textContent;
        if (!text.trim()) return;
        var fragment = document.createDocumentFragment();
        var words = text.split(/(\s+)/);
        words.forEach(function(word) {
          if (/^\s+$/.test(word)) {
            var space = document.createElement('span');
            space.classList.add('letter-space');
            space.innerHTML = '&nbsp;';
            fragment.appendChild(space);
          } else if (word.length > 0) {
            var wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            for (var i = 0; i < word.length; i++) {
              var span = document.createElement('span');
              span.classList.add('letter');
              span.textContent = word[i];
              wordSpan.appendChild(span);
            }
            fragment.appendChild(wordSpan);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName.toLowerCase() === 'br') return;
        Array.from(node.childNodes).forEach(processNode);
      }
    }

    Array.from(nameEl.childNodes).forEach(processNode);

    var animClasses = ['animate__rubberBand', 'animate__jello', 'animate__swing', 'animate__tada', 'animate__pulse'];
    nameEl.querySelectorAll('.letter').forEach(function(letter) {
      letter.addEventListener('mouseenter', function() {
        if (this.classList.contains('animate__animated')) return;
        var anim = animClasses[Math.floor(Math.random() * animClasses.length)];
        this.classList.add('animate__animated', anim);
        this.style.color = 'var(--color-secondary)';
        this.addEventListener('animationend', function handler() {
          this.classList.remove('animate__animated', anim);
          this.style.color = '';
          this.removeEventListener('animationend', handler);
        });
      });
    });
  }

  // 11. 3D TILT ON CARDS (About + Portfolio)
  function initTiltEffect() {
    // About stat cards
    var aboutItems = document.querySelectorAll('.about-container .right-about .about-item');
    aboutItems.forEach(function(item) {
      item.addEventListener('mousemove', tiltHandler);
      item.addEventListener('mouseleave', tiltReset);
    });

    // Portfolio items
    var portItems = document.querySelectorAll('.portfolio-item');
    portItems.forEach(function(item) {
      item.addEventListener('mousemove', tiltHandler);
      item.addEventListener('mouseleave', tiltReset);
    });
  }

  function tiltHandler(e) {
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var rotateX = ((y - centerY) / centerY) * -6;
    var rotateY = ((x - centerX) / centerX) * 6;
    this.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
  }

  function tiltReset() {
    this.style.transform = '';
  }

  // 12. MAGNETIC NAV BUTTONS

  function initMagneticButtons() {
    if (window.innerWidth <= 768) return;
    var buttons = document.querySelectorAll('.control, .theme-btn');

    buttons.forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = 'translate(' + (x * 0.35) + 'px, ' + (y * 0.35) + 'px)';
      });

      btn.addEventListener('mouseleave', function() {
        if (typeof gsap !== 'undefined') {
          gsap.to(this, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)', clearProps: 'transform' });
        } else {
          this.style.transform = '';
        }
      });
    });
  }

  // 13. SCROLL PROGRESS INDICATOR

  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        bar.style.width = (scrollTop / docHeight * 100) + '%';
      }
    });
  }

  // 14. LEAFLET MAP

  var mapInitialized = false;
  function initMap() {
    if (mapInitialized) return;
    var mapContainer = document.getElementById('contact-map');
    if (!mapContainer || typeof L === 'undefined') return;
    mapInitialized = true;

    var map = L.map('contact-map', { scrollWheelZoom: false, zoomControl: true })
      .setView([18.5204, 73.8567], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    var marker = L.divIcon({
      className: 'custom-map-marker',
      html: '<div style="width:16px;height:16px;background:#27AE60;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(39,174,96,0.6);"></div>',
      iconSize: [16, 16], iconAnchor: [8, 8]
    });

    L.marker([18.5204, 73.8567], { icon: marker }).addTo(map)
      .bindPopup('<strong style="color:#27AE60;">Zahid Shaikh</strong><br>Pune, Maharashtra, India');

    setTimeout(function() { map.invalidateSize(); }, 300);
  }

  // 15. TOAST NOTIFICATIONS

  window.showToast = function(message, type) {
    type = type || 'success';
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + type;
    toast.innerHTML = '<button class="toast-close">&times;</button>' + message;
    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() { toast.classList.add('toast-visible'); });
    });

    toast.querySelector('.toast-close').addEventListener('click', function() {
      toast.classList.remove('toast-visible');
      setTimeout(function() { toast.remove(); }, 500);
    });

    setTimeout(function() {
      if (toast.parentNode) {
        toast.classList.remove('toast-visible');
        setTimeout(function() { toast.remove(); }, 500);
      }
    }, 4000);
  };

  // 16. CUSTOM CURSOR

  function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth <= 768) return;

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    var hoverSel = 'a, button, .control, .theme-btn, .main-btn, .portfolio-item, .about-item';
    document.addEventListener('mouseover', function(e) {
      if (e.target.closest(hoverSel)) ring.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest(hoverSel)) ring.classList.remove('cursor-hover');
    });
  }

  // 17. CURSOR SPARKLE PARTICLE TRAIL

  function initCursorSparkles() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth <= 768) return;

    var colors = ['#27AE60', '#6fea9c', '#1abc9c', '#2ecc71', '#ffffff'];
    var lastTime = 0;

    document.addEventListener('mousemove', function(e) {
      var now = Date.now();
      if (now - lastTime < 50) return; // Throttle
      lastTime = now;

      var sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.width = (Math.random() * 4 + 2) + 'px';
      sparkle.style.height = sparkle.style.width;
      sparkle.style.setProperty('--sx', (Math.random() - 0.5) * 60 + 'px');
      sparkle.style.setProperty('--sy', (Math.random() - 0.5) * 60 + 'px');
      sparkle.style.boxShadow = '0 0 6px ' + sparkle.style.background;
      document.body.appendChild(sparkle);

      setTimeout(function() {
        if (sparkle.parentNode) sparkle.remove();
      }, 850);
    });
  }


  // 18. MOUSE PARALLAX ON HEADER

  function initMouseParallax() {
    if (window.innerWidth <= 768) return;

    var leftHeader = document.querySelector('.header-content .left-header');
    var rightHeader = document.querySelector('.header-content .right-header');

    if (!leftHeader || !rightHeader) return;

    document.addEventListener('mousemove', function(e) {
      // Only apply when home section is active
      var homeSection = document.getElementById('home');
      if (!homeSection || !homeSection.classList.contains('active')) return;

      var xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      var yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

      leftHeader.style.transform =
        'translate(' + (xPercent * -12) + 'px, ' + (yPercent * -8) + 'px)';
      rightHeader.style.transform =
        'translate(' + (xPercent * 8) + 'px, ' + (yPercent * 5) + 'px)';
    });
  }

  // 19. MORPHING AURORA BLOBS (background)

  function createAuroraBlobs() {
    for (var i = 1; i <= 3; i++) {
      var blob = document.createElement('div');
      blob.className = 'aurora-blob blob-' + i;
      document.body.appendChild(blob);
    }
  }

  // 20. TYPING CURSOR ON PARAGRAPH

  function addTypingCursor() {
    var p = document.querySelector('.header-content .right-header p');
    if (p) p.classList.add('typed');
  }

  // 21. GLITCH EFFECT ON LETTER HOVER (enhanced)

  function initGlitchLetters() {

    var observer = new MutationObserver(function() {
      var nameEl = document.querySelector('.letter-hover-target');
      if (!nameEl) return;
      var letters = nameEl.querySelectorAll('.letter');
      if (letters.length === 0) return;

      observer.disconnect();

      letters.forEach(function(letter) {
        letter.addEventListener('mouseenter', function() {

          if (Math.random() < 0.35) {
            this.classList.add('letter-glitch');
            var self = this;
            setTimeout(function() {
              self.classList.remove('letter-glitch');
            }, 250);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 22. DRAMATIC THEME TOGGLE

  function initThemeToggleFlash() {
    var themeBtn = document.querySelector('.theme-btn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', function() {
      if (typeof gsap === 'undefined') return;

      var flash = document.createElement('div');
      flash.className = 'theme-flash';
      document.body.appendChild(flash);

      gsap.to(flash, {
        opacity: 0.25,
        duration: 0.08,
        onComplete: function() {
          gsap.to(flash, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: function() { flash.remove(); }
          });
        }
      });
    });
  }

  // 23. STAT CARD GLOW AFTER COUNTING

  function addCountedGlow() {
    setTimeout(function() {
      var items = document.querySelectorAll('.about-container .right-about .about-item');
      items.forEach(function(item) { item.classList.add('counted'); });
    }, 2500);
  }

  // 24. TOUCH SPARKLE BURST 

  function initTouchSparkles() {
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isMobile) return;

    var colors = ['#27AE60', '#6fea9c', '#1abc9c', '#2ecc71', '#ffffff'];
    var lastTap = 0;

    document.addEventListener('touchstart', function(e) {
      var now = Date.now();
      if (now - lastTap < 200) return; 
      lastTap = now;

      var touch = e.touches[0];
      if (!touch) return;

      // Create burst of 8 sparkles radiating outward
      for (var i = 0; i < 8; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'touch-sparkle';
        var angle = (i / 8) * Math.PI * 2;
        var dist = 30 + Math.random() * 30;
        var tx = Math.cos(angle) * dist + 'px';
        var ty = Math.sin(angle) * dist + 'px';
        sparkle.style.setProperty('--tx', tx);
        sparkle.style.setProperty('--ty', ty);
        sparkle.style.left = touch.clientX + 'px';
        sparkle.style.top = touch.clientY + 'px';
        sparkle.style.width = (3 + Math.random() * 4) + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = '0 0 8px ' + sparkle.style.background;
        document.body.appendChild(sparkle);

        (function(el) {
          setTimeout(function() { if (el.parentNode) el.remove(); }, 650);
        })(sparkle);
      }
    }, { passive: true });
  }

  // 25. SWIPE NAVIGATION (mobile gesture between sections)

  function initSwipeNavigation() {
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isMobile) return;

    var sectionOrder = ['home', 'about', 'portfolio', 'contact'];
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;
    var minSwipe = 80; 

    var hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.innerHTML = '<span>Swipe to navigate</span><div class="swipe-arrows"><span>›</span><span>›</span><span>›</span></div>';
    document.body.appendChild(hint);

    // Auto-hide swipe hint after 6 seconds or first swipe
    var hintTimeout = setTimeout(function() {
      hint.style.transition = 'opacity 0.5s';
      hint.style.opacity = '0';
      setTimeout(function() { hint.style.display = 'none'; }, 500);
    }, 6000);

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;

      var diffX = touchEndX - touchStartX;
      var diffY = touchEndY - touchStartY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) < minSwipe) return;
      if (Math.abs(diffY) > Math.abs(diffX) * 0.7) return; 

      // Find current section index
      var currentSection = document.querySelector('.active');
      if (!currentSection) return;
      var currentId = currentSection.id;
      var currentIndex = sectionOrder.indexOf(currentId);
      if (currentIndex === -1) return;

      var nextIndex;
      if (diffX < 0) {
        // Swipe LEFT → next section
        nextIndex = currentIndex + 1;
      } else {
        // Swipe RIGHT → previous section
        nextIndex = currentIndex - 1;
      }

      if (nextIndex < 0 || nextIndex >= sectionOrder.length) return;

      var nextId = sectionOrder[nextIndex];
      var nextSection = document.getElementById(nextId);
      if (!nextSection || nextSection === currentSection) return;

      clearTimeout(hintTimeout);
      hint.style.transition = 'opacity 0.3s';
      hint.style.opacity = '0';
      setTimeout(function() { hint.style.display = 'none'; }, 300);

      // Update nav button highlight
      var activeBtn = document.querySelector('.active-btn');
      if (activeBtn) activeBtn.classList.remove('active-btn');
      var targetBtn = document.querySelector('.control[data-id="' + nextId + '"]');
      if (targetBtn) targetBtn.classList.add('active-btn');

      // Update URL hash
      history.replaceState(null, '', '#' + nextId);

      // cinematic transition
      if (typeof window.switchSection === 'function') {
        window.switchSection(currentSection, nextSection);
      } else {
        currentSection.classList.remove('active');
        nextSection.classList.add('active');
      }
    }, { passive: true });
  }

  // 26. TOUCH-FRIENDLY PORTFOLIO OVERLAY

  function initTouchPortfolio() {
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isMobile) return;

    var portItems = document.querySelectorAll('.portfolio-item');

    portItems.forEach(function(item) {
      item.addEventListener('click', function(e) {
        var hoverItems = this.querySelector('.hover-items');
        if (!hoverItems) return;

        if (e.target.closest('a.icon')) return;

        var isVisible = hoverItems.style.opacity === '1';

        portItems.forEach(function(pi) {
          var hi = pi.querySelector('.hover-items');
          if (hi) {
            hi.style.opacity = '0';
            hi.style.transform = 'scale(0)';
          }
        });

        if (!isVisible) {
          hoverItems.style.opacity = '1';
          hoverItems.style.transform = 'scale(1)';
        }
      });
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.portfolio-item')) {
        portItems.forEach(function(pi) {
          var hi = pi.querySelector('.hover-items');
          if (hi) {
            hi.style.opacity = '0';
            hi.style.transform = 'scale(0)';
          }
        });
      }
    });
  }

  // 27. MOBILE GYRO PARALLAX (device orientation for depth)
  function initGyroParallax() {
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isMobile) return;

    var leftHeader = document.querySelector('.header-content .left-header');
    var rightHeader = document.querySelector('.header-content .right-header');
    if (!leftHeader || !rightHeader) return;

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('touchstart', function requestGyro() {
        DeviceOrientationEvent.requestPermission().then(function(state) {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleGyro);
          }
        }).catch(function() {});
        document.removeEventListener('touchstart', requestGyro);
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleGyro);
    }

    function handleGyro(e) {
      var homeSection = document.getElementById('home');
      if (!homeSection || !homeSection.classList.contains('active')) return;

      var gamma = e.gamma || 0; 
      var beta = e.beta || 0;   

      var x = Math.max(-1, Math.min(1, gamma / 30));
      var y = Math.max(-1, Math.min(1, (beta - 45) / 30)); 

      leftHeader.style.transform = 'translate(' + (x * -6) + 'px, ' + (y * -4) + 'px)';
      rightHeader.style.transform = 'translate(' + (x * 4) + 'px, ' + (y * 3) + 'px)';
    }
  }

  // INIT

  document.addEventListener('DOMContentLoaded', function() {
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Universal features (both desktop & mobile)
    createTransitionBars();
    createAuroraBlobs();
    initScrollProgress();
    initGlitchLetters();
    initThemeToggleFlash();
    addTypingCursor();
    addCountedGlow();

    if (isMobile) {
      // Mobile-only features
      initTouchSparkles();
      initSwipeNavigation();
      initTouchPortfolio();
      initGyroParallax();
    } else {
      // Desktop-only features
      initTiltEffect();
      initMagneticButtons();
      initCustomCursor();
      initCursorSparkles();
      initMouseParallax();
    }
  });

})();
