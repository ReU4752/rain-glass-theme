(function () {
  function applyBackground(target) {
    if (!target) {
      return;
    }

    var background = target.dataset.bg;
    if (background) {
      target.style.backgroundImage = "url('" + background + "')";
    }
  }

  function getConstructor() {
    if (typeof RaindropFX === "function") {
      return RaindropFX;
    }
    if (typeof window !== "undefined" && typeof window.RaindropFX === "function") {
      return window.RaindropFX;
    }
    return null;
  }

  function getCanvasSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(1, Math.round(rect.width || window.innerWidth || 1));
    var height = Math.max(1, Math.round(rect.height || window.innerHeight || 1));
    return { width: width, height: height };
  }

  function bootRain() {
    var backdrop = document.getElementById("rain-backdrop");
    var canvas = document.getElementById("raindrop-canvas");
    if (!canvas) {
      return;
    }

    applyBackground(backdrop);
    applyBackground(canvas);
    document.body.classList.remove("rain-starting");
    document.body.classList.remove("rain-ready");

    if (!document.body || document.body.dataset.raindropDisabled === "true") {
      return;
    }

    var Rain = getConstructor();
    if (!Rain) {
      return;
    }

    try {
      var size = getCanvasSize(canvas);
      canvas.width = size.width;
      canvas.height = size.height;

      var fx = new Rain({
        canvas: canvas,
        width: size.width,
        height: size.height,
        background: canvas.dataset.bg,
        mist: true,
        backgroundBlurSteps: 2,
        mistBlurStep: 3,
        dropletsPerSeconds: 90,
        dropletSize: [22, 48]
      });

      document.body.classList.add("rain-starting");

      fx.start().then(function () {
        document.body.classList.add("rain-ready");
      }).catch(function (error) {
        document.body.classList.remove("rain-starting");
        console.error("raindrop-fx asset load failed", error);
      });

      window.addEventListener("resize", function () {
        var nextSize = getCanvasSize(canvas);
        canvas.width = nextSize.width;
        canvas.height = nextSize.height;
        if (fx && typeof fx.resize === "function") {
          fx.resize(nextSize.width, nextSize.height);
        }
      });
    } catch (error) {
      console.warn("raindrop-fx init failed", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.requestAnimationFrame(bootRain);
    });
  } else {
    window.requestAnimationFrame(bootRain);
  }
})();
