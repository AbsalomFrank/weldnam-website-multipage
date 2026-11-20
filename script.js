// WeldNAM – plain JavaScript, no libraries or build step. Each feature only runs if its element is on the page.
document.addEventListener("DOMContentLoaded", function () {

  var iconPaths = {
    phone: '<path d="M6.5 3.5h2.2l1.4 3.4-1.6 1a12 12 0 0 0 5.6 5.6l1-1.6 3.4 1.4v2.2a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 5 5.1a1.5 1.5 0 0 1 1.5-1.6z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m4 7 8 6 8-6"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>',
    download: '<path d="M12 4v10"/><path d="m8 10 4 4 4-4"/><path d="M5 19h14"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
    badge: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12.2 2.3 2.3 4.7-5"/>',
    cap: '<path d="m2.5 9 9.5-5 9.5 5-9.5 5z"/><path d="M6 11.2V16c1.8 1.6 4 2.4 6 2.4s4.2-.8 6-2.4v-4.8"/>',
    building: '<path d="M4 20h16M6 20V6l6-2 6 2v14M10 10h.01M14 10h.01M10 14h.01M14 14h.01"/>',
    flame: '<path d="M12 3s6 5 6 9a6 6 0 0 1-12 0c0-2 1.2-3.6 2.2-4.6C9 9.2 10 11 12 11c0-3 0-5.2 0-8z"/>',
    drop: '<path d="M12 3s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"/>',
    helmet: '<path d="M4 14a8 8 0 0 1 16 0M3 14h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 6v4"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13.2-1.2 6.3L12 17l4.7 2.5-1.2-6.3"/>',
    layers: '<path d="m12 3 9 5-9 5L3 8zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    "arrow-up": '<path d="M12 19V6M6 11l6-6 6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  var search = document.getElementById("dl-search");
  if (search && !search.parentElement.classList.contains("search-wrap")) {
    var wrap = document.createElement("div");
    wrap.className = "search-wrap";
    wrap.setAttribute("data-icon", "search");
    search.parentNode.insertBefore(wrap, search);
    wrap.appendChild(search);
  }
  document.querySelectorAll("a.download").forEach(function (a) {
    if (!a.getAttribute("data-icon")) a.setAttribute("data-icon", "download");
  });
  var menuBtn = document.querySelector(".menu-toggle");
  if (menuBtn) menuBtn.setAttribute("data-icon", "menu");
  var topBtn = document.getElementById("to-top");
  if (topBtn) {
    topBtn.textContent = "";
    topBtn.setAttribute("data-icon", "arrow-up");
  }
  document.querySelectorAll("[data-icon]").forEach(function (el) {
    var path = iconPaths[el.getAttribute("data-icon")];
    if (!path || (el.firstElementChild && el.firstElementChild.classList.contains("ico"))) return;
    el.insertAdjacentHTML("afterbegin", '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + path + "</svg>");
  });

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  // Member logos: one active company, looping, with a brief under the logo.
  var arrow = function (dir, noun) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "member-arrow member-arrow-" + (dir < 0 ? "prev" : "next");
    btn.setAttribute("aria-label", dir < 0 ? "Previous " + noun : "Next " + noun);
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="' +
      (dir < 0 ? "M14.5 5.5 L8 12 l6.5 6.5" : "M9.5 5.5 L16 12 l-6.5 6.5") +
      '" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"/></svg>';
    return btn;
  };

  document.querySelectorAll(".member-grid").forEach(function (grid) {
    var slides = Array.prototype.slice.call(grid.children);
    if (slides.length < 2) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var noun = /partner/i.test(grid.getAttribute("data-label") || "") ? "partner" : "member";
    var slider = document.createElement("div");
    slider.className = "member-slider";
    slider.setAttribute("role", "region");
    slider.setAttribute("aria-label", grid.getAttribute("data-label") || "Member organisations");

    var stage = document.createElement("div");
    stage.className = "member-stage";
    var frame = document.createElement("div");
    frame.className = "member-reel";
    var prev = arrow(-1, noun);
    var next = arrow(1, noun);
    var bar = document.createElement("div");
    bar.className = "member-progress";
    bar.setAttribute("aria-hidden", "true");
    var copy = document.createElement("div");
    copy.className = "member-copy";
    copy.setAttribute("aria-live", "polite");
    var title = document.createElement("h3");
    var text = document.createElement("p");
    copy.appendChild(title);
    copy.appendChild(text);

    slides.forEach(function (slide) { frame.appendChild(slide); });
    stage.appendChild(prev);
    stage.appendChild(frame);
    stage.appendChild(next);
    stage.appendChild(bar);
    slider.appendChild(stage);
    slider.appendChild(copy);
    grid.parentNode.insertBefore(slider, grid);
    grid.remove();

    var index = 0;
    var paused = false;
    var timer;
    var n = slides.length;

    var around = function (i, from) {
      var d = i - from;
      var half = Math.floor(n / 2);
      return ((d + half) % n + n) % n - half;
    };
    var place = function (step) {
      var narrow = frame.clientWidth < 700;
      var half = narrow ? 1 : Math.floor(n / 2);
      var slot = (frame.clientWidth - 112) / (half * 2 + 1);
      slides.forEach(function (slide, i) {
        var d = around(i, index);
        var jump = step === 0 || (slide._d != null && Math.abs(d - slide._d) > Math.abs(step));
        slide._d = d;
        slide.classList.toggle("is-jump", jump || reduceMotion);
        slide.classList.toggle("is-active", d === 0);
        slide.tabIndex = d === 0 ? 0 : -1;
        var on = Math.abs(d) <= half;
        slide.style.opacity = on ? (d === 0 ? "1" : "0.82") : "0";
        slide.style.pointerEvents = on ? "auto" : "none";
        slide.style.transform = "translate(calc(-50% + " + (d * slot) + "px), -50%) scale(" + (d === 0 ? "1" : "0.9") + ")";
        if (jump) {
          void slide.offsetWidth;
          slide.classList.remove("is-jump");
        }
      });
    };
    var paint = function (step) {
      place(step);
      if (step) {
        var incoming = slides[index];
        title.textContent = incoming.getAttribute("data-name") || "";
        text.textContent = incoming.getAttribute("data-brief") || "";
        copy.classList.remove("is-in");
        void copy.offsetWidth;
        copy.classList.add("is-in");
      }
      bar.textContent = "";
      if (!reduceMotion && !paused) bar.appendChild(document.createElement("span"));
    };

    var stop = function () { clearInterval(timer); };
    var start = function () {
      stop();
      if (reduceMotion || paused) return;
      timer = setInterval(function () { go(1); }, 5200);
    };
    var go = function (step) {
      index = (index + step + slides.length) % slides.length;
      paint(step);
      start();
    };

    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    slides.forEach(function (slide, i) {
      slide.addEventListener("click", function (e) {
        var step = around(i, index);
        if (!step) return;
        e.preventDefault();
        go(step);
      });
    });
    window.addEventListener("resize", function () { place(0); });
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });
    slider.addEventListener("mouseenter", function () { paused = true; stop(); bar.textContent = ""; });
    slider.addEventListener("mouseleave", function () { paused = false; start(); paint(0); });
    slider.addEventListener("focusin", function (e) {
      if (!e.target.matches || !e.target.matches(":focus-visible")) return;
      paused = true;
      stop();
      bar.textContent = "";
    });
    slider.addEventListener("focusout", function (e) {
      if (slider.contains(e.relatedTarget)) return;
      paused = false;
      start();
      paint(0);
    });

    slides.forEach(function (slide, i) { slide.tabIndex = i === 0 ? 0 : -1; });
    slides[0].classList.add("is-active");
    title.textContent = slides[0].getAttribute("data-name") || "";
    text.textContent = slides[0].getAttribute("data-brief") || "";
    copy.classList.add("is-in");
    paint(0);
    start();
  });

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Downloads search
  var search = document.getElementById("dl-search");
  if (search) {
    var cards = document.querySelectorAll(".doc");
    var groups = document.querySelectorAll(".doc-group");
    var empty = document.getElementById("dl-empty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var match = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.style.display = match ? "" : "none";
        if (match) shown++;
      });
      groups.forEach(function (g) {
        var visible = Array.prototype.some.call(g.querySelectorAll(".doc"), function (d) {
          return d.style.display !== "none";
        });
        g.style.display = visible ? "" : "none";
      });
      empty.hidden = shown !== 0;
    });
  }

  // Contact form validation
  var form = document.getElementById("enquiry-form");
  if (form) {
    var rules = {
      name: function (v) { return v.trim() ? "" : "Please enter your full name."; },
      email: function (v) { return /^\S+@\S+\.\S+$/.test(v) ? "" : "Please enter a valid email address."; },
      phone: function (v) { return !v || /^[+\d][\d\s()-]{5,}$/.test(v) ? "" : "Please enter a valid phone number."; },
      type: function (v) { return v ? "" : "Please choose an enquiry type."; },
      message: function (v) { return v.trim().length >= 10 ? "" : "Please write at least 10 characters."; }
    };
    var check = function (name) {
      var input = form.elements[name];
      var msg = rules[name](input.value);
      input.classList.toggle("invalid", !!msg);
      input.parentNode.querySelector(".err").textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      el.addEventListener("blur", function () { check(name); });
      el.addEventListener("input", function () { if (el.classList.contains("invalid")) check(name); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!Object.keys(rules).map(check).every(Boolean)) return;
      // A static site has no server to receive the form, so this opens the visitor's
      // email app with the enquiry filled in. To collect enquiries directly, use a
      // form service such as Formspree or Netlify Forms instead.
      var d = new FormData(form);
      var body = "Name: " + d.get("name") + "\nEmail: " + d.get("email") +
        "\nPhone: " + (d.get("phone") || "-") + "\nEnquiry type: " + d.get("type") + "\n\n" + d.get("message");
      window.location.href = "mailto:talweendo@unam.na?subject=" +
        encodeURIComponent("WeldNAM enquiry: " + d.get("type")) + "&body=" + encodeURIComponent(body);
      document.getElementById("form-ok").style.display = "block";
      form.reset();
    });
  }

  // Sections ease in once they reach the screen. The hero has its own CSS entrance.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    var bands = document.querySelectorAll("main > section:not(.hero)");
    bands.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i, 3) * 60 + "ms";
    });
    var showReached = function () {
      bands.forEach(function (el) {
        if (el.classList.contains("in")) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("in");
      });
    };
    showReached();
    window.addEventListener("scroll", showReached, { passive: true });
  }

  // Back-to-top button
  var top = document.getElementById("to-top");
  if (top) {
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 500); }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
});
