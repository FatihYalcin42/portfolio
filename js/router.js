const ROUTER_PREFIX = "#/";
const ROUTE_HOME = "/";
const ROUTE_IMPRINT = "/impressum";
const ROUTE_PRIVACY = "/datenschutz";

const homeMainView = document.getElementById("home-main");
const legalMainView = document.getElementById("legal-main-view");
const legalJumpWrap = document.getElementById("legal-jump-wrap");
const legalFooter = document.getElementById("legal-footer");
const legalScreenElements = Array.from(document.querySelectorAll("[data-legal-screen]"));

const getRouterPath = () => {
  const hash = window.location.hash || "";
  if (!hash.startsWith(ROUTER_PREFIX)) {
    return null;
  }
  const rawPath = hash.slice(1).replace(/\/+$/, "");
  return rawPath || ROUTE_HOME;
};

const getLegalScreenFromPath = (path) => {
  if (path === ROUTE_IMPRINT) {
    return "impressum";
  }
  if (path === ROUTE_PRIVACY) {
    return "datenschutz";
  }
  return null;
};

const setElementVisible = (element, isVisible) => {
  if (!element) {
    return;
  }
  element.hidden = !isVisible;
  element.setAttribute("aria-hidden", String(!isVisible));
};

const setLegalScreenVisibility = (activeScreen) => {
  legalScreenElements.forEach((element) => {
    const isVisible = Boolean(activeScreen) && element.dataset.legalScreen === activeScreen;
    element.hidden = !isVisible;
  });
};

const getRouteTitleKey = (legalScreen) => {
  if (legalScreen === "impressum") {
    return "page_title_imprint";
  }
  if (legalScreen === "datenschutz") {
    return "page_title_privacy";
  }
  return "page_title_index";
};

const getTranslatedTitle = (titleKey) =>
  typeof window.t === "function" ? window.t(titleKey) : document.title;

const updateDocumentTitle = (legalScreen) => {
  document.title = getTranslatedTitle(getRouteTitleKey(legalScreen));
};

const closeMenuState = () => {
  document.body.classList.remove("menu-open");
  const menuButton = document.querySelector(".menu-btn");
  const siteMenu = document.getElementById("site-menu");
  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
  }
  if (siteMenu) {
    siteMenu.setAttribute("aria-hidden", "true");
  }
};

const showHomeView = () => {
  setElementVisible(homeMainView, true);
  setElementVisible(legalMainView, false);
  setElementVisible(legalJumpWrap, false);
  setElementVisible(legalFooter, false);
  setLegalScreenVisibility(null);
  document.body.classList.remove("legal-page");
};

const showLegalView = (legalScreen) => {
  setElementVisible(homeMainView, false);
  setElementVisible(legalMainView, true);
  setElementVisible(legalJumpWrap, true);
  setElementVisible(legalFooter, true);
  setLegalScreenVisibility(legalScreen);
  document.body.classList.add("legal-page");
};

const scrollToHashAnchor = () => {
  const hash = window.location.hash || "";
  if (!hash.startsWith("#") || hash.startsWith(ROUTER_PREFIX) || hash.length < 2) {
    return;
  }
  const targetId = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }
  requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start" });
  });
};

const syncRoute = () => {
  const path = getRouterPath();
  const legalScreen = getLegalScreenFromPath(path);
  closeMenuState();
  if (legalScreen) {
    showLegalView(legalScreen);
    updateDocumentTitle(legalScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }
  showHomeView();
  updateDocumentTitle(null);
  if (path === ROUTE_HOME) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }
  scrollToHashAnchor();
};

const initRouter = () => {
  if (
    !homeMainView ||
    !legalMainView ||
    !legalJumpWrap ||
    !legalFooter ||
    !legalScreenElements.length
  ) {
    return;
  }
  if (document.body.dataset.routerBound === "true") {
    return;
  }
  document.body.dataset.routerBound = "true";
  window.addEventListener("hashchange", syncRoute);
  document.addEventListener("portfolio:language-changed", syncRoute);
  syncRoute();
};

window.initRouter = initRouter;
