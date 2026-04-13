(function () {
  function bindMediaQueryChange(query, handler) {
    if (!query) {
      return function () {};
    }

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler);
      return function () {
        query.removeEventListener("change", handler);
      };
    }

    if (typeof query.addListener === "function") {
      query.addListener(handler);
      return function () {
        query.removeListener(handler);
      };
    }

    return function () {};
  }

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

  function bootHomeSidebarCollapse() {
    var homeLayout = document.querySelector(".home-layout");
    var homeSidebarTrack = homeLayout ? homeLayout.querySelector(".home-sidebar-track") : null;
    var homeSidebar = homeSidebarTrack ? homeSidebarTrack.querySelector(".home-sidebar") : null;
    var desktopQuery;
    var unbindDesktopChange;
    var collapseThreshold = 0;
    var syncFrame = 0;

    if (!homeLayout || !homeSidebarTrack || !homeSidebar) {
      return;
    }

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    desktopQuery = window.matchMedia("(min-width: 981px)");

    function setCollapsed(nextCollapsed) {
      homeLayout.classList.toggle("is-sidebar-collapsed", nextCollapsed);
    }

    function getScrollTop() {
      return window.scrollY || window.pageYOffset || 0;
    }

    function measureCollapseThreshold() {
      var wasCollapsed = homeLayout.classList.contains("is-sidebar-collapsed");
      var trackRect;

      if (wasCollapsed) {
        homeLayout.classList.remove("is-sidebar-collapsed");
      }

      trackRect = homeSidebarTrack.getBoundingClientRect();
      collapseThreshold = getScrollTop() + trackRect.top + trackRect.height;

      if (wasCollapsed) {
        homeLayout.classList.add("is-sidebar-collapsed");
      }
    }

    function syncCollapsedState() {
      if (!desktopQuery.matches) {
        setCollapsed(false);
        return;
      }

      if (!collapseThreshold) {
        measureCollapseThreshold();
      }

      setCollapsed(getScrollTop() >= collapseThreshold);
    }

    function requestSync() {
      if (syncFrame) {
        return;
      }

      syncFrame = window.requestAnimationFrame(function () {
        syncFrame = 0;
        syncCollapsedState();
      });
    }

    function handleViewportChange() {
      measureCollapseThreshold();
      syncCollapsedState();
    }

    unbindDesktopChange = bindMediaQueryChange(desktopQuery, handleViewportChange);
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("load", handleViewportChange, { once: true });
    handleViewportChange();

    window.addEventListener("pagehide", function () {
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }

      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", handleViewportChange);
      unbindDesktopChange();
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.requestAnimationFrame(bootRain);
      window.requestAnimationFrame(bootHomeSidebarCollapse);
    });
  } else {
    window.requestAnimationFrame(bootRain);
    window.requestAnimationFrame(bootHomeSidebarCollapse);
  }
})();
