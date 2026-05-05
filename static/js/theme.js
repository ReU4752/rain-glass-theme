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

  function getDirectChildByTag(parent, tagName) {
    var children = parent ? parent.children : [];
    var index;

    for (index = 0; index < children.length; index += 1) {
      if (children[index].tagName === tagName) {
        return children[index];
      }
    }

    return null;
  }

  function getHeadingFromHash(hash) {
    var rawId;
    var decodedId;

    if (!hash || hash === "#") {
      return null;
    }

    rawId = hash.slice(1);
    decodedId = rawId;

    try {
      decodedId = decodeURIComponent(rawId);
    } catch (error) {
      decodedId = rawId;
    }

    return document.getElementById(decodedId) || document.getElementById(rawId);
  }

  function getTocLinkTarget(link) {
    var href = link ? link.getAttribute("href") : "";
    var hashIndex = href ? href.indexOf("#") : -1;

    if (hashIndex === -1) {
      return null;
    }

    return getHeadingFromHash(href.slice(hashIndex));
  }

  function getTocLabel(link) {
    var text = link ? link.textContent : "";

    text = text.replace(/\s+/g, " ").trim();
    return text || "section";
  }

  function syncTocToggleButton(item, button, link) {
    var collapsed = item.classList.contains("is-collapsed");
    var action = collapsed ? "Expand " : "Collapse ";

    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    button.setAttribute("aria-label", action + getTocLabel(link));
  }

  function bootTocNavigation() {
    var toc = document.getElementById("TableOfContents");
    var items;
    var links;
    var entries = [];
    var syncFrame = 0;
    var index;

    if (!toc || toc.getAttribute("data-navigation-booted") === "true") {
      return;
    }

    toc.setAttribute("data-navigation-booted", "true");
    items = toc.querySelectorAll("li");

    for (index = 0; index < items.length; index += 1) {
      (function (item, itemIndex) {
        var link = getDirectChildByTag(item, "A");
        var childList = getDirectChildByTag(item, "UL");
        var row;
        var button;

        if (!link) {
          return;
        }

        row = document.createElement("div");
        row.className = "toc-item-row";
        item.insertBefore(row, link);
        row.appendChild(link);

        if (!childList) {
          return;
        }

        item.classList.add("has-children");

        if (!childList.id) {
          childList.id = "toc-sublist-" + itemIndex;
        }

        button = document.createElement("button");
        button.className = "toc-toggle";
        button.type = "button";
        button.setAttribute("aria-controls", childList.id);
        syncTocToggleButton(item, button, link);

        button.addEventListener("click", function () {
          item.classList.toggle("is-collapsed");
          syncTocToggleButton(item, button, link);
        });

        row.insertBefore(button, link);
      })(items[index], index);
    }

    links = toc.querySelectorAll("a[href*='#']");

    for (index = 0; index < links.length; index += 1) {
      (function (link) {
        var target = getTocLinkTarget(link);

        if (target) {
          entries.push({
            link: link,
            heading: target
          });
        }
      })(links[index]);
    }

    if (!entries.length) {
      return;
    }

    function getCurrentEntry() {
      var marker = Math.min(170, Math.max(96, window.innerHeight * 0.18));
      var current = entries[0];
      var entryIndex;

      for (entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
        if (entries[entryIndex].heading.getBoundingClientRect().top <= marker) {
          current = entries[entryIndex];
        } else {
          break;
        }
      }

      return current;
    }

    function clearCurrentState() {
      var activeLinks = toc.querySelectorAll(".is-active");
      var ancestorItems = toc.querySelectorAll(".is-current-ancestor");
      var stateIndex;

      for (stateIndex = 0; stateIndex < activeLinks.length; stateIndex += 1) {
        activeLinks[stateIndex].classList.remove("is-active");
        activeLinks[stateIndex].removeAttribute("aria-current");
      }

      for (stateIndex = 0; stateIndex < ancestorItems.length; stateIndex += 1) {
        ancestorItems[stateIndex].classList.remove("is-current-ancestor");
      }
    }

    function setCurrentEntry(entry) {
      var currentItem;
      var ancestorItem;

      clearCurrentState();

      entry.link.classList.add("is-active");
      entry.link.setAttribute("aria-current", "location");

      currentItem = entry.link.closest("li");
      ancestorItem = currentItem && currentItem.parentElement
        ? currentItem.parentElement.closest("li")
        : null;

      while (ancestorItem && toc.contains(ancestorItem)) {
        ancestorItem.classList.add("is-current-ancestor");
        ancestorItem = ancestorItem.parentElement
          ? ancestorItem.parentElement.closest("li")
          : null;
      }
    }

    function syncCurrentEntry() {
      syncFrame = 0;
      setCurrentEntry(getCurrentEntry());
    }

    function requestCurrentSync() {
      if (syncFrame) {
        return;
      }

      syncFrame = window.requestAnimationFrame(syncCurrentEntry);
    }

    window.addEventListener("scroll", requestCurrentSync, { passive: true });
    window.addEventListener("resize", requestCurrentSync);
    window.addEventListener("hashchange", requestCurrentSync);
    window.addEventListener("load", requestCurrentSync, { once: true });
    requestCurrentSync();

    window.addEventListener("pagehide", function () {
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }

      window.removeEventListener("scroll", requestCurrentSync);
      window.removeEventListener("resize", requestCurrentSync);
      window.removeEventListener("hashchange", requestCurrentSync);
    }, { once: true });
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
      window.requestAnimationFrame(bootTocNavigation);
    });
  } else {
    window.requestAnimationFrame(bootRain);
    window.requestAnimationFrame(bootHomeSidebarCollapse);
    window.requestAnimationFrame(bootTocNavigation);
  }
})();
