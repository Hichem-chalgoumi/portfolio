$(document).ready(function () {

  /* === LANGUAGE === */
  var currentLang = 'fr';

  function applyTranslations(lang) {
    currentLang = lang;
    $('[data-i18n]').each(function () {
      var key = $(this).data('i18n');
      var val = translations[lang] && translations[lang][key];
      if (val !== undefined) {
        if ($(this).is('input, textarea')) {
          $(this).attr('placeholder', val);
        } else {
          $(this).html(val);
        }
      }
    });
    $('.lang-btn').removeClass('active');
    $('.lang-btn[data-lang="' + lang + '"]').addClass('active');
    $('html').attr('lang', lang);
    try { localStorage.setItem('hc-lang', lang); } catch(e){}
  }

  $('.lang-btn').on('click', function () {
    applyTranslations($(this).data('lang'));
  });

  var savedLang = 'fr';
  try { savedLang = localStorage.getItem('hc-lang') || 'fr'; } catch(e){}
  applyTranslations(savedLang);


  /* === DARK / LIGHT MODE === */
  var isDark = true;
  try { isDark = localStorage.getItem('hc-theme') !== 'light'; } catch(e){}

  function applyTheme() {
    if (isDark) {
      $('body').removeClass('light-mode');
      $('#theme-icon').attr('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
    } else {
      $('body').addClass('light-mode');
      $('#theme-icon').attr('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    }
    try { localStorage.setItem('hc-theme', isDark ? 'dark' : 'light'); } catch(e){}
  }

  $('#theme-toggle').on('click', function () {
    isDark = !isDark;
    applyTheme();
  });
  applyTheme();


  /* === MOBILE MENU === */
  $('#menu-toggle').on('click', function () {
    $('#mobile-menu').toggleClass('open');
    $(this).toggleClass('active');
  });
  $('#mobile-menu a').on('click', function () {
    $('#mobile-menu').removeClass('open');
    $('#menu-toggle').removeClass('active');
  });


  /* === SMOOTH SCROLL === */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var target = $(this).attr('href');
    if ($(target).length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $(target).offset().top - 70 }, 650);
    }
  });


  /* === NAVBAR SCROLL === */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }
    highlightActive();
    revealElements();
  });

  function highlightActive() {
    var scrollPos = $(window).scrollTop() + 100;
    $('section[id]').each(function () {
      var top = $(this).offset().top;
      var bottom = top + $(this).outerHeight();
      var id = $(this).attr('id');
      if (scrollPos >= top && scrollPos < bottom) {
        $('.nav-link').removeClass('active');
        $('.nav-link[href="#' + id + '"]').addClass('active');
      }
    });
  }


  /* === TYPEWRITER === */
  var titlesMap = {
    fr: ['Expert WordPress', 'Développeur PHP Senior', 'Expert PrestaShop', 'Expert Drupal & Magento', 'Solutions sur mesure'],
    en: ['WordPress Expert', 'Senior PHP Developer', 'PrestaShop Expert', 'Drupal & Magento Expert', 'Custom Solutions']
  };
  var twIndex = 0, twChar = 0, twDeleting = false;

  function typeWrite() {
    var list = titlesMap[currentLang] || titlesMap.fr;
    var current = list[twIndex % list.length];
    var el = document.getElementById('typewriter');
    if (!el) return;

    if (twDeleting) {
      el.textContent = current.substring(0, twChar - 1);
      twChar--;
    } else {
      el.textContent = current.substring(0, twChar + 1);
      twChar++;
    }

    var speed = twDeleting ? 60 : 110;
    if (!twDeleting && twChar === current.length) { twDeleting = true; speed = 2000; }
    else if (twDeleting && twChar === 0) { twDeleting = false; twIndex++; speed = 400; }

    setTimeout(typeWrite, speed);
  }
  typeWrite();


  /* === COUNTERS === */
  var countersRun = false;
  function runCounters() {
    if (countersRun) return;
    countersRun = true;
    function animCount(id, end, suffix) {
      var $el = $(id);
      $({ n: 0 }).animate({ n: end }, {
        duration: 2000,
        step: function () { $el.text(Math.ceil(this.n) + suffix); },
        complete: function () { $el.text(end + suffix); }
      });
    }
    animCount('#counter-years', 14, '');
    animCount('#counter-projects', 200, '+');
    animCount('#counter-countries', 4, '');
  }


  /* === SCROLL REVEAL + SKILLS === */
  var skillsAnimated = false;

  function revealElements() {
    var vp = $(window).scrollTop() + $(window).height();

    $('.reveal').each(function () {
      if (vp > $(this).offset().top + 50) {
        $(this).addClass('revealed');
      }
    });

    var $stats = $('#stats');
    if ($stats.length && vp > $stats.offset().top + 50) runCounters();

    if (!skillsAnimated) {
      var $skills = $('#skills');
      if ($skills.length && vp > $skills.offset().top + 100) {
        skillsAnimated = true;
        $('.skill-fill').each(function () {
          var pct = $(this).data('pct');
          $(this).animate({ width: pct + '%' }, { duration: 1200 });
        });
      }
    }
  }

  revealElements();


  /* === PROJECTS FILTER === */
  $('.filter-btn').on('click', function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    var filter = $(this).data('filter');

    if (filter === 'all') {
      $('.project-card').fadeIn(250);
    } else {
      $('.project-card').fadeOut(150);
      setTimeout(function () {
        $('.project-card[data-cat="' + filter + '"]').fadeIn(300);
      }, 200);
    }
  });


  /* === PROJECT MODAL === */
  $(document).on('click', '.project-card', function () {
    var title = $(this).data('title');
    var type = $(this).data('type');
    var desc = $(this).data('desc');
    var tags = $(this).data('tags') || '';
    var color = $(this).data('color') || '#1a2a3a';

    $('#modal-title').text(title);
    $('#modal-type').text(type);
    $('#modal-desc').text(desc);
    $('#modal-image').css('background', 'linear-gradient(135deg, ' + color + ' 0%, #0a0d14 100%)');

    var tagArr = tags.split(',');
    var tagsHtml = '';
    for (var i = 0; i < tagArr.length; i++) {
      var t = tagArr[i].trim();
      if (t) tagsHtml += '<span class="tag">' + t + '</span>';
    }
    $('#modal-tags').html(tagsHtml);

    $('#project-modal').addClass('open');
    $('body').css('overflow', 'hidden');
  });

  $('#modal-close, #modal-backdrop').on('click', function () {
    $('#project-modal').removeClass('open');
    $('body').css('overflow', '');
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('#project-modal').removeClass('open');
      $('body').css('overflow', '');
    }
  });


  /* === CONTACT FORM === */
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    var name = $('#c-name').val();
    var email = $('#c-email').val();
    var message = $('#c-message').val();
    if (!name || !email || !message) return;

    var subject = encodeURIComponent('Contact Portfolio - ' + name);
    var body = encodeURIComponent('Bonjour Hichem,\n\n' + message + '\n\n---\nDe : ' + name + '\nEmail : ' + email);
    window.location.href = 'mailto:hichem.chalgoumi.apple@gmail.com?subject=' + subject + '&body=' + body;
    this.reset();
  });


  /* === CURSOR GLOW === */
  if (window.matchMedia('(pointer: fine)').matches) {
    var $glow = $('<div id="cursor-glow"></div>').appendTo('body');
    $(document).on('mousemove', function (e) {
      $glow.css({ left: e.clientX, top: e.clientY });
    });
  }

});
