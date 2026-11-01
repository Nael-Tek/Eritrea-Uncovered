// script.js: JavaScript for the Eritrea Uncovered website

// Function 1: runs when the button is clicked (onclick)
function showMessage() {
  document.getElementById("message").innerHTML =
    "Tip: The best time to visit Eritrea is from October to March, when the weather is cool and dry. Ask us about guided tours of Asmara and the Dahlak Islands.";
}

// Function 2: runs when the mouse moves over an image (onmouseover)
function enlarge(img) {
  img.style.width = "350px";
}

// Function 3: runs when the mouse moves off the image (onmouseout)
function shrink(img) {
  img.style.width = "250px";
}

// Form validation: presence check and length/range check
function validateForm() {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let age = document.getElementById("age").value;
  let destination = document.getElementById("destination").value;
  let error = document.getElementById("formError");

  // Presence check: name must not be empty
  if (name === "") {
    error.innerHTML = "Please enter your full name.";
    return false;
  }

  // Length check: name must be at least 2 characters
  if (name.length < 2) {
    error.innerHTML = "Your name must be at least 2 characters long.";
    return false;
  }

  // Presence check: email must not be empty
  if (email === "") {
    error.innerHTML = "Please enter your email address.";
    return false;
  }

  // Presence check: age must not be empty
  if (age === "") {
    error.innerHTML = "Please enter your age.";
    return false;
  }

  // Range check: age must be between 16 and 99
  if (age < 16 || age > 99) {
    error.innerHTML = "Age must be between 16 and 99.";
    return false;
  }

  // Presence check: a destination must be chosen
  if (destination === "") {
    error.innerHTML = "Please choose a destination you are interested in.";
    return false;
  }

  error.style.color = "#1B4D3E";
  error.innerHTML = "Thank you, " + name + ". Your enquiry about " +
    destination + " has been sent. We will reply to you soon.";
  return false; // stops the page reloading (we have no server)
}

// ========================================================================
// MODULAR FEATURE: GALLERY LIGHTBOX
// ========================================================================
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCredit = document.getElementById("lightbox-credit");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!lightbox) return; // only runs on pages that have a lightbox

  const figures = Array.from(document.querySelectorAll("#gallery figure[data-src]"));
  if (figures.length === 0) return;

  let currentIndex = 0;

  function show(index) {
    if (index < 0) index = figures.length - 1;
    if (index >= figures.length) index = 0;
    currentIndex = index;

    const fig = figures[currentIndex];
    const src = fig.getAttribute("data-src");
    const caption = fig.getAttribute("data-caption") || "";
    const credit = fig.getAttribute("data-credit") || "";

    lightboxImg.src = src;
    lightboxImg.alt = fig.querySelector("img").alt || caption;
    lightboxCaption.textContent = caption;
    lightboxCredit.innerHTML = credit;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  figures.forEach((fig, i) => {
    fig.addEventListener("click", () => show(i));
  });

  closeBtn.addEventListener("click", close);

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    show(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    show(currentIndex + 1);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  // Close when clicking the backdrop (not the content)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
}

// ========================================================================
// MODULAR FEATURE: DESTINATION CATEGORY FILTERS
// ========================================================================
function initFilters() {
  const btns = Array.from(document.querySelectorAll(".filter-btn"));
  const cards = Array.from(document.querySelectorAll("#destination-list .destination"));
  if (btns.length === 0 || cards.length === 0) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      // Update active button state
      btns.forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-category") === category);
      });

      // Filter cards with a smooth opacity transition
      cards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        const show = category === "all" || cat === category;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}

// ========================================================================
// MODULAR FEATURE: ACTIVE PAGE HIGHLIGHT IN NAV
// ========================================================================
function initActiveNav() {
  const links = Array.from(document.querySelectorAll("nav ul li a"));
  if (links.length === 0) return;

  // Get the current page filename (e.g. "gallery.html")
  const currentFile = location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === currentFile);
  });
}

