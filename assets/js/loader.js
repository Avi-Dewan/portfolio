'use strict';

/**
 * Data-Driven Portfolio Loader
 * ────────────────────────────
 * Reads JSON files from /data, renders them into HTML,
 * and injects them into the page containers.
 *
 * To update your portfolio content, just edit the JSON files in /data.
 * No HTML editing needed.
 */

/* ═══════════════════════  FETCH HELPER  ═══════════════════════ */

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

/* ═══════════════════════  RENDER FUNCTIONS  ═══════════════════════ */

// ── Sidebar ──
function renderSidebar(data) {
  const socialsHTML = data.socialLinks.map(s => `
    <li class="social-item">
      <a href="${s.url}" class="social-link" target="_blank" rel="noopener noreferrer">
        <ion-icon name="${s.icon}"></ion-icon>
      </a>
    </li>
  `).join('');

  const contactsHTML = data.contacts.map(c => `
    <li class="contact-item">
      <div class="icon-box">
        <ion-icon name="${c.icon}"></ion-icon>
      </div>
      <div class="contact-info">
        <p class="contact-title">${c.title}</p>
        ${c.link
          ? `<a href="${c.link}" class="contact-link">${c.value}</a>`
          : (c.isAddress ? `<address>${c.value}</address>` : `<span>${c.value}</span>`)
        }
      </div>
    </li>
  `).join('');

  return `
    <aside class="sidebar" data-sidebar>
      <div class="sidebar-info">
        <figure class="avatar-box">
          <img src="${data.avatar}" alt="${data.name}" width="80">
        </figure>
        <div class="info-content">
          <h1 class="name" title="${data.name}">${data.name}</h1>
          ${data.title ? `<p class="title">${data.title}</p>` : ''}
        </div>
        <button class="info_more-btn" data-sidebar-btn>
          <span>Show Contacts</span>
          <ion-icon name="chevron-down"></ion-icon>
        </button>
      </div>

      <ul class="social-list">${socialsHTML}</ul>

      <div class="separator"></div>

      <div class="sidebar-info_more">
        <ul class="contacts-list">${contactsHTML}</ul>
      </div>
    </aside>
  `;
}

// ── Navbar ──
function renderNavbar(tabs) {
  const items = tabs.map((tab, i) => `
    <li class="navbar-item">
      <button class="navbar-link${i === 0 ? ' active' : ''}" data-nav-link>${tab}</button>
    </li>
  `).join('');

  return `<nav class="navbar"><ul class="navbar-list">${items}</ul></nav>`;
}

// ── About ──
function renderAbout(data) {
  const paragraphs = data.paragraphs.map(p => `<p>${p}</p>`).join('\n');

  return `
    <article class="about active" data-page="about">
      <header><h2 class="h2 article-title">About me</h2></header>
      <section class="about-text">${paragraphs}</section>
      <div class="modal-container" data-modal-container>
        <div class="overlay" data-overlay></div>
        <section class="testimonials-modal">
          <button class="modal-close-btn" data-modal-close-btn>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </section>
      </div>
    </article>
  `;
}

// ── Skills ──
function renderSkills(data) {
  const sections = data.categories.map(cat => {
    const badges = cat.badges.map(b =>
      `<div style="float: left; margin-right: 8px; margin-bottom: 8px;">
        <img alt="${b.alt}" style="float: left;" src="${b.src}" />
      </div>`
    ).join('');

    return `
      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box"><ion-icon name="code-slash-outline"></ion-icon></div>
          <h3 class="h3">${cat.title}</h3>
        </div>
        <div>${badges}</div>
      </section>
      <br/><br/><div></div><hr><br/>
    `;
  }).join('');

  return `
    <article class="skills" data-page="skills">
      <header><h2 class="h2 article-title">Skills</h2></header>
      ${sections}
    </article>
  `;
}

// ── Education ──
function renderEducation(data) {
  const items = data.schools.map(school => {
    let coursesHTML = '';
    if (school.courses && school.courses.length > 0) {
      const courseItems = school.courses.map(c => `<li><p class="timeline-text">${c}</p></li>`).join('');
      coursesHTML = `
        <div class="multicol-list">
          <div class="blog-text">Notable Courses</div>
          <ul>${courseItems}</ul>
        </div>
      `;
    }

    return `
      <li class="timeline-item">
        <div class="education-header">
          <h4 class="h4 timeline-item-title">${school.name}</h4>
          <span>${school.period}</span>
        </div>
        <div class="education-header">
          <h5 class="h5 timeline-item-subtitle">${school.degree}</h5>
          <span>${school.grade}</span>
        </div>
        ${school.description ? `<p class="timeline-text">${school.description}</p>` : ''}
        ${coursesHTML}
      </li>
    `;
  }).join('');

  return `
    <article class="education" data-page="education">
      <header><h2 class="h2 article-title">Education</h2></header>
      <section class="timeline">
        <ol class="timeline-list">${items}</ol>
      </section>
    </article>
  `;
}

