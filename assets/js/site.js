document.documentElement.classList.add("js");

const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("done"), 420);
});

document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 12);
});

const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.querySelector(".mobile-nav");
menuBtn.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileNav.classList.remove("open"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 70}ms`;
  observer.observe(el);
});

const canvas = document.getElementById("orbits");
const ctx = canvas.getContext("2d");
const dots = [];
const DOT_COUNT = 70;

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawn() {
  dots.length = 0;
  for (let i = 0; i < DOT_COUNT; i += 1) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach((dot, i) => {
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
    ctx.beginPath();
    ctx.fillStyle = i % 5 === 0 ? "rgba(78,225,198,0.45)" : "rgba(139,124,255,0.35)";
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < dots.length; j += 1) {
      const other = dots[j];
      const dx = dot.x - other.x;
      const dy = dot.y - other.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(180,190,220,${(1 - dist / 120) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(tick);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  sizeCanvas();
  spawn();
  tick();
  window.addEventListener("resize", () => {
    sizeCanvas();
    spawn();
  });
}
