(function () {
  'use strict';

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var touchFirst = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);

  /* 1. Theme toggle (pastel day and pastel night) */
  var themeBtn = document.getElementById('theme-toggle');
  var themeText = document.getElementById('theme-toggle-text');

  function getActiveTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    return current === 'dark' ? 'dark' : 'light';
  }

  function updateThemeButton(theme) {
    if (!themeBtn || !themeText) {
      return;
    }
    if (theme === 'dark') {
      themeBtn.setAttribute('aria-pressed', 'true');
      themeText.textContent = 'Day';
    } else {
      themeBtn.setAttribute('aria-pressed', 'false');
      themeText.textContent = 'Night';
    }
  }

  updateThemeButton(getActiveTheme());

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        window.localStorage.setItem('paleo_theme', nextTheme);
      } catch (e) {
        /* localStorage may be blocked in private browsing; ignore safely */
      }
      updateThemeButton(nextTheme);
      document.dispatchEvent(new Event('paleo-theme'));
    });
  }

  /* 2. Mobile menu toggle */
  var menuBtn = document.getElementById('menu-toggle');
  var siteNav = document.getElementById('site-nav');

  if (menuBtn && siteNav) {
    siteNav.classList.add('is-collapsed');
    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', function () {
      var isHidden = siteNav.classList.toggle('is-collapsed');
      menuBtn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    });
  }

  /* 3. Missing screenshot check (shows the "Photo to come" card cleanly) */
  var frames = document.querySelectorAll('.photo-frame img');
  for (var i = 0; i < frames.length; i++) {
    var img = frames[i];
    if (img.complete && img.naturalWidth === 0) {
      if (img.parentElement) {
        img.parentElement.classList.add('is-missing');
      }
    }
    img.addEventListener('error', function () {
      if (this.parentElement) {
        this.parentElement.classList.add('is-missing');
      }
    });
  }

  /* 4. Dev log tag filtering */
  var filterButtons = document.querySelectorAll('.btn-filter[data-filter]');
  var devlogList = document.getElementById('devlog-list');
  var statusEl = document.getElementById('filter-count-status');
  var emptyNotice = document.getElementById('devlog-empty-filter');

  if (filterButtons.length > 0 && devlogList) {
    var cards = devlogList.querySelectorAll('.specimen-card');

    function applyFilter(selectedTag) {
      var visibleCount = 0;

      for (var c = 0; c < cards.length; c++) {
        var card = cards[c];
        var rawTags = card.getAttribute('data-tags') || '';
        var tagArray = rawTags.split(/\s+/);
        var match = selectedTag === 'all' || tagArray.indexOf(selectedTag) !== -1;

        if (match) {
          card.hidden = false;
          visibleCount += 1;
        } else {
          card.hidden = true;
        }
      }

      for (var b = 0; b < filterButtons.length; b++) {
        var btn = filterButtons[b];
        var isCurrent = btn.getAttribute('data-filter') === selectedTag;
        btn.classList.toggle('is-active', isCurrent);
        btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      }

      if (statusEl) {
        if (selectedTag === 'all') {
          statusEl.textContent = 'Showing all ' + visibleCount + ' posts';
        } else {
          statusEl.textContent = 'Showing ' + visibleCount + ' post' + (visibleCount === 1 ? '' : 's') + ' tagged "' + selectedTag + '"';
        }
      }

      if (emptyNotice) {
        emptyNotice.hidden = visibleCount > 0;
      }
    }

    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].addEventListener('click', function () {
        var chosen = this.getAttribute('data-filter') || 'all';
        applyFilter(chosen);
      });
    }
  }

  /* 5. The scene: Katie walks between the signposts.
     Arrow keys or A and D walk, E visits the sign she's at. A click or tap on
     the ground walks her there; on a sign, she walks over and then it opens. */
  var scene = document.getElementById('scene');
  var world = document.getElementById('scene-world');
  var katie = document.getElementById('katie');
  var sprite = document.getElementById('katie-sprite');
  var bubble = document.getElementById('katie-bubble');
  var sceneHint = document.getElementById('scene-hint');

  if (scene && world && katie && sprite && bubble) {
    var signs = Array.prototype.slice.call(world.querySelectorAll('.signpost'));
    var FRAME = 128;     /* one 64px frame of the sheet, drawn at 2x */
    var WALK = 170;      /* pixels a second */
    var NEAR = 56;       /* this close to a sign counts as being at it */
    var walker = {
      x: 0, held: { left: false, right: false }, target: null, speed: WALK, goTo: null,
      facing: 1, walking: false, frame: 0, clock: 0, cam: -1, near: null, last: 0, visible: true, moved: false
    };

    /* Each signpost is centred on its left edge (translateX(-50%) in the CSS). */
    var signX = function (sign) { return sign.offsetLeft; };
    var worldWidth = function () { return world.offsetWidth; };
    var clampX = function (x) { return Math.max(48, Math.min(worldWidth() - 48, x)); };

    var here = world.querySelector('.signpost.is-here') || signs[0];
    walker.x = clampX(signX(here) + (here === signs[0] ? 72 : -72));

    if (sceneHint) {
      sceneHint.textContent = touchFirst ? 'Tap the ground to walk, or tap a sign' : 'Walk with ← → or A and D, press E at a sign';
      sceneHint.hidden = false;
    }

    var updateNear = function () {
      var best = null;
      var bestGap = NEAR;
      for (var s = 0; s < signs.length; s++) {
        var gap = Math.abs(signX(signs[s]) - walker.x);
        if (gap < bestGap) {
          best = signs[s];
          bestGap = gap;
        }
      }
      if (best === walker.near) {
        return;
      }
      if (walker.near) {
        walker.near.classList.remove('is-near');
      }
      walker.near = best;
      if (best) {
        best.classList.add('is-near');
        var name = best.textContent.replace(/\s+/g, ' ').trim();
        if (best.classList.contains('is-here')) {
          bubble.textContent = 'You are here';
        } else {
          bubble.textContent = (touchFirst ? 'Tap for ' : 'Press E for ') + name;
        }
        bubble.classList.add('is-showing');
      } else {
        bubble.classList.remove('is-showing');
      }
    };

    var draw = function () {
      var row = walker.walking ? 1 : 0;
      sprite.style.backgroundPosition = (-walker.frame * FRAME) + 'px ' + (-row * FRAME) + 'px';
      katie.style.transform = 'translateX(' + Math.round(walker.x - FRAME / 2) + 'px)';
      katie.classList.toggle('is-facing-left', walker.facing < 0);

      var view = scene.clientWidth;
      var maxCam = Math.max(0, worldWidth() - view);
      var cam = Math.round(Math.max(0, Math.min(maxCam, walker.x - view / 2)));
      if (cam !== walker.cam) {
        walker.cam = cam;
        world.style.transform = 'translateX(' + (-cam) + 'px)';
        scene.style.setProperty('--cam', cam);
      }
    };

    var tick = function (now) {
      var dt = walker.last ? Math.min(0.05, (now - walker.last) / 1000) : 0;
      walker.last = now;
      if (walker.visible) {
        var dir = (walker.held.right ? 1 : 0) - (walker.held.left ? 1 : 0);
        var step = 0;
        if (dir !== 0) {
          walker.target = null;
          walker.goTo = null;
          step = dir * WALK * dt;
        } else if (walker.target !== null) {
          var gap = walker.target - walker.x;
          var reach = walker.speed * dt;
          step = Math.abs(gap) <= reach ? gap : (gap > 0 ? reach : -reach);
        }

        var before = walker.x;
        walker.x = clampX(walker.x + step);
        var walking = Math.abs(walker.x - before) > 0.01;
        if (walking) {
          walker.facing = walker.x > before ? 1 : -1;
          if (!walker.moved && sceneHint) {
            walker.moved = true;
            sceneHint.hidden = true;
          }
        } else if (walker.target !== null && step === 0) {
          walker.target = null;
        }
        if (walker.target !== null && Math.abs(walker.target - walker.x) < 0.5) {
          walker.target = null;
        }

        if (walking !== walker.walking) {
          walker.walking = walking;
          walker.frame = 0;
          walker.clock = 0;
        }
        walker.clock += dt;
        var fps = walking ? 12 : 4;
        var count = walking ? 8 : 4;
        if (reduceMotion && !walking) {
          walker.frame = 0;
        } else if (walker.clock >= 1 / fps) {
          walker.clock = 0;
          walker.frame = (walker.frame + 1) % count;
        }

        updateNear();
        draw();

        if (walker.goTo && walker.target === null) {
          var href = walker.goTo;
          walker.goTo = null;
          window.location.href = href;
        }
      }
      window.requestAnimationFrame(tick);
    };

    /* Walk somewhere, never taking more than a couple of seconds to get there. */
    var walkTo = function (x, maxSeconds) {
      walker.target = clampX(x);
      walker.speed = Math.max(WALK, Math.abs(walker.target - walker.x) / maxSeconds);
    };

    var typing = function (e) {
      var t = e.target;
      var tag = t && t.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable);
    };

    document.addEventListener('keydown', function (e) {
      if (typing(e) || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') {
        walker.held.left = true;
      } else if (k === 'ArrowRight' || k === 'd' || k === 'D') {
        walker.held.right = true;
      } else if ((k === 'e' || k === 'E') && walker.near && !walker.near.classList.contains('is-here')) {
        window.location.href = walker.near.href;
      }
    });

    document.addEventListener('keyup', function (e) {
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') {
        walker.held.left = false;
      } else if (k === 'ArrowRight' || k === 'd' || k === 'D') {
        walker.held.right = false;
      }
    });

    window.addEventListener('blur', function () {
      walker.held.left = false;
      walker.held.right = false;
    });

    scene.addEventListener('click', function (e) {
      if (e.target.closest('.scene-top')) {
        return;
      }
      var sign = e.target.closest('.signpost');
      if (sign) {
        /* Keyboard clicks, new-tab clicks and reduced motion just follow the link. */
        if (reduceMotion || e.detail === 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        walkTo(signX(sign), 1.2);
        walker.goTo = sign.classList.contains('is-here') ? null : sign.href;
        return;
      }
      var rect = scene.getBoundingClientRect();
      walkTo(e.clientX - rect.left + Math.max(0, walker.cam), 2.5);
      walker.goTo = null;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        walker.visible = entries[0].isIntersecting;
      }).observe(scene);
    }

    window.addEventListener('resize', function () {
      walker.x = clampX(walker.x);
      walker.cam = -1;
      draw();
    });

    draw();
    window.requestAnimationFrame(tick);
  }

  /* 6. Brush to reveal: drag across the dirt to uncover a screenshot.
     The dirt is a small canvas drawn up large, so it comes out as pixel art. */
  var reveal = document.getElementById('reveal');
  var dirt = document.getElementById('reveal-dirt');

  if (reveal && dirt && dirt.getContext) {
    var revealImg = reveal.querySelector('.reveal-img');
    var revealHint = document.getElementById('reveal-hint');
    var revealCaption = document.getElementById('reveal-caption');
    var allBtn = document.getElementById('reveal-all');
    var resetBtn = document.getElementById('reveal-reset');
    var ctx = dirt.getContext('2d');
    var COLS = 160;
    var ROWS = 90;
    var BRUSH = 6;
    var dig = { brushing: false, last: null, dabs: 0, cleared: false, touched: false };
    dirt.width = COLS;
    dirt.height = ROWS;

    var cssVar = function (name) {
      return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    var bury = function () {
      var shades = [cssVar('--dirt-1'), cssVar('--dirt-2'), cssVar('--dirt-3'), cssVar('--dirt-4')];
      var pebbles = [cssVar('--pebble-1'), cssVar('--pebble-2')];
      ctx.globalCompositeOperation = 'source-over';
      for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
          /* Rough layers going down, speckled */
          var layer = Math.floor((y / ROWS) * 3 + Math.random() * 0.9);
          var r = Math.random();
          ctx.fillStyle = shades[(layer + (r < 0.25 ? 1 : 0) + (r < 0.06 ? 2 : 0)) % 4];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      for (var p = 0; p < 46; p++) {
        var px = Math.floor(Math.random() * (COLS - 2));
        var py = 1 + Math.floor(Math.random() * (ROWS - 3));
        ctx.fillStyle = pebbles[p % 2];
        ctx.fillRect(px, py, 2, 2);
        if (p % 3 === 0) {
          ctx.fillRect(px + 1, py - 1, 1, 1);
        }
      }
      dirt.classList.remove('is-cleared');
      dig.cleared = false;
      dig.touched = false;
      dig.dabs = 0;
      revealHint.hidden = false;
      revealCaption.hidden = true;
      allBtn.hidden = false;
      resetBtn.hidden = true;
    };

    var uncover = function () {
      dig.cleared = true;
      dig.brushing = false;
      dirt.classList.add('is-cleared');
      revealHint.hidden = true;
      revealCaption.hidden = false;
      allBtn.hidden = true;
      resetBtn.hidden = false;
    };

    /* A round brush made of whole pixels */
    var dab = function (cx, cy) {
      cx = Math.round(cx);
      cy = Math.round(cy);
      for (var dy = -BRUSH; dy <= BRUSH; dy++) {
        for (var dx = -BRUSH; dx <= BRUSH; dx++) {
          if (dx * dx + dy * dy <= BRUSH * BRUSH) {
            ctx.clearRect(cx + dx, cy + dy, 1, 1);
          }
        }
      }
      dig.dabs += 1;
      if (dig.dabs % 8 === 0) {
        var data = ctx.getImageData(0, 0, COLS, ROWS).data;
        var clear = 0;
        for (var k = 3; k < data.length; k += 4) {
          if (data[k] === 0) {
            clear += 1;
          }
        }
        if (clear / (COLS * ROWS) >= 0.6) {
          uncover();
        }
      }
    };

    var stroke = function (from, to) {
      var dist = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
      var steps = Math.max(1, Math.ceil(dist / 2));
      for (var s = 1; s <= steps; s++) {
        dab(from.x + (to.x - from.x) * s / steps, from.y + (to.y - from.y) * s / steps);
        if (dig.cleared) {
          return;
        }
      }
    };

    var toCell = function (e) {
      var r = dirt.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * COLS, y: (e.clientY - r.top) / r.height * ROWS };
    };

    dirt.addEventListener('pointerdown', function (e) {
      if (dig.cleared) {
        return;
      }
      e.preventDefault();
      dig.brushing = true;
      dig.touched = true;
      revealHint.hidden = true;
      dig.last = toCell(e);
      try {
        dirt.setPointerCapture(e.pointerId);
      } catch (err) {
        /* Not every browser allows capture; brushing still works. */
      }
      dab(dig.last.x, dig.last.y);
    });

    dirt.addEventListener('pointermove', function (e) {
      if (!dig.brushing || dig.cleared) {
        return;
      }
      var pt = toCell(e);
      stroke(dig.last, pt);
      dig.last = pt;
    });

    var stopBrushing = function () {
      dig.brushing = false;
      dig.last = null;
    };
    dirt.addEventListener('pointerup', stopBrushing);
    dirt.addEventListener('pointercancel', stopBrushing);
    dirt.addEventListener('lostpointercapture', stopBrushing);

    allBtn.addEventListener('click', uncover);
    resetBtn.addEventListener('click', bury);

    /* Dirt that hasn't been touched yet takes the new colours with the theme. */
    document.addEventListener('paleo-theme', function () {
      if (!dig.touched && !dig.cleared) {
        bury();
      }
    });

    /* No picture, no dig: hide the whole section. */
    revealImg.addEventListener('error', function () {
      var section = reveal.closest('section');
      if (section) {
        section.hidden = true;
      }
    });
    if (revealImg.complete && revealImg.naturalWidth === 0 && revealImg.getAttribute('src')) {
      var section = reveal.closest('section');
      if (section) {
        section.hidden = true;
      }
    }

    bury();
  }
})();