// ── Achievements ──
function renderAchievements(data) {
  const sections = data.sections.map(section => {
    const entries = section.entries.map(e => `
      <li class="timeline-item">
        <div class="education-header">
          <h4 class="h4 timeline-item-title">${e.title}</h4>
          <span>${e.location}</span>
        </div>
        <div class="education-header">
          <span>${e.rank}</span>
          <span>${e.date}</span>
        </div>
        ${e.description ? `<p class="timeline-text">${e.description}</p>` : ''}
      </li>
    `).join('');

    return `
      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box"><ion-icon name="${section.icon}"></ion-icon></div>
          <h3 class="h3">${section.category}</h3>
        </div>
        <ol class="timeline-list">${entries}</ol>
      </section>
    `;
  }).join('');

  return `
    <article class="achievements" data-page="achievements">
      <header><h2 class="h2 article-title">Achievements</h2></header>
      ${sections}
    </article>
  `;
}

// ── Experience ──
function renderExperience(data) {
  const companySections = data.companies.map((company, idx) => {
    const roles = company.roles.map(role => {
      const bullets = role.bullets.map(b =>
        `<li class="circle"><p class="timeline-text-bulletpoint">${b}</p></li>`
      ).join('');

      return `
        <li class="timeline-item">
          <div class="education-header">
            <h3 class="h3 timeline-item-title">${role.title}</h3>
            <span>${role.period}</span>
          </div>
          <div class="education-header">
            <span>${role.location}</span>
          </div>
          <br>
          <p class="timeline-text"></p>
          <br/>
          <div style="margin-left: 15px;"></div>
          <ul>${bullets}</ul>
        </li>
      `;
    }).join('');

    // Add <hr><br> between companies but not after the last one
    const separator = idx < data.companies.length - 1 ? '<hr><br>' : '';

    return `
      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box"><ion-icon name="${company.icon}"></ion-icon></div>
          <h3 class="h3">${company.name}</h3>
        </div>
        <ol class="timeline-list">
          <p class="timeline-text"></p><br/>
          ${roles}
        </ol>
      </section>
      ${separator}
    `;
  }).join('');

  return `
    <article class="experience" data-page="experience">
      <header><h2 class="h2 article-title">Experiences</h2></header>
      ${companySections}
    </article>
  `;
}

// ── Projects ──
function renderProjects(data) {
  const cards = data.items.map(p => {
    const tagsHTML = p.tags.map(t => `<code class="tags">${t}</code>`).join('');

    let linksHTML = '';
    if (p.github) {
      linksHTML += `<a href="${p.github}" target="_blank" rel="noopener noreferrer"><ion-icon name="logo-github"></ion-icon></a>`;
    }
    if (p.youtube) {
      linksHTML += `<a href="${p.youtube}" target="_blank" rel="noopener noreferrer"><ion-icon name="logo-youtube"></ion-icon></a>`;
    }

    return `
      <li class="blog-post-item">
        <figure class="blog-banner-box">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </figure>
        <div class="blog-content">
          <div class="blog-header">
            <h3 class="h3 blog-item-title">${p.title}</h3>
            <div class="project-linkes">${linksHTML}</div>
          </div>
          <div>
            🏷️ ${tagsHTML}
            <span class="dot"></span>
            <time class="blog-text" datetime="${p.year}">${p.year}</time>
          </div>
          <hr/>
          <p class="blog-text">${p.description}</p>
        </div>
      </li>
    `;
  }).join('');

  return `
    <article class="projects" data-page="projects">
      <header><h2 class="h2 article-title">Projects</h2></header>
      <section class="blog-posts">
        <ul class="blog-posts-list">${cards}</ul>
      </section>
    </article>
  `;
}

// ── Portfolio (kept static — filter logic is hard-coded to these items) ──
function renderPortfolio() {
  return `
    <article class="portfolio" data-page="portfolio">
      <header><h2 class="h2 article-title">Portfolio</h2></header>
      <section class="projects">
        <ul class="filter-list">
          <li class="filter-item"><button class="active" data-filter-btn>All</button></li>
          <li class="filter-item"><button data-filter-btn>Web design</button></li>
          <li class="filter-item"><button data-filter-btn>Applications</button></li>
          <li class="filter-item"><button data-filter-btn>Web development</button></li>
        </ul>
        <div class="filter-select-box">
          <button class="filter-select" data-select>
            <div class="select-value" data-selecct-value>Select category</div>
            <div class="select-icon"><ion-icon name="chevron-down"></ion-icon></div>
          </button>
          <ul class="select-list">
            <li class="select-item"><button data-select-item>All</button></li>
            <li class="select-item"><button data-select-item>Web design</button></li>
            <li class="select-item"><button data-select-item>Applications</button></li>
            <li class="select-item"><button data-select-item>Web development</button></li>
          </ul>
        </div>
        <ul class="project-list">
          <li class="project-item active" data-filter-item data-category="web development">
            <a href="#">
              <figure class="project-img">
                <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
                <img src="./assets/images/project-1.jpg" alt="finance" loading="lazy">
              </figure>
              <h3 class="project-title">Finance</h3>
              <p class="project-category">Web development</p>
            </a>
          </li>
        </ul>
      </section>
    </article>
  `;
}