// ========================================================================
// INITIALISE ALL FEATURES (safe to call on every page)
// ========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initActiveNav();
  initLightbox();
  initFilters();
  initTravelGrid();
  initDestinationModal();
});
// ========================================================================
// MODULAR FEATURE: TRAVEL PLANNING GRID & MODALS
// ========================================================================
function initTravelGrid() {
  const cards = Array.from(document.querySelectorAll(".travel-card"));
  const modal = document.getElementById("travel-modal");
  const closeBtn = document.getElementById("travel-modal-close");
  const modalTitle = document.getElementById("travel-modal-title");
  const modalSummary = document.getElementById("travel-modal-summary");
  const modalBody = document.getElementById("travel-modal-body");

  if (!modal || cards.length === 0) return;

  const travelData = {
    visa: {
      title: "Visa Guide",
      summary: "Essential tourist visa requirements, entry permits, and passport validity rules (passport must be valid for 6+ months).",
      body: `
        <h4 style="color:#1B4D3E;">How to apply</h4>
        <ol style="color:#4A4A4A; line-height:1.7;">
          <li><strong>Check your passport:</strong> Must be valid for at least 6 months beyond your intended stay.</li>
          <li><strong>Contact the nearest Eritrean embassy or consulate</strong> in your country to request the tourist visa application form.</li>
          <li><strong>Submit required documents:</strong> completed application, passport photos, flight itinerary, proof of accommodation, and visa fee.</li>
          <li><strong>Wait for processing:</strong> Typically 5–10 business days (varies by embassy).</li>
          <li><strong>Collect your visa</strong> or receive an eVisa, and carry a copy with you when travelling.</li>
        </ol>
        <p style="color:#4A4A4A; margin-top:14px;"><em>Note: Some nationalities may be eligible for a visa on arrival at Asmara International Airport (ASM) — always confirm current rules before you travel.</em></p>
      `,
    },
    essentials: {
      title: "Essentials",
      summary: "Cultural etiquette, local customs, emergency contacts, and power plug standards (Type C / L, 230V).",
      body: `
        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">Cultural etiquette <span class="accordion-arrow">&#9654;</span></div>
          <div class="accordion-content">
            <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
              <li>Dress modestly, especially when visiting churches, mosques, and government buildings.</li>
              <li>Greet elders first and use the right hand for eating, greeting, and handing items to others.</li>
              <li>Accept offers of coffee or tea — hospitality is an important part of Eritrean culture.</li>
              <li>Ask permission before photographing people, military sites, or government buildings.</li>
            </ul>
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">Emergency contacts <span class="accordion-arrow">&#9654;</span></div>
          <div class="accordion-content">
            <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
              <li>Police: <strong>113</strong></li>
              <li>Ambulance: <strong>112</strong></li>
              <li>Fire: <strong>111</strong></li>
            </ul>
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">Power plugs <span class="accordion-arrow">&#9654;</span></div>
          <div class="accordion-content">
            <p style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 0;">Type C and Type L plugs, 230V, 50Hz. Bring a universal travel adapter.</p>
          </div>
        </div>
      `,
    },
    flights: {
      title: "Flights",
      summary: "Direct and connecting routes into Asmara International Airport (ASM) via flydubai, EgyptAir, and Turkish Airlines.",
      body: `
        <h4 style="color:#1B4D3E;">Routes into Asmara (ASM)</h4>
        <table style="width:100%; border-collapse:collapse; color:#4A4A4A; line-height:1.7;">
          <thead>
            <tr style="border-bottom:2px solid #1B4D3E;">
              <th style="text-align:left; padding:8px;">Airline</th>
              <th style="text-align:left; padding:8px;">Route</th>
              <th style="text-align:left; padding:8px;">Approx. duration</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #E0E0E0;">
              <td style="padding:8px;"><strong>flydubai</strong></td>
              <td style="padding:8px;">Dubai (DXB) &rarr; Asmara (ASM)</td>
              <td style="padding:8px;">~3h 40m direct</td>
            </tr>
            <tr style="border-bottom:1px solid #E0E0E0;">
              <td style="padding:8px;"><strong>EgyptAir</strong></td>
              <td style="padding:8px;">Cairo (CAI) &rarr; Asmara (ASM)</td>
              <td style="padding:8px;">~2h 30m direct</td>
            </tr>
            <tr style="border-bottom:1px solid #E0E0E0;">
              <td style="padding:8px;"><strong>Turkish Airlines</strong></td>
              <td style="padding:8px;">Istanbul (IST) &rarr; Asmara (ASM), connecting</td>
              <td style="padding:8px;">~6–8h</td>
            </tr>
          </tbody>
        </table>
        <h4 style="color:#1B4D3E; margin-top:18px;">Airport transit tips</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
          <li>ASM is about 7 km southeast of Asmara city centre (&asymp;20 minutes by taxi).</li>
          <li>Pre-arrange an airport pickup with your hotel where possible.</li>
          <li>Official taxis are available outside the terminal — agree the fare before departing.</li>
        </ul>
      `,
    },
    accommodation: {
      title: "Accommodation",
      summary: "Historic heritage hotels in Asmara (Art Deco landmarks), boutique stays, and coastal resorts in Massawa.",
      body: `
        <h4 style="color:#1B4D3E;">Recommended stays by region</h4>
        <div style="color:#4A4A4A; line-height:1.7;">
          <p><strong>Asmara (highlands):</strong></p>
          <ul style="margin:6px 0 14px 18px; padding:0;">
            <li>Heritage and Art Deco hotels in the city centre</li>
            <li>Boutique guesthouses with historic charm</li>
            <li>Mid-range hotels near the main boulevards</li>
          </ul>
          <p><strong>Massawa (coast):</strong></p>
          <ul style="margin:6px 0 14px 18px; padding:0;">
            <li>Coastal resorts with Red Sea views</li>
            <li>Historic port-town guesthouses</li>
            <li>Seafood-focused properties near the waterfront</li>
          </ul>
          <p><strong>Other regions:</strong> Eco-lodges and community guesthouses are available outside Asmara (internal travel permits required).</p>
        </div>
      `,
    },
    "getting-to": {
      title: "Getting to Eritrea",
      summary: "Air travel information — Asmara as the primary international gateway — and essential pre-arrival flight advice.",
      body: `
        <h4 style="color:#1B4D3E;">Primary gateway</h4>
        <p style="color:#4A4A4A; line-height:1.7;">Asmara International Airport (ASM) is Eritrea's main international airport, located about 7 km southeast of the capital.</p>
        <h4 style="color:#1B4D3E; margin-top:16px;">Pre-arrival advice</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
          <li>Confirm your visa requirements well before departure.</li>
          <li>Book your accommodation in advance, especially in Asmara and Massawa.</li>
          <li>Arrange airport transfer or confirm taxi availability on arrival.</li>
          <li>Carry cash in USD or EUR for exchange — credit cards are rarely accepted.</li>
          <li>Download offline maps and save emergency contacts before you travel.</li>
        </ul>
      `,
    },
    "getting-around": {
      title: "Getting around Eritrea",
      summary: "Travel permits (required outside Asmara), taxi services, rental cars, and regional buses.",
      body: `
        <h4 style="color:#1B4D3E;">Internal travel permits</h4>
        <p style="color:#4A4A4A; line-height:1.7;">Travel permits are required for travel outside Asmara. Here is how to secure them upon arrival:</p>
        <ol style="color:#4A4A4A; line-height:1.7;">
          <li><strong>Arrive in Asmara</strong> and proceed to your accommodation.</li>
          <li><strong>Visit the immigration/tourism office</strong> in Asmara with your passport and a copy of your planned itinerary.</li>
          <li><strong>Submit your application</strong> listing the regions you plan to visit.</li>
          <li><strong>Pay the permit fee</strong> — processing typically takes 1–3 days.</li>
          <li><strong>Carry your permit with you</strong> at all times; checkpoints may request to see it.</li>
        </ol>
        <h4 style="color:#1B4D3E; margin-top:18px;">Local transport options</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
          <li><strong>Taxis:</strong> Widely available in cities — agree the fare before starting your journey.</li>
          <li><strong>Rental cars:</strong> Limited availability; book in advance if needed.</li>
          <li><strong>Regional buses:</strong> Affordable and connect major towns, but slower and less frequent.</li>
        </ul>
      `,
    },
    safety: {
      title: "Safety & Health",
      summary: "Health guidelines, recommended vaccinations, general safety overview, and local emergency information.",
      body: `
        <h4 style="color:#1B4D3E;">Health guidelines</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 14px 18px; padding:0;">
          <li>Recommended vaccinations: Hepatitis A, Hepatitis B, Typhoid, and Yellow Fever (check current entry requirements).</li>
          <li>Ensure routine vaccines (MMR, diphtheria-tetanus-polio) are up to date.</li>
          <li>Malaria prophylaxis may be advised for coastal and lowland areas — consult a travel clinic before departure.</li>
          <li>Drink bottled or filtered water only.</li>
        </ul>
        <h4 style="color:#1B4D3E;">Safety overview</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 14px 18px; padding:0;">
          <li>Eritrea generally has low levels of violent crime against travellers.</li>
          <li>Avoid political gatherings, demonstrations, and military areas.</li>
          <li>Exercise normal caution at night, particularly in unfamiliar areas.</li>
          <li>Carry a copy of your passport and permit; keep the originals secure.</li>
        </ul>
        <h4 style="color:#1B4D3E;">Emergency contacts</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
          <li>Police: <strong>113</strong> | Ambulance: <strong>112</strong> | Fire: <strong>111</strong></li>
        </ul>
      `,
    },
    weather: {
      title: "Weather & Currency",
      summary: "Climate breakdown (cool highlands vs. warm coast) and currency tips (Eritrean Nakfa - ERN, cash preference, exchange tips).",
      body: `
        <h4 style="color:#1B4D3E;">Climate by region</h4>
        <table style="width:100%; border-collapse:collapse; color:#4A4A4A; line-height:1.7;">
          <thead>
            <tr style="border-bottom:2px solid #1B4D3E;">
              <th style="text-align:left; padding:8px;">Region</th>
              <th style="text-align:left; padding:8px;">Climate</th>
              <th style="text-align:left; padding:8px;">Typical temperatures</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #E0E0E0;">
              <td style="padding:8px;"><strong>Asmara &amp; highlands</strong></td>
              <td style="padding:8px;">Cool, sunny, dry</td>
              <td style="padding:8px;">15–25°C year-round</td>
            </tr>
            <tr style="border-bottom:1px solid #E0E0E0;">
              <td style="padding:8px;"><strong>Massawa &amp; coast</strong></td>
              <td style="padding:8px;">Warm to hot, humid</td>
              <td style="padding:8px;">25–35°C+</td>
            </tr>
            <tr style="border-bottom:1px solid #E0E0E0;">
              <td style="padding:8px;"><strong>Western lowlands</strong></td>
              <td style="padding:8px;">Hot, arid</td>
              <td style="padding:8px;">30–40°C+</td>
            </tr>
          </tbody>
        </table>
        <p style="color:#4A4A4A; line-height:1.7; margin-top:14px;"><strong>Best time to visit:</strong> October to March — cool and dry across most of the country.</p>
        <h4 style="color:#1B4D3E; margin-top:18px;">Currency & money</h4>
        <ul style="color:#4A4A4A; line-height:1.7; margin:8px 0 0 18px; padding:0;">
          <li><strong>Currency:</strong> Eritrean Nakfa (ERN)</li>
          <li><strong>Cash is king:</strong> Credit cards are rarely accepted outside major hotels.</li>
          <li>Bring USD or EUR to exchange at banks or authorised bureaus.</li>
          <li>ATMs are limited and may not accept foreign cards — carry sufficient cash.</li>
          <li>Keep small denominations for taxis, markets, and tips.</li>
        </ul>
      `,
    },
  };

  function openModal(key) {
    const data = travelData[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalSummary.textContent = data.summary;
    modalBody.innerHTML = data.body;

    // Reset accordions
    document.querySelectorAll(".accordion-content").forEach((el) => {
      el.classList.remove("open");
      el.style.maxHeight = "0";
    });
    document.querySelectorAll(".accordion-arrow").forEach((el) => {
      el.textContent = "&#9654;";
    });

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-topic");
      openModal(key);
    });
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
  });
}

