// WeldNAM – plain JavaScript, no libraries or build step. Each feature only runs if its element is on the page.
document.addEventListener("DOMContentLoaded", function () {

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Count-up number (home page)
  var counter = document.querySelector(".counter");
  if (counter && "IntersectionObserver" in window) {
    var target = Number(counter.dataset.target);
    var co = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      co.disconnect();
      var start = performance.now(), dur = 1200;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        counter.textContent = Math.round(target * p);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
    counter.textContent = "0";
    co.observe(counter);
  }

  // Downloads search
  var search = document.getElementById("dl-search");
  if (search) {
    var cards = document.querySelectorAll("#dl-grid .card");
    var empty = document.getElementById("dl-empty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var match = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.style.display = match ? "" : "none";
        if (match) shown++;
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

  // Back-to-top button
  var top = document.getElementById("to-top");
  if (top) {
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 500); }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
});
