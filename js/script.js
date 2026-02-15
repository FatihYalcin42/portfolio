const runInitializer = (name) => {
  const initializer = window[name];
  if (typeof initializer === "function") {
    initializer();
  }
};

[
  "initLanguageSwitcher",
  "initRouter",
  "initMenu",
  "initContactForm",
  "initSkillSvgInlining",
  "initSectionArrows",
  "initToTopButton",
  "initPortfolio",
].forEach(runInitializer);