// ========================================================================
// MODULAR FEATURE: DESTINATION DETAILS MODAL (areas, hotels, restaurants)
// ========================================================================
function initDestinationModal() {
  const cards = Array.from(document.querySelectorAll("#destination-list .destination[data-destination]"));
  const modal = document.getElementById("destination-modal");
  const closeBtn = document.getElementById("destination-modal-close");
  const modalTitle = document.getElementById("destination-modal-title");
  const modalSummary = document.getElementById("destination-modal-summary");
  const modalBody = document.getElementById("destination-modal-body");

  if (!modal || cards.length === 0) return;

  const destinationData = {
    asmara: {
      title: "Asmara — Areas & Places to Visit",
      summary: "Discover the capital's districts, landmarks, hotels, and restaurants.",
      items: [
        { label: "City Centre", type: "Area", desc: "Historic heart with Art Deco buildings, cafes, and the main market." },
        { label: "Harnet Avenue", type: "Street", desc: "Main boulevard lined with shops, cinemas, and Italian-style architecture." },
        { label: "Fiat Tagliero Building", type: "Landmark", desc: "Iconic futurist service station designed to look like an airplane." },
        { label: "Asmara Cathedral", type: "Landmark", desc: "Romanesque-Lombard style cathedral with a tall bell tower." },
        { label: "Hotel Asmara Palace", type: "Hotel", desc: "Upscale hotel with city views, pool, and dining." },
        { label: "Crystal Hotel", type: "Hotel", desc: "Central hotel known for comfort and service." },
        { label: "Sara Restaurant", type: "Restaurant", desc: "Traditional Eritrean cuisine with injera and stews." },
        { label: "Castelli Restaurant", type: "Restaurant", desc: "Italian-Eritrean fusion in a historic setting." }
      ]
    },
    massawa: {
      title: "Massawa — Areas & Places to Visit",
      summary: "Explore the Red Sea port's historic districts, hotels, and seafood restaurants.",
      items: [
        { label: "Old Town (Tauda)", type: "Area", desc: "Historic Ottoman-era district with coral stone houses and narrow alleys." },
        { label: "Massawa Port", type: "Area", desc: "Bustling harbour with fishing boats and ferries to the Dahlak Islands." },
        { label: "Mosque of the Companions", type: "Landmark", desc: "Massawa, Eritrea — 613–615 CE. Built by early Muslims fleeing persecution; the oldest in Africa." },
        { label: "Italian Building", type: "Landmark", desc: "Colonial-era architecture overlooking the port." },
        { label: "Grand Dahlak Hotel", type: "Hotel", desc: "Waterfront hotel with Red Sea views." },
        { label: "Massawa Hotel", type: "Hotel", desc: "Central hotel close to the port and Old Town." },
        { label: "Red Sea Restaurant", type: "Restaurant", desc: "Fresh grilled fish and seafood by the harbour." },
        { label: "Ottoman Cafe", type: "Restaurant", desc: "Traditional coffee and light meals in a historic setting." }
      ]
    },
    dahlak: {
      title: "Dahlak Islands — Areas & Places to Visit",
      summary: "Pristine islands, coral reefs, and marine life in the Red Sea.",
      items: [
        { label: "Dahlak Kebir", type: "Island", desc: "Largest island with sandy beaches and clear waters." },
        { label: "Dahlak Archipelago Marine Park", type: "Area", desc: "Protected marine area ideal for diving and snorkelling." },
        { label: "Coral Reef Gardens", type: "Attraction", desc: "Vibrant coral reefs teeming with tropical fish." },
        { label: "Shipwreck Dive Sites", type: "Attraction", desc: "Historic wrecks for experienced divers." },
        { label: "Island Eco-Lodge", type: "Hotel", desc: "Simple beachfront accommodation on the islands." },
        { label: "Boat Charter", type: "Service", desc: "Hire a boat for island hopping and fishing trips." },
        { label: "Beach Picnic Spot", type: "Restaurant", desc: "Fresh seafood lunches served on the sand." },
        { label: "Snorkelling Gear Rental", type: "Service", desc: "Masks, fins, and guides available at the port." }
      ]
    },
    qohaito: {
      title: "Qohaito — Areas & Places to Visit",
      summary: "Ancient archaeological site with pre-Axumite ruins and mountain views.",
      items: [
        { label: "Pre-Axumite Ruins", type: "Landmark", desc: "Ancient stone structures and temple foundations." },
        { label: "Rock Art Sites", type: "Attraction", desc: "Prehistoric paintings depicting animals and daily life." },
        { label: "Qohaito Plateau", type: "Area", desc: "Highland plateau with panoramic views over the surrounding landscape." },
        { label: "Great Wall of Qohaito", type: "Landmark", desc: "Ancient defensive wall remains." },
        { label: "Hiking Trailhead", type: "Area", desc: "Marked trails through the archaeological landscape." },
        { label: "Village Guesthouse", type: "Hotel", desc: "Simple local accommodation near the site." },
        { label: "Trailside Cafe", type: "Restaurant", desc: "Light meals and coffee for hikers." },
        { label: "Local Guide Service", type: "Service", desc: "Knowledgeable guides for the ruins and trails." }
      ]
    },
    filfil: {
      title: "Filfil & Selam — Areas & Places to Visit",
      summary: "Lush green highlands with coffee plantations, walking trails, and cool weather.",
      items: [
        { label: "Coffee Plantations", type: "Area", desc: "Shade-grown coffee farms on the green slopes." },
        { label: "Selam Forest", type: "Area", desc: "Dense forest with walking trails and birdlife." },
        { label: "Filfil Viewpoint", type: "Attraction", desc: "Panoramic views over the highlands and escarpment." },
        { label: "Mountain Walking Trails", type: "Attraction", desc: "Cool, shaded trails through forest and farmland." },
        { label: "Eco-Lodge Filfil", type: "Hotel", desc: "Simple mountain accommodation with forest views." },
        { label: "Village Homestay", type: "Hotel", desc: "Stay with a local family in the highlands." },
        { label: "Forest Cafe", type: "Restaurant", desc: "Fresh coffee and traditional dishes in a forest setting." },
        { label: "Trail Guide Service", type: "Service", desc: "Local guides for walking and birdwatching." }
      ]
    }
  };

  function openDestination(key) {
    const data = destinationData[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalSummary.textContent = data.summary;

    let html = "";
    data.items.forEach((item) => {
      html += `
        <div class="destination-item">
          <span class="destination-item-type">${item.type}</span>
          <strong>${item.label}</strong>
          <p>${item.desc}</p>
        </div>
      `;
    });
    modalBody.innerHTML = html;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDestination() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  cards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-destination");
      openDestination(key);
    });
  });

  closeBtn.addEventListener("click", closeDestination);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeDestination();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeDestination();
  });
}

// Accordion toggle (used by travel modal HTML)
window.toggleAccordion = function (header) {
  const item = header.parentElement;
  const content = item.querySelector(".accordion-content");
  const arrow = header.querySelector(".accordion-arrow");
  const isOpen = content.classList.contains("open");

  document.querySelectorAll(".accordion-content").forEach((el) => {
    el.classList.remove("open");
    el.style.maxHeight = "0";
  });
  document.querySelectorAll(".accordion-arrow").forEach((el) => {
    el.textContent = "&#9654;";
  });

  if (!isOpen) {
    content.classList.add("open");
    content.style.maxHeight = "600px";
    arrow.textContent = "&#9660;";
  }
};
