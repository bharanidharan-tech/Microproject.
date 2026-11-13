const events = [
  {
    title: "Technical Symposium",
    date: "2026-12-05",
    venue: "Main Auditorium",
    category: "technical",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=70",
    description: "Paper presentations, tech quizzes and talks by industry experts on emerging technologies."
  },
  {
    title: "Hackathon 2026",
    date: "2026-12-12",
    venue: "Innovation Lab, Block C",
    category: "technical",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=70",
    description: "A 24-hour coding marathon. Build real solutions in teams and win exciting prizes."
  },
  {
    title: "Cultural Fest",
    date: "2026-12-20",
    venue: "Open Air Theatre",
    category: "cultural",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=70",
    description: "Music, dance, drama and fashion — three days of non-stop celebration and talent."
  },
  {
    title: "Sports Championship",
    date: "2027-01-10",
    venue: "College Sports Ground",
    category: "sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=70",
    description: "Inter-department cricket, football, athletics and more. Cheer for your team!"
  },
  {
    title: "Photography Contest",
    date: "2027-01-18",
    venue: "Art Gallery Hall",
    category: "arts",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=70",
    description: "Theme: 'Life on Campus'. Capture the moment and get your work exhibited."
  },
  {
    title: "Workshop on Artificial Intelligence",
    date: "2027-01-25",
    venue: "Seminar Hall 2",
    category: "workshops",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=70",
    description: "Hands-on session on machine learning basics, AI tools and building your first model."
  }
];

const categoryNames = {
  technical: "Technical",
  cultural: "Cultural",
  sports: "Sports",
  workshops: "Workshops",
  arts: "Arts & Photography"
};

const fallbackImage = "https://placehold.co/800x500/1e1b4b/ffffff?text=CampusVibe";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format "2026-12-05" as "5 Dec 2026"
function formatDate(dateText) {
  const d = new Date(dateText + "T00:00:00");
  return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
}

// ===== Show event cards =====
const eventsGrid = document.getElementById("eventsGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
let currentFilter = "all";

function showEvents() {
  const searchText = searchInput.value.trim().toLowerCase();
  eventsGrid.innerHTML = "";
  let count = 0;

  events.forEach(function (event, index) {
    const matchCategory = currentFilter === "all" || event.category === currentFilter;
    const matchSearch = event.title.toLowerCase().includes(searchText);

    if (matchCategory && matchSearch) {
      count++;
      const card = document.createElement("article");
      card.className = "event-card";
      card.innerHTML =
        '<div class="event-img">' +
          '<img src="' + event.image + '" alt="' + event.title + '" loading="lazy" onerror="this.src=\'' + fallbackImage + '\'">' +
          '<span class="event-tag">' + categoryNames[event.category] + '</span>' +
        '</div>' +
        '<div class="event-body">' +
          '<h3>' + event.title + '</h3>' +
          '<div class="event-meta">' +
            '<span><i class="fa-regular fa-calendar"></i>' + formatDate(event.date) + '</span>' +
            '<span><i class="fa-solid fa-location-dot"></i>' + event.venue + '</span>' +
          '</div>' +
          '<p>' + event.description + '</p>' +
          '<button class="btn btn-primary" onclick="openModal(' + index + ')">View Details</button>' +
        '</div>';
      eventsGrid.appendChild(card);
    }
  });

  noResults.classList.toggle("show", count === 0);
}

// ===== Filters =====
const filterButtons = document.querySelectorAll(".filter-btn");

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  showEvents();
}

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () { setFilter(btn.dataset.filter); });
});

// Category cards: filter and scroll to events
document.querySelectorAll(".category-card").forEach(function (card) {
  card.addEventListener("click", function () {
    setFilter(card.dataset.filter);
    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
  });
});

searchInput.addEventListener("input", showEvents);

// ===== Upcoming events with countdown =====
const upcomingList = document.getElementById("upcomingList");

