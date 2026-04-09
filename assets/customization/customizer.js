(function () {
  "use strict";

  var STORAGE_KEY = "sola.siteConfig";
  var defaultConfig = window.SITE_CONFIG || {};
  var activeConfig = null;

  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function deepMerge(base, override) {
    if (Array.isArray(base)) {
      return Array.isArray(override) ? override.slice() : base.slice();
    }

    if (!isObject(base)) {
      return typeof override === "undefined" ? base : override;
    }

    var result = {};
    Object.keys(base).forEach(function (key) {
      result[key] = deepMerge(base[key], override && override[key]);
    });

    if (isObject(override)) {
      Object.keys(override).forEach(function (key) {
        if (typeof base[key] === "undefined") {
          result[key] = override[key];
        }
      });
    }

    return result;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readStoredConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function saveStoredConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      // Ignore storage errors.
    }
  }

  function text(el, value) {
    if (el && typeof value === "string") {
      el.textContent = value;
    }
  }

  function html(el, value) {
    if (el && typeof value === "string") {
      el.innerHTML = value;
    }
  }

  function setAttr(el, name, value) {
    if (el && typeof value === "string" && value.length > 0) {
      el.setAttribute(name, value);
    }
  }

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function setTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    if (theme.accent) root.style.setProperty("--brand-accent", theme.accent);
    if (theme.accentDark) root.style.setProperty("--brand-accent-dark", theme.accentDark);
    if (theme.textPrimary) root.style.setProperty("--brand-text-primary", theme.textPrimary);
    if (theme.textSecondary) root.style.setProperty("--brand-text-secondary", theme.textSecondary);
    if (theme.background) root.style.setProperty("--brand-background", theme.background);
  }

  function setBranding(branding) {
    if (!branding) return;
    if (branding.siteTitle) {
      document.title = branding.siteTitle;
    }
    var logoLinks = document.querySelectorAll(".logo a");
    logoLinks.forEach(function (logo) {
      text(logo, branding.logoText || branding.siteTitle);
      setAttr(logo, "href", branding.logoHref || "/");
    });

    var favicon = document.querySelector("link[rel='icon']");
    setAttr(favicon, "href", branding.favicon);
  }

  function setSeo(seo, branding) {
    if (!seo) return;

    var mappings = [
      ["meta[name='description']", seo.description],
      ["meta[property='og:title']", seo.ogTitle || branding.siteTitle],
      ["meta[property='og:description']", seo.ogDescription || seo.description],
      ["meta[name='twitter:title']", seo.twitterTitle || branding.siteTitle],
      ["meta[name='twitter:description']", seo.twitterDescription || seo.description]
    ];

    mappings.forEach(function (entry) {
      var node = document.querySelector(entry[0]);
      if (node && typeof entry[1] === "string") {
        node.setAttribute("content", entry[1]);
      }
    });
  }

  function setHero(hero, media) {
    var heroTitle = document.querySelector(".home-main-hero .title");
    var heroSubtitle = document.querySelector(".home-main-hero .description p");
    text(heroTitle, hero && hero.title);
    text(heroSubtitle, hero && hero.subtitle);

    var heroSection = document.querySelector(".home-main-hero");
    if (heroSection && media && media.heroPoster) {
      heroSection.style.backgroundImage = "url('" + media.heroPoster + "')";
    }

    var heroVideo = document.getElementById("home-hero-video");
    if (heroVideo && media) {
      setAttr(heroVideo, "data-desk-url", media.heroDeskVideo);
      setAttr(heroVideo, "data-mob-url", media.heroMobileVideo);
    }
  }

  function setMission(mission) {
    if (!mission) return;
    text(document.querySelector(".hero-mission .line-1"), mission.line1);
    text(document.querySelector(".hero-mission .line-2"), mission.line2);
    text(document.querySelector(".hero-mission .line-3"), mission.line3);
    text(document.querySelector(".hero-mission .line-4"), mission.line4);
    text(document.querySelector(".hero-mission .line-5"), mission.line5);
  }

  function setSectionIntro(sectionIntro) {
    if (!sectionIntro) return;
    text(document.querySelector(".safer-section h2"), sectionIntro.title);
    text(document.querySelector(".safer-section p"), sectionIntro.body);
  }

  function setPinnedSlides(slides, media) {
    if (!Array.isArray(slides)) return;

    var mobileDescriptions = document.querySelectorAll(".mobile-sequence .slide .description.f40 p");
    var foregroundDescriptions = document.querySelectorAll(".foreground .pinned-section .description.f40 p");

    slides.forEach(function (slideText, index) {
      if (mobileDescriptions[index]) html(mobileDescriptions[index], slideText);
      if (foregroundDescriptions[index]) html(foregroundDescriptions[index], slideText);
    });

    if (media && Array.isArray(media.mobileSequence)) {
      var mobileFrames = document.querySelectorAll(".mobile-sequence .mobile-frame");
      mobileFrames.forEach(function (frame, index) {
        var source = media.mobileSequence[index];
        if (source) {
          setAttr(frame, "data-src", source);
          setAttr(frame, "src", source);
        }
      });
    }
  }

  function setCTA(cta) {
    if (!cta) return;
    var watchButtons = document.querySelectorAll("a.button.video");
    var learnButtons = document.querySelectorAll("a.button.ghost");

    watchButtons.forEach(function (btn) {
      text(btn, cta.watchVideoLabel);
      setAttr(btn, "href", cta.watchVideoHref);
    });

    learnButtons.forEach(function (btn) {
      text(btn, cta.learnMoreLabel);
      setAttr(btn, "href", cta.learnMoreHref);
    });
  }

  function setSafety(safety, media) {
    if (!safety) return;
    var section = document.querySelector(".module-hero.hero-center-text");
    if (!section) return;

    text(section.querySelector("h1 .heading p"), safety.title);
    html(section.querySelector("h2 .subheading p"), safety.subtitle);

    var button = section.querySelector(".button-group a");
    text(button, safety.buttonLabel);
    setAttr(button, "href", safety.buttonHref);

    if (media && media.safetyMobileBg) {
      var bgContainer = section.querySelector(".container.js-lazy-bg");
      setAttr(bgContainer, "data-bg", media.safetyMobileBg);
    }
  }

  function setSolar(solar, media) {
    if (!solar) return;
    var section = document.querySelector(".module-hero.solar");
    if (!section) return;

    text(section.querySelector("h1 .heading p"), solar.title);
    html(section.querySelector("h2 .subheading p"), solar.subtitle);

    var button = section.querySelector(".button-group a");
    text(button, solar.buttonLabel);
    setAttr(button, "href", solar.buttonHref);

    if (media) {
      var bgContainer = section.querySelector(".container.js-lazy-bg");
      setAttr(bgContainer, "data-bg", media.solarMobileBg);

      var solarLottie = document.getElementById("solarLottie");
      setAttr(solarLottie, "data-lottie", media.solarLottie);
    }
  }

  function setNavigation(navigation) {
    if (!navigation || !navigation.links) return;
    var linksMap = navigation.links;
    var navLinks = document.querySelectorAll("header nav a, footer nav a");
    navLinks.forEach(function (link) {
      var key = normalizeText(link.textContent);
      if (linksMap[key]) {
        setAttr(link, "href", linksMap[key]);
      }
    });
  }

  function setSocial(social) {
    if (!social) return;
    setAttr(document.querySelector(".social a.youtube"), "href", social.youtube);
    setAttr(document.querySelector(".social a.linkedin"), "href", social.linkedin);
    setAttr(document.querySelector(".social a.x"), "href", social.x);
    setAttr(document.querySelector(".social a.instagram"), "href", social.instagram);
  }

  function setLegal(legal) {
    if (!legal) return;
    var complianceLinks = document.querySelectorAll(".navigation-compliance a");
    complianceLinks.forEach(function (link) {
      var key = normalizeText(link.textContent);
      if (legal.links && legal.links[key]) {
        setAttr(link, "href", legal.links[key]);
      }
    });

    var legalText = document.querySelector(".intellectual-property");
    text(legalText, legal.text);
  }

  function applyConfig(config) {
    setTheme(config.theme);
    setBranding(config.branding || {});
    setSeo(config.seo || {}, config.branding || {});
    setHero(config.hero, config.media);
    setMission(config.mission);
    setSectionIntro(config.sectionIntro);
    setPinnedSlides(config.pinnedSlides, config.media);
    setCTA(config.cta);
    setSafety(config.safety, config.media);
    setSolar(config.solar, config.media);
    setNavigation(config.navigation);
    setSocial(config.social);
    setLegal(config.legal);
  }

  function emitUpdateEvent() {
    window.dispatchEvent(new CustomEvent("site-config-updated", { detail: clone(activeConfig) }));
  }

  function initializeConfig() {
    var stored = readStoredConfig();
    activeConfig = stored ? deepMerge(defaultConfig, stored) : clone(defaultConfig);
    applyConfig(activeConfig);
    emitUpdateEvent();
  }

  window.__getSiteConfig = function () {
    return clone(activeConfig);
  };

  window.__setSiteConfig = function (nextConfig, options) {
    if (!isObject(nextConfig)) return false;

    options = options || {};
    activeConfig = deepMerge(defaultConfig, nextConfig);
    applyConfig(activeConfig);

    if (options.persist) {
      saveStoredConfig(activeConfig);
    }

    emitUpdateEvent();
    return true;
  };

  window.__resetSiteConfig = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // Ignore storage errors.
    }
    activeConfig = clone(defaultConfig);
    applyConfig(activeConfig);
    emitUpdateEvent();
    return clone(activeConfig);
  };

  initializeConfig();
})();
