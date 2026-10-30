const productDetails = {
  creme: {
    name: "NIVEA Creme",
    kicker: "THE ORIGINAL · FACE & BODY",
    description: "A familiar classic for face, hands and body. Comforting care that has found its way into everyday moments for generations.",
    category: "face body",
  },
  soft: {
    name: "NIVEA Soft",
    kicker: "LIGHT & LOVELY · FACE",
    description: "A light, refreshing moisturiser for the moments you want your skin to feel soft, cared for and ready for the day.",
    category: "face",
  },
  lotion: {
    name: "Nourishing Body Milk",
    kicker: "DEEP NOURISHMENT · BODY",
    description: "A comforting body moisturiser to bring a little softness to your everyday care ritual.",
    category: "body",
  },
  men: {
    name: "NIVEA Men Creme",
    kicker: "NO-FUSS, ALL CARE · MEN",
    description: "Easy, everyday moisturising care made for face, hands and body. A simple step that feels good.",
    category: "men",
  },
  sun: {
    name: "Sun Protect",
    kicker: "OUT THERE, GENTLY · SUN",
    description: "A caring companion for days outdoors. Explore sun care designed to help protect your skin.",
    category: "sun",
  },
};

const productCards = [...document.querySelectorAll(".product-card")];
const filters = [...document.querySelectorAll(".filter-chip")];
const productDialog = document.querySelector("#product-dialog");
const dialogArt = document.querySelector("#dialog-art");
const dialogTitle = document.querySelector("#dialog-title");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogDescription = document.querySelector("#dialog-description");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    productCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const visible = category === "all" || categories.includes(category);
      card.classList.toggle("is-hidden", !visible);
      card.setAttribute("aria-hidden", String(!visible));
      card.tabIndex = visible ? 0 : -1;
    });
  });
});

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    const product = productDetails[card.dataset.product];
    if (!product) return;
    const art = card.querySelector(".product-art").cloneNode(true);
    art.classList.remove("product-art--feature");
    dialogArt.replaceChildren(art);
    dialogTitle.textContent = product.name;
    dialogKicker.textContent = product.kicker;
    dialogDescription.textContent = product.description;
    productDialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
productDialog.querySelector(".dialog-cta").addEventListener("click", () => productDialog.close());

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  primaryNav.classList.toggle("is-open", !isOpen);
});
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});

