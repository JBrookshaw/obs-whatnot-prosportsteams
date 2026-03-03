const STORAGE_KEY = "nfl-overlay-selected-teams-v1";

const TEAM_ORDER = [
  "BUF", "MIA", "NE", "NYJ",
  "BAL", "CIN", "CLE", "PIT",
  "HOU", "IND", "JAX", "TEN",
  "DEN", "KC", "LV", "LAC",
  "DAL", "NYG", "PHI", "WAS",
  "CHI", "DET", "GB", "MIN",
  "ATL", "CAR", "NO", "TB",
  "ARI", "LAR", "SF", "SEA"
];

const TEAMS = {
  ARI: { name: "Cardinals", logo: "ari" },
  ATL: { name: "Falcons", logo: "atl" },
  BAL: { name: "Ravens", logo: "bal" },
  BUF: { name: "Bills", logo: "buf" },
  CAR: { name: "Panthers", logo: "car" },
  CHI: { name: "Bears", logo: "chi" },
  CIN: { name: "Bengals", logo: "cin" },
  CLE: { name: "Browns", logo: "cle" },
  DAL: { name: "Cowboys", logo: "dal" },
  DEN: { name: "Broncos", logo: "den" },
  DET: { name: "Lions", logo: "det" },
  GB: { name: "Packers", logo: "gb" },
  HOU: { name: "Texans", logo: "hou" },
  IND: { name: "Colts", logo: "ind" },
  JAX: { name: "Jaguars", logo: "jax" },
  KC: { name: "Chiefs", logo: "kc" },
  LV: { name: "Raiders", logo: "lv" },
  LAC: { name: "Chargers", logo: "lac" },
  LAR: { name: "Rams", logo: "lar" },
  MIA: { name: "Dolphins", logo: "mia" },
  MIN: { name: "Vikings", logo: "min" },
  NE: { name: "Patriots", logo: "ne" },
  NO: { name: "Saints", logo: "no" },
  NYG: { name: "Giants", logo: "nyg" },
  NYJ: { name: "Jets", logo: "nyj" },
  PHI: { name: "Eagles", logo: "phi" },
  PIT: { name: "Steelers", logo: "pit" },
  SEA: { name: "Seahawks", logo: "sea" },
  SF: { name: "49ers", logo: "sf" },
  TB: { name: "Buccaneers", logo: "tb" },
  TEN: { name: "Titans", logo: "ten" },
  WAS: { name: "Commanders", logo: "was" }
};

const selectedTeams = new Set(loadSelectedTeams());

const sectionsEl = document.getElementById("sections");
const resetButton = document.getElementById("reset-button");

render();
updateCounter();

sectionsEl.addEventListener("click", (event) => {
  const card = event.target.closest("[data-team]");
  if (!card) {
    return;
  }

  toggleTeam(card.dataset.team, card);
});

if (resetButton) {
  resetButton.addEventListener("click", resetAll);
}

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) {
    resetAll();
  }
});

function render() {
  const fragment = document.createDocumentFragment();

  for (const teamCode of TEAM_ORDER) {
    fragment.appendChild(createTeamCard(teamCode));
  }

  sectionsEl.replaceChildren(fragment);
}

function createTeamCard(teamCode) {
  const team = TEAMS[teamCode];

  const card = document.createElement("button");
  card.type = "button";
  card.className = "team-card";
  card.dataset.team = teamCode;
  card.setAttribute("aria-pressed", selectedTeams.has(teamCode) ? "true" : "false");

  if (selectedTeams.has(teamCode)) {
    card.classList.add("chosen");
  }

  const logo = document.createElement("img");
  logo.className = "team-logo";
  logo.src = `./assets/logos/${team.logo}.png`;
  logo.alt = `${teamCode} ${team.name} logo`;
  logo.loading = "lazy";
  logo.addEventListener("error", () => card.classList.add("missing"), { once: true });

  const abbr = document.createElement("span");
  abbr.className = "team-abbr";
  abbr.textContent = teamCode;

  const name = document.createElement("span");
  name.className = "team-name";
  name.textContent = team.name;

  card.append(logo, abbr, name);
  return card;
}

function toggleTeam(teamCode, card) {
  if (selectedTeams.has(teamCode)) {
    selectedTeams.delete(teamCode);
    card.classList.remove("chosen");
    card.setAttribute("aria-pressed", "false");
  } else {
    selectedTeams.add(teamCode);
    card.classList.add("chosen");
    card.setAttribute("aria-pressed", "true");
  }

  persistSelectedTeams();
  updateCounter();
}

function resetAll() {
  selectedTeams.clear();
  persistSelectedTeams();

  sectionsEl.querySelectorAll("[data-team]").forEach((card) => {
    card.classList.remove("chosen");
    card.setAttribute("aria-pressed", "false");
  });

  updateCounter();
}

function updateCounter() {
  const countEl = document.getElementById("chosen-count");
  if (countEl) {
    const count = selectedTeams.size;
    countEl.textContent = `${count} selected`;
  }
}

function loadSelectedTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((teamCode) => TEAMS[teamCode]);
  } catch {
    return [];
  }
}

function persistSelectedTeams() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedTeams]));
}