function showUpcoming() {
  const sorted = events.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
  upcomingList.innerHTML = "";

  sorted.slice(0, 4).forEach(function (event) {
    const index = events.indexOf(event);
    const d = new Date(event.date + "T00:00:00");
    const item = document.createElement("div");
    item.className = "upcoming-item reveal";
    item.innerHTML =
      '<div class="date-box"><strong>' + d.getDate() + '</strong><span>' + monthNames[d.getMonth()] + '</span></div>' +
      '<div class="up-info"><h3>' + event.title + '</h3>' +
        '<p><i class="fa-solid fa-location-dot"></i>' + event.venue + ' &nbsp;•&nbsp; ' + formatDate(event.date) + '</p></div>' +
      '<div class="countdown" data-date="' + event.date + '"></div>' +
      '<button class="btn btn-primary" onclick="openModal(' + index + ')">View Details</button>';
    upcomingList.appendChild(item);
  });
  updateCountdowns();
}

function updateCountdowns() {
  document.querySelectorAll(".countdown").forEach(function (box) {
    const diff = new Date(box.dataset.date + "T09:00:00") - new Date();
    if (diff <= 0) {
      box.innerHTML = '<div><strong>Live</strong><span>Now</span></div>';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    box.innerHTML =
      '<div><strong>' + days + '</strong><span>Days</span></div>' +
      '<div><strong>' + hours + '</strong><span>Hrs</span></div>' +
      '<div><strong>' + mins + '</strong><span>Min</span></div>' +
      '<div><strong>' + secs + '</strong><span>Sec</span></div>';
  });
}
setInterval(updateCountdowns, 1000);

// ===== Event details popup =====
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

function openModal(index) {
  const e = events[index];
  modalContent.innerHTML =
    '<img src="' + e.image + '" alt="' + e.title + '" onerror="this.src=\'' + fallbackImage + '\'">' +
    '<div class="modal-inner">' +
      '<span class="eyebrow">' + categoryNames[e.category] + '</span>' +
      '<h3>' + e.title + '</h3>' +
      '<p>' + e.description + '</p>' +
      '<div class="event-meta"><span><i class="fa-regular fa-calendar"></i>' + formatDate(e.date) + '</span>' +
      '<span><i class="fa-solid fa-location-dot"></i>' + e.venue + '</span></div>' +
      '<button class="btn btn-primary btn-block" onclick="registerEvent(\'' + e.title + '\')">Register Now</button>' +
    '</div>';
  modal.classList.add("open");
}

function registerEvent(title) {
  alert("Thanks for your interest in " + title + "! Registration details will be shared soon.");
  modal.classList.remove("open");
}

document.getElementById("modalClose").addEventListener("click", function () { modal.classList.remove("open"); });
modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("open"); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") modal.classList.remove("open"); });

// ===== Navbar: sticky style, mobile menu, active link =====
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const backToTop = document.getElementById("backToTop");

menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  menuToggle.innerHTML = navLinks.classList.contains("open")
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  backToTop.classList.toggle("show", window.scrollY > 500);

  // Highlight the current section in the nav
  document.querySelectorAll("section[id]").forEach(function (section) {
    const top = section.offsetTop - 120;
    const link = navLinks.querySelector('a[href="#' + section.id + '"]');
    if (link && window.scrollY >= top && window.scrollY < top + section.offsetHeight) {
      navLinks.querySelectorAll("a").forEach(function (a) { a.classList.remove("active"); });
      link.classList.add("active");
    }
  });
});

backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Contact form validation =====
const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function setError(id, message) {
  const group = document.getElementById(id).parentElement;
  group.querySelector(".error").textContent = message;
  group.classList.toggle("invalid", message !== "");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  formSuccess.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

  if (name.length < 2) { setError("name", "Please enter your name."); valid = false; } else setError("name", "");
  if (!emailPattern.test(email)) { setError("email", "Please enter a valid email."); valid = false; } else setError("email", "");
  if (subject === "") { setError("subject", "Please enter a subject."); valid = false; } else setError("subject", "");
  if (message.length < 10) { setError("message", "Message should be at least 10 characters."); valid = false; } else setError("message", "");

  if (valid) {
    formSuccess.textContent = "Thank you, " + name + "! Your message has been sent successfully.";
    form.reset();
  }
});

// ===== Reveal animation on scroll =====
function setupReveal() {
  const items = document.querySelectorAll(".section-head, .category-card, .about-img, .about-text, .g-item, .contact-info, .contact-form, .upcoming-item");
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (item) {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

// ===== Start =====
showEvents();
showUpcoming();
setupReveal();