const progress = document.querySelector(".scroll-progress");
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
};
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lenis;
if (!reducedMotion.matches && window.Lenis && window.gsap && window.ScrollTrigger) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  lenis = new window.Lenis({
    autoRaf: false,
    anchors: true,
    duration: 1.15,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.075,
    touchInertiaMultiplier: 20,
    wheelMultiplier: 0.82,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  const particleDrift = gsap.quickTo(".lotion-particles", "y", { duration: 0.55, ease: "power2.out" });
  const particleGlow = gsap.quickTo(".lotion-particles", "opacity", { duration: 0.55, ease: "power2.out" });
  lenis.on("scroll", ({ velocity }) => {
    const scrollEnergy = Math.min(Math.abs(velocity) / 42, 1);
    particleDrift(-scrollEnergy * 9);
    particleGlow(0.28 + scrollEnergy * 0.42);
  });

  const lotionStory = document.querySelector(".lotion-story");
  const lotionStage = document.querySelector(".lotion-stage");
  const creamTrail = document.querySelector(".cream-trail-path");
  const creamShadow = document.querySelector(".cream-trail-shadow");
  const creamLength = creamTrail.getTotalLength();
  const lotionTitle = document.querySelector("#lotion-title");
  const lotionDescription = document.querySelector("#lotion-description");
  const lotionImageStep = document.querySelector("#lotion-image-step");
  const lotionProgressFill = document.querySelector("#lotion-progress-fill");
  const lotionLabels = [...document.querySelectorAll(".lotion-step-labels span")];
  const lotionChapters = [
    {
      title: "A little<br />goes a <em>long way.</em>",
      description: "Take a breath. Let the day slow down. Feel care move at your own pace.",
      imageStep: "A softer feeling, starts here",
    },
    {
      title: "Let care<br />find its <em>flow.</em>",
      description: "A little warmth, a gentle touch. Make room for the care your skin knows.",
      imageStep: "Gently, in your own time",
    },
    {
      title: "Softness<br />settles <em>in.</em>",
      description: "And just like that, the moment is yours. Carry a little softness with you.",
      imageStep: "The day feels softer already",
    },
  ];
  let activeChapter = -1;

  gsap.set(creamTrail, { strokeDasharray: creamLength, strokeDashoffset: creamLength });
  gsap.set(creamShadow, { strokeDasharray: creamLength, strokeDashoffset: creamLength });
  gsap.set(".cream-bead", { opacity: 0, scale: 0.45, transformOrigin: "center" });
  gsap.set(".skin-light", { opacity: 0.04, scale: 0.7, transformOrigin: "center" });

  const sequence = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate() {
      const progressValue = this.progress();
      const chapterIndex = Math.min(2, Math.floor(progressValue * 3));
      if (chapterIndex !== activeChapter) {
        activeChapter = chapterIndex;
        const chapter = lotionChapters[chapterIndex];
        gsap.fromTo([lotionTitle, lotionDescription, lotionImageStep],
          { autoAlpha: 0.45, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.035,
            overwrite: true,
            onStart() {
              lotionTitle.innerHTML = chapter.title;
              lotionDescription.textContent = chapter.description;
              lotionImageStep.textContent = chapter.imageStep;
            },
          },
        );
        lotionLabels.forEach((label, index) => label.classList.toggle("is-current", index === chapterIndex));
      }
      gsap.set(lotionProgressFill, { scaleX: progressValue });
    },
    scrollTrigger: {
      trigger: lotionStory,
      pin: lotionStage,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  sequence
    .to(creamShadow, { strokeDashoffset: 0, duration: 0.72 }, 0.08)
    .to(creamTrail, { strokeDashoffset: 0, duration: 0.72 }, 0.08)
    .to(".lotion-image-glow", { opacity: 0.8, scale: 1.15, duration: 0.82 }, 0.08)
    .to(".skin-light--one", { opacity: 0.72, scale: 1.1, duration: 0.8 }, 0.2)
    .to(".skin-light--two", { opacity: 0.54, scale: 1.08, duration: 0.75 }, 0.38)
    .to(".lotion-image-base", { filter: "brightness(1.05) saturate(1.04) contrast(.96)", scale: 1.09, duration: 0.86 }, 0.1)
    .to(".cream-bead--one", { opacity: 0.82, scale: 1, duration: 0.2 }, 0.35)
    .to(".cream-bead--two", { opacity: 0.76, scale: 1, duration: 0.2 }, 0.52)
    .to(".cream-trail-path", { opacity: 0.36, duration: 0.16 }, 0.82)
    .to(".cream-trail-shadow", { opacity: 0.15, duration: 0.16 }, 0.82)
    .to(".lotion-image-glow", { opacity: 0.56, duration: 0.18 }, 0.83);
  document.body.classList.add("has-scroll-sequence");
}

const hero = document.querySelector(".hero");
const heroProduct = document.querySelector("#hero-product");
const pointerFine = window.matchMedia("(pointer: fine)");
if (pointerFine.matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroProduct.style.transform = `rotate(${(-10 + y * 7).toFixed(2)}deg) rotateY(${(-12 + x * 12).toFixed(2)}deg)`;
  });
  hero.addEventListener("pointerleave", () => {
    heroProduct.style.transform = "";
  });
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      button.style.setProperty("--magnetic-x", `${(x * 7).toFixed(2)}px`);
      button.style.setProperty("--magnetic-y", `${(y * 5).toFixed(2)}px`);
    });
    button.addEventListener("pointerleave", () => {
      button.style.removeProperty("--magnetic-x");
      button.style.removeProperty("--magnetic-y");
    });
  });
}