/* ═══════════════════════  MAIN LOADER  ═══════════════════════ */

const navTabs = ['About', 'Skills', 'Education', 'Achievements', 'Experience', 'Projects'];

async function loadPortfolio() {
  // Fetch all data in parallel
  const [profile, about, skills, education, achievements, experience, projects] = await Promise.all([
    loadJSON('./data/profile.json'),
    loadJSON('./data/about.json'),
    loadJSON('./data/skills.json'),
    loadJSON('./data/education.json'),
    loadJSON('./data/achievements.json'),
    loadJSON('./data/experience.json'),
    loadJSON('./data/projects.json'),
  ]);

  // Render everything into the DOM
  // Sidebar uses outerHTML so <aside> becomes a direct child of <main> (required for flex stretch)
  document.getElementById('sidebar-container').outerHTML = renderSidebar(profile);
  document.getElementById('navbar-container').innerHTML       = renderNavbar(navTabs);
  document.getElementById('about-container').innerHTML        = renderAbout(about);
  document.getElementById('skills-container').innerHTML       = renderSkills(skills);
  document.getElementById('education-container').innerHTML    = renderEducation(education);
  document.getElementById('achievements-container').innerHTML = renderAchievements(achievements);
  document.getElementById('experience-container').innerHTML   = renderExperience(experience);
  document.getElementById('projects-container').innerHTML     = renderProjects(projects);
  document.getElementById('portfolio-container').innerHTML    = renderPortfolio();

  // Wire up interactivity
  initSidebar();
  initTestimonialsModal();
  initPortfolioFilter();
  initContactForm();
  initPageNavigation();
}

loadPortfolio();


/* ═══════════════════════  INTERACTIVE MODULES  ═══════════════════════ */

function elementToggleFunc(elem) {
  elem.classList.toggle('active');
}

function initSidebar() {
  const sidebar    = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
  }
}

function initTestimonialsModal() {
  const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
  const modalContainer   = document.querySelector('[data-modal-container]');
  const modalCloseBtn    = document.querySelector('[data-modal-close-btn]');
  const overlay          = document.querySelector('[data-overlay]');
  const modalImg         = document.querySelector('[data-modal-img]');
  const modalTitle       = document.querySelector('[data-modal-title]');
  const modalText        = document.querySelector('[data-modal-text]');

  if (!modalContainer || !modalCloseBtn || !overlay) return;

  const toggle = () => {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  testimonialsItem.forEach(item => {
    item.addEventListener('click', () => {
      if (modalImg)   modalImg.src   = item.querySelector('[data-testimonials-avatar]').src;
      if (modalImg)   modalImg.alt   = item.querySelector('[data-testimonials-avatar]').alt;
      if (modalTitle) modalTitle.innerHTML = item.querySelector('[data-testimonials-title]').innerHTML;
      if (modalText)  modalText.innerHTML  = item.querySelector('[data-testimonials-text]').innerHTML;
      toggle();
    });
  });

  modalCloseBtn.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
}

function initPortfolioFilter() {
  const select      = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterBtn   = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  if (!select) return;

  select.addEventListener('click', () => elementToggleFunc(select));

  const filterFunc = (selectedValue) => {
    filterItems.forEach(item => {
      if (selectedValue === 'all' || selectedValue === item.dataset.category) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  selectItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.innerText.toLowerCase();
      selectValue.innerText = item.innerText;
      elementToggleFunc(select);
      filterFunc(val);
    });
  });

  let lastClickedBtn = filterBtn[0];
  filterBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.innerText.toLowerCase();
      selectValue.innerText = btn.innerText;
      filterFunc(val);
      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      btn.classList.add('active');
      lastClickedBtn = btn;
    });
  });
}

function initContactForm() {
  const form       = document.querySelector('[data-form]');
  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn    = document.querySelector('[data-form-btn]');

  if (!form || !formBtn) return;

  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (form.checkValidity()) {
        formBtn.removeAttribute('disabled');
      } else {
        formBtn.setAttribute('disabled', '');
      }
    });
  });
}

function initPageNavigation() {
  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages           = document.querySelectorAll('[data-page]');

  navigationLinks.forEach(link => {
    link.addEventListener('click', function () {
      for (let i = 0; i < pages.length; i++) {
        if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
          pages[i].classList.add('active');
          navigationLinks[i].classList.add('active');
          window.scrollTo(0, 0);
        } else {
          pages[i].classList.remove('active');
          navigationLinks[i].classList.remove('active');
        }
      }
    });
  });
}
