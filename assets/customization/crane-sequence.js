(function () {
  "use strict";

  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  var section = document.querySelector(".module-pinned-hero");
  var canvas = document.getElementById("craneSequenceCanvas");
  var context = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  var MOBILE_BREAKPOINT = 1024;
  var SCROLL_TRIGGER_ID = "craneSequenceScroll";

  if (!section || !canvas || !context) {
    return;
  }

  var sequenceConfig = {
    frameCount: 5,
    framePath: function (index) {
      return "/assets/images/mobile-sequence-" + (index + 1) + ".jpg";
    }
  };
  var frameState = { index: 0 };
  var frames = [];
  var firstLottie = document.getElementById("firstLottie");
  var lottieLoader = document.getElementById("lottie-loader");
  var resizeRaf = null;
  var mode = getViewportMode();
  var activeTween = null;
  var activeRequest = 0;

  if (firstLottie) {
    firstLottie.hidden = true;
    firstLottie.setAttribute("aria-hidden", "true");
  }

  if (lottieLoader) {
    lottieLoader.remove();
  }

  function drawCover(image) {
    if (!image || !canvas.width || !canvas.height) {
      return;
    }

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var imageWidth = image.naturalWidth || image.width;
    var imageHeight = image.naturalHeight || image.height;

    if (!imageWidth || !imageHeight) {
      return;
    }

    var scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
    var drawWidth = imageWidth * scale;
    var drawHeight = imageHeight * scale;
    var offsetX = (canvasWidth - drawWidth) / 2;
    var offsetY = (canvasHeight - drawHeight) / 2;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }

  function drawFrame(index) {
    var clamped = Math.max(0, Math.min(frames.length - 1, index));
    var frame = frames[clamped];
    if (frame && frame.complete) {
      drawCover(frame);
    }
  }

  function getViewportMode() {
    return window.innerWidth <= MOBILE_BREAKPOINT ? "mobile" : "desktop";
  }

  function readSequence(key) {
    var media = window.SITE_CONFIG && window.SITE_CONFIG.media;
    if (!media || !Array.isArray(media[key]) || !media[key].length) {
      return null;
    }
    return media[key].slice();
  }

  function getFrameUrlsForMode(viewportMode) {
    var modeSpecific =
      viewportMode === "mobile" ? readSequence("craneSequenceMobile") : readSequence("craneSequenceDesktop");

    var configuredFrames = modeSpecific || readSequence("craneSequence") || readSequence("mobileSequence");

    if (configuredFrames && configuredFrames.length) {
      return configuredFrames;
    }

    return Array.from({ length: sequenceConfig.frameCount }, function (_, index) {
      return sequenceConfig.framePath(index);
    });
  }

  function clearExistingSequence() {
    if (activeTween) {
      activeTween.kill();
      activeTween = null;
    }

    var previousTrigger = ScrollTrigger.getById(SCROLL_TRIGGER_ID);
    if (previousTrigger) {
      previousTrigger.kill();
    }
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var targetWidth = Math.max(1, Math.floor(rect.width * dpr));
    var targetHeight = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    drawFrame(Math.round(frameState.index));
  }

  function preloadFrames(urls) {
    return Promise.all(
      urls.map(function (url, index) {
        return new Promise(function (resolve) {
          var image = new Image();
          image.decoding = "async";
          image.loading = "eager";
          image.onload = function () {
            resolve({ ok: true, index: index, image: image });
          };
          image.onerror = function () {
            resolve({ ok: false, index: index, image: null });
          };
          image.src = url;
        });
      })
    );
  }

  function setupSequenceForMode(viewportMode) {
    var requestId = ++activeRequest;
    var frameUrls = getFrameUrlsForMode(viewportMode);

    clearExistingSequence();

    preloadFrames(frameUrls).then(function (results) {
      if (requestId !== activeRequest) {
        return;
      }

    var hasAnyFrame = false;
    frames = new Array(frameUrls.length);

    results.forEach(function (result) {
      if (result.ok) {
        frames[result.index] = result.image;
        hasAnyFrame = true;
      }
    });

    if (!hasAnyFrame) {
      return;
    }

    var firstAvailableIndex = frames.findIndex(function (frame) {
      return !!frame;
    });

    if (firstAvailableIndex < 0) {
      return;
    }

    frameState.index = firstAvailableIndex;

    resizeCanvas();

    activeTween = gsap.to(frameState, {
      index: frames.length - 1,
      ease: "none",
      snap: { index: 1 },
      onUpdate: function () {
        drawFrame(Math.round(frameState.index));
      },
      scrollTrigger: {
        id: SCROLL_TRIGGER_ID,
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + Math.max(window.innerHeight * 2.4, 2200);
        },
        pin: section.querySelector(".container") || section,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    });
  }

  setupSequenceForMode(mode);

  window.addEventListener("resize", function () {
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf);
    }

    resizeRaf = requestAnimationFrame(function () {
      var nextMode = getViewportMode();

      if (nextMode !== mode) {
        mode = nextMode;
        setupSequenceForMode(mode);
      } else {
        resizeCanvas();
        ScrollTrigger.refresh();
      }
    });
  });
})();