if (pointerFine.matches) {
  productCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.querySelector(".product-art").style.transform =
        `perspective(700px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.querySelector(".product-art").style.transform = "";
    });
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".section-heading, .product-card, .routine-copy, .routine-card, .ingredients-heading, .ingredient-stage, .heritage-copy, .heritage-image").forEach((element, index) => {
  element.setAttribute("data-reveal", "");
  if (element.classList.contains("product-card")) element.style.transitionDelay = `${(index % 4) * 70}ms`;
  revealObserver.observe(element);
});

const routineStepOne = document.querySelector("#routine-step-1");
const routineStepTwo = document.querySelector("#routine-step-2");
const routineResult = document.querySelector("#routine-result");
const routineProgressFill = document.querySelector("#routine-progress-fill");
const routineStepLabel = document.querySelector("#routine-step-label");
let selectedSkin = "";
let selectedConcern = "";

const showRoutineScreen = (screen) => {
  [routineStepOne, routineStepTwo, routineResult].forEach((item) => item.classList.remove("is-visible"));
  screen.classList.add("is-visible");
};
const clearChoices = () => {
  document.querySelectorAll(".choice-button").forEach((button) => button.classList.remove("is-selected"));
};

document.querySelectorAll("[data-skin]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedSkin = button.dataset.skin;
    routineStepOne.querySelectorAll("[data-skin]").forEach((choice) => choice.classList.toggle("is-selected", choice === button));
    routineProgressFill.style.width = "100%";
    routineStepLabel.textContent = "02 / 02";
    window.setTimeout(() => showRoutineScreen(routineStepTwo), 180);
  });
});

const routineCopy = {
  dry: {
    comfort: ["A softer start.", "Comforting, moisturising care for the days your skin needs a little extra kindness.", ["NIVEA Creme", "Nourishing Body Milk"]],
    glow: ["A fresh little glow.", "A light, refreshing care moment to leave your skin feeling soft and ready for the day.", ["NIVEA Soft", "NIVEA Creme"]],
    protect: ["Care, come rain or shine.", "A gentle everyday moisturising step, with sun care for days spent outdoors.", ["NIVEA Creme", "Sun Protect"]],
    simple: ["Keep it close.", "A familiar moisturiser for a simple, comforting daily ritual.", ["NIVEA Creme"]],
  },
  balanced: {
    comfort: ["A softer start.", "A little everyday moisture to keep your skin feeling comfortable and cared for.", ["NIVEA Soft", "NIVEA Creme"]],
    glow: ["A fresh little glow.", "Light care for a fresh-feeling start to your day.", ["NIVEA Soft"]],
    protect: ["Care, come rain or shine.", "Keep your skin-care ritual simple, with sun care when you head outside.", ["NIVEA Soft", "Sun Protect"]],
    simple: ["Keep it close.", "Easy, familiar care for the moments in between.", ["NIVEA Soft"]],
  },
  sensitive: {
    comfort: ["A softer start.", "Keep it gentle and uncomplicated. Choose care that feels comfortable for your skin.", ["NIVEA Creme"]],
    glow: ["A little room to breathe.", "Start with a simple, light moisturiser and notice what feels comfortable for you.", ["NIVEA Soft"]],
    protect: ["A thoughtful kind of care.", "Take a gentle approach to everyday moisture and remember sun care outdoors.", ["NIVEA Creme", "Sun Protect"]],
    simple: ["Keep it close.", "Less fuss, more listening. Begin with a familiar, uncomplicated moisturising step.", ["NIVEA Creme"]],
  },
  unsure: {
    comfort: ["A softer start.", "A comforting, familiar moisturiser is a lovely place to begin.", ["NIVEA Creme"]],
    glow: ["A fresh little glow.", "Try a light moisturiser, and let your skin tell you how it feels.", ["NIVEA Soft"]],
    protect: ["Care, come rain or shine.", "Everyday moisturising care, with sun protection when you spend time outside.", ["NIVEA Soft", "Sun Protect"]],
    simple: ["Keep it close.", "A simple everyday moisturiser. No complicated routine required.", ["NIVEA Creme"]],
  },
};

document.querySelectorAll("[data-concern]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedConcern = button.dataset.concern;
    const [title, description, products] = routineCopy[selectedSkin][selectedConcern];
    document.querySelector("#result-title").textContent = title;
    document.querySelector("#result-copy").textContent = description;
    const resultProducts = document.querySelector("#result-products");
    resultProducts.replaceChildren(...products.map((name) => {
      const item = document.createElement("span");
      item.className = "result-product";
      item.textContent = name;
      return item;
    }));
    routineProgressFill.style.width = "100%";
    routineStepLabel.textContent = "ALL YOURS";
    window.setTimeout(() => showRoutineScreen(routineResult), 180);
  });
});

document.querySelector("#routine-back").addEventListener("click", () => {
  selectedConcern = "";
  clearChoices();
  routineProgressFill.style.width = "50%";
  routineStepLabel.textContent = "01 / 02";
  showRoutineScreen(routineStepOne);
});
document.querySelector("#routine-restart").addEventListener("click", () => {
  selectedSkin = "";
  selectedConcern = "";
  clearChoices();
  routineProgressFill.style.width = "50%";
  routineStepLabel.textContent = "01 / 02";
  showRoutineScreen(routineStepOne);
});

const ingredientDetails = {
  glycerin: ["A little moisture, held close.", "Glycerin helps attract and retain moisture, making it a familiar friend in skin-care formulas."],
  vitamin: ["A bright idea.", "Vitamin C is known for its antioxidant properties and is often used in care for a fresh, radiant-looking feel."],
  aloe: ["A soothing touch.", "Aloe vera is loved for its refreshing, comforting feel in skin-care rituals."],
};
const ingredientDetail = document.querySelector("#ingredient-detail");
document.querySelectorAll(".ingredient-orb").forEach((orb) => {
  orb.addEventListener("click", () => {
    const [title, description] = ingredientDetails[orb.dataset.ingredient];
    document.querySelectorAll(".ingredient-orb").forEach((item) => {
      const selected = item === orb;
      item.setAttribute("aria-pressed", String(selected));
    });
    const mark = document.createElement("span");
    mark.className = "center-mark";
    mark.textContent = title.charAt(0);
    const heading = document.createElement("p");
    heading.textContent = title;
    const detail = document.createElement("small");
    detail.textContent = description;
    ingredientDetail.replaceChildren(mark, heading, detail);
    ingredientDetail.classList.add("ingredient-center--expanded");
  });
});
