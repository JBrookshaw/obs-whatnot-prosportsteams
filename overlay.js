const STORAGE_KEY_PREFIX = "team-overlay-selected-teams-v2";
const STORAGE_LEAGUE_KEY = "team-overlay-active-league-v1";
const STORAGE_SIZE_KEY = "team-overlay-active-size-v1";
const SIZE_OPTIONS = ["small", "medium", "large"];

const NFL_ORDER = [
  "BUF", "MIA", "NE", "NYJ",
  "BAL", "CIN", "CLE", "PIT",
  "HOU", "IND", "JAX", "TEN",
  "DEN", "KC", "LV", "LAC",
  "DAL", "NYG", "PHI", "WAS",
  "CHI", "DET", "GB", "MIN",
  "ATL", "CAR", "NO", "TB",
  "ARI", "LAR", "SF", "SEA"
];

const NBA_ORDER = [
  "ATL", "BOS", "BKN", "CHA", "CHI",
  "CLE", "DAL", "DEN", "DET", "GSW",
  "HOU", "IND", "LAC", "LAL", "MEM",
  "MIA", "MIL", "MIN", "NOP", "NYK",
  "OKC", "ORL", "PHI", "PHX", "POR",
  "SAC", "SAS", "TOR", "UTA", "WAS"
];

const MLB_ORDER = [
  "BAL", "BOS", "NYY", "TB", "TOR",
  "CHW", "CLE", "DET", "KC", "MIN",
  "HOU", "LAA", "OAK", "SEA", "TEX",
  "ATL", "MIA", "NYM", "PHI", "WSH",
  "CHC", "CIN", "MIL", "PIT", "STL",
  "ARI", "COL", "LAD", "SD", "SF"
];

const MLS_ORDER = [
  "ATL", "ATX", "MTL", "CLT", "CHI",
  "COL", "CLB", "DC", "CIN", "DAL",
  "HOU", "MIA", "LA", "LAFC", "MIN",
  "NSH", "NE", "NYC", "ORL", "PHI",
  "POR", "RSL", "RBNY", "SD", "SJ",
  "SEA", "SKC", "STL", "TOR", "VAN"
];

const NHL_ORDER = [
  "BOS", "BUF", "DET", "FLA", "MTL", "OTT", "TBL", "TOR",
  "CAR", "CBJ", "NJD", "NYI", "NYR", "PHI", "PIT", "WSH",
  "CHI", "COL", "DAL", "MIN", "NSH", "STL", "UTA", "WPG",
  "ANA", "CGY", "EDM", "LAK", "SEA", "SJS", "VAN", "VGK"
];

const WNBA_ORDER = [
  "ATL", "CHI", "CON", "DAL", "GS",
  "IND", "LA", "LV", "MIN", "NY",
  "PHX", "POR", "SEA", "TOR", "WSH"
];

const LEAGUES = {
  NFL: {
    label: "NFL",
    ariaLabel: "NFL teams",
    order: NFL_ORDER,
    teams: {
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
    },
    getLogoSrc: (team) => `./assets/logos/${team.logo}.png`
  },
  NBA: {
    label: "NBA",
    ariaLabel: "NBA teams",
    order: NBA_ORDER,
    teams: {
      ATL: { name: "Hawks", logo: "atl" },
      BOS: { name: "Celtics", logo: "bos" },
      BKN: { name: "Nets", logo: "bkn" },
      CHA: { name: "Hornets", logo: "cha" },
      CHI: { name: "Bulls", logo: "chi" },
      CLE: { name: "Cavaliers", logo: "cle" },
      DAL: { name: "Mavericks", logo: "dal" },
      DEN: { name: "Nuggets", logo: "den" },
      DET: { name: "Pistons", logo: "det" },
      GSW: { name: "Warriors", logo: "gsw" },
      HOU: { name: "Rockets", logo: "hou" },
      IND: { name: "Pacers", logo: "ind" },
      LAC: { name: "Clippers", logo: "lac" },
      LAL: { name: "Lakers", logo: "lal" },
      MEM: { name: "Grizzlies", logo: "mem" },
      MIA: { name: "Heat", logo: "mia" },
      MIL: { name: "Bucks", logo: "mil" },
      MIN: { name: "Timberwolves", logo: "min" },
      NOP: { name: "Pelicans", logo: "no" },
      NYK: { name: "Knicks", logo: "nyk" },
      OKC: { name: "Thunder", logo: "okc" },
      ORL: { name: "Magic", logo: "orl" },
      PHI: { name: "76ers", logo: "phi" },
      PHX: { name: "Suns", logo: "phx" },
      POR: { name: "Trail Blazers", logo: "por" },
      SAC: { name: "Kings", logo: "sac" },
      SAS: { name: "Spurs", logo: "sas" },
      TOR: { name: "Raptors", logo: "tor" },
      UTA: { name: "Jazz", logo: "utah" },
      WAS: { name: "Wizards", logo: "was" }
    },
    getLogoSrc: (team) => `https://a.espncdn.com/i/teamlogos/nba/500/${team.logo}.png`
  },
  MLB: {
    label: "MLB",
    ariaLabel: "MLB teams",
    order: MLB_ORDER,
    teams: {
      ARI: { name: "Diamondbacks", logo: "ari" },
      ATL: { name: "Braves", logo: "atl" },
      BAL: { name: "Orioles", logo: "bal" },
      BOS: { name: "Red Sox", logo: "bos" },
      CHC: { name: "Cubs", logo: "chc" },
      CHW: { name: "White Sox", logo: "chw" },
      CIN: { name: "Reds", logo: "cin" },
      CLE: { name: "Guardians", logo: "cle" },
      COL: { name: "Rockies", logo: "col" },
      DET: { name: "Tigers", logo: "det" },
      HOU: { name: "Astros", logo: "hou" },
      KC: { name: "Royals", logo: "kc" },
      LAA: { name: "Angels", logo: "laa" },
      LAD: { name: "Dodgers", logo: "lad" },
      MIA: { name: "Marlins", logo: "mia" },
      MIL: { name: "Brewers", logo: "mil" },
      MIN: { name: "Twins", logo: "min" },
      NYM: { name: "Mets", logo: "nym" },
      NYY: { name: "Yankees", logo: "nyy" },
      OAK: { name: "Athletics", logo: "oak" },
      PHI: { name: "Phillies", logo: "phi" },
      PIT: { name: "Pirates", logo: "pit" },
      SD: { name: "Padres", logo: "sd" },
      SEA: { name: "Mariners", logo: "sea" },
      SF: { name: "Giants", logo: "sf" },
      STL: { name: "Cardinals", logo: "stl" },
      TB: { name: "Rays", logo: "tb" },
      TEX: { name: "Rangers", logo: "tex" },
      TOR: { name: "Blue Jays", logo: "tor" },
      WSH: { name: "Nationals", logo: "wsh" }
    },
    getLogoSrc: (team) => `https://a.espncdn.com/i/teamlogos/mlb/500/${team.logo}.png`
  },
  MLS: {
    label: "MLS",
    ariaLabel: "MLS teams",
    order: MLS_ORDER,
    teams: {
      ATL: { name: "Atlanta United FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/18418.png" },
      ATX: { name: "Austin FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/20906.png" },
      MTL: { name: "CF Montreal", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/9720.png" },
      CLT: { name: "Charlotte FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/21300.png" },
      CHI: { name: "Chicago Fire FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/182.png" },
      COL: { name: "Colorado Rapids", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/184.png" },
      CLB: { name: "Columbus Crew", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/183.png" },
      DC: { name: "D.C. United", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/193.png" },
      CIN: { name: "FC Cincinnati", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/18267.png" },
      DAL: { name: "FC Dallas", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/185.png" },
      HOU: { name: "Houston Dynamo FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/6077.png" },
      MIA: { name: "Inter Miami CF", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/20232.png" },
      LA: { name: "LA Galaxy", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/187.png" },
      LAFC: { name: "LAFC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/18966.png" },
      MIN: { name: "Minnesota United FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/17362.png" },
      NSH: { name: "Nashville SC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/18986.png" },
      NE: { name: "New England Revolution", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/189.png" },
      NYC: { name: "New York City FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/17606.png" },
      ORL: { name: "Orlando City SC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/12011.png" },
      PHI: { name: "Philadelphia Union", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/10739.png" },
      POR: { name: "Portland Timbers", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/9723.png" },
      RSL: { name: "Real Salt Lake", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/4771.png" },
      RBNY: { name: "Red Bull New York", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/190.png" },
      SD: { name: "San Diego FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/22529.png" },
      SJ: { name: "San Jose Earthquakes", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/191.png" },
      SEA: { name: "Seattle Sounders FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/9726.png" },
      SKC: { name: "Sporting Kansas City", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/186.png" },
      STL: { name: "St. Louis CITY SC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/21812.png" },
      TOR: { name: "Toronto FC", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/7318.png" },
      VAN: { name: "Vancouver Whitecaps", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/9727.png" }
    },
    getLogoSrc: (team) => team.logo
  },
  NHL: {
    label: "NHL",
    ariaLabel: "NHL teams",
    order: NHL_ORDER,
    teams: {
      ANA: { name: "Ducks", logo: "ana" },
      BOS: { name: "Bruins", logo: "bos" },
      BUF: { name: "Sabres", logo: "buf" },
      CGY: { name: "Flames", logo: "cgy" },
      CAR: { name: "Hurricanes", logo: "car" },
      CHI: { name: "Blackhawks", logo: "chi" },
      COL: { name: "Avalanche", logo: "col" },
      CBJ: { name: "Blue Jackets", logo: "cbj" },
      DAL: { name: "Stars", logo: "dal" },
      DET: { name: "Red Wings", logo: "det" },
      EDM: { name: "Oilers", logo: "edm" },
      FLA: { name: "Panthers", logo: "fla" },
      LAK: { name: "Kings", logo: "la" },
      MIN: { name: "Wild", logo: "min" },
      MTL: { name: "Canadiens", logo: "mtl" },
      NSH: { name: "Predators", logo: "nsh" },
      NJD: { name: "Devils", logo: "njd" },
      NYI: { name: "Islanders", logo: "nyi" },
      NYR: { name: "Rangers", logo: "nyr" },
      OTT: { name: "Senators", logo: "ott" },
      PHI: { name: "Flyers", logo: "phi" },
      PIT: { name: "Penguins", logo: "pit" },
      SEA: { name: "Kraken", logo: "sea" },
      SJS: { name: "Sharks", logo: "sj" },
      STL: { name: "Blues", logo: "stl" },
      TBL: { name: "Lightning", logo: "tb" },
      TOR: { name: "Maple Leafs", logo: "tor" },
      UTA: { name: "Utah Hockey Club", logo: "uta" },
      VAN: { name: "Canucks", logo: "van" },
      VGK: { name: "Golden Knights", logo: "vgk" },
      WPG: { name: "Jets", logo: "wpg" },
      WSH: { name: "Capitals", logo: "wsh" }
    },
    getLogoSrc: (team) => `https://a.espncdn.com/i/teamlogos/nhl/500/${team.logo}.png`
  },
  WNBA: {
    label: "WNBA",
    ariaLabel: "WNBA teams",
    order: WNBA_ORDER,
    teams: {
      ATL: { name: "Dream", logo: "atl" },
      CHI: { name: "Sky", logo: "chi" },
      CON: { name: "Sun", logo: "con" },
      DAL: { name: "Wings", logo: "dal" },
      GS: { name: "Valkyries", logo: "gs" },
      IND: { name: "Fever", logo: "ind" },
      LA: { name: "Sparks", logo: "la" },
      LV: { name: "Aces", logo: "lv" },
      MIN: { name: "Lynx", logo: "min" },
      NY: { name: "Liberty", logo: "ny" },
      PHX: { name: "Mercury", logo: "phx" },
      POR: { name: "Fire", logo: "por" },
      SEA: { name: "Storm", logo: "sea" },
      TOR: { name: "Tempo", logo: "tor" },
      WSH: { name: "Mystics", logo: "wsh" }
    },
    getLogoSrc: (team) => `https://a.espncdn.com/i/teamlogos/wnba/500/${team.logo}.png`
  }
};

let activeLeague = loadActiveLeague();
let activeSize = loadActiveSize();
let selectedTeams = new Set(loadSelectedTeams(activeLeague));

const sectionsEl = document.getElementById("sections");
const resetButton = document.getElementById("reset-button");
const countEl = document.getElementById("chosen-count");
const leagueButtonsEl = document.getElementById("league-buttons");
const sizeButtonsEl = document.getElementById("size-buttons");

if (sectionsEl) {
  sectionsEl.addEventListener("click", (event) => {
    const card = event.target.closest("[data-team]");
    if (!card) {
      return;
    }

    toggleTeam(card.dataset.team, card);
  });
}

if (resetButton) {
  resetButton.addEventListener("click", resetAll);
}

if (leagueButtonsEl) {
  leagueButtonsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-league]");
    if (!button) {
      return;
    }

    setActiveLeague(button.dataset.league);
  });
}

if (sizeButtonsEl) {
  sizeButtonsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-size]");
    if (!button) {
      return;
    }

    setActiveSize(button.dataset.size);
  });
}

document.addEventListener("keydown", (event) => {
  const focusedTag = document.activeElement?.tagName;
  if (focusedTag === "INPUT" || focusedTag === "TEXTAREA" || focusedTag === "SELECT") {
    return;
  }

  if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) {
    resetAll();
  }
});

render();
updateCounter();
syncLeagueUi();
syncSizeUi();

function render() {
  if (!sectionsEl) {
    return;
  }

  const league = LEAGUES[activeLeague];
  const fragment = document.createDocumentFragment();

  for (const teamCode of league.order) {
    fragment.appendChild(createTeamCard(teamCode));
  }

  sectionsEl.replaceChildren(fragment);
}

function createTeamCard(teamCode) {
  const league = LEAGUES[activeLeague];
  const team = league.teams[teamCode];

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
  logo.src = league.getLogoSrc(team);
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

function setActiveLeague(leagueCode) {
  if (!LEAGUES[leagueCode] || leagueCode === activeLeague) {
    return;
  }

  activeLeague = leagueCode;
  selectedTeams = new Set(loadSelectedTeams(activeLeague));
  persistActiveLeague();
  render();
  updateCounter();
  syncLeagueUi();
}

function setActiveSize(sizeCode) {
  if (!SIZE_OPTIONS.includes(sizeCode) || sizeCode === activeSize) {
    return;
  }

  activeSize = sizeCode;
  persistActiveSize();
  syncSizeUi();
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

  if (sectionsEl) {
    sectionsEl.querySelectorAll("[data-team]").forEach((card) => {
      card.classList.remove("chosen");
      card.setAttribute("aria-pressed", "false");
    });
  }

  updateCounter();
}

function syncLeagueUi() {
  const league = LEAGUES[activeLeague];

  if (sectionsEl) {
    sectionsEl.setAttribute("aria-label", league.ariaLabel);
  }

  if (leagueButtonsEl) {
    leagueButtonsEl.querySelectorAll("[data-league]").forEach((button) => {
      const isActive = button.dataset.league === activeLeague;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }
}

function syncSizeUi() {
  applySizeClass();

  if (sizeButtonsEl) {
    sizeButtonsEl.querySelectorAll("[data-size]").forEach((button) => {
      const isActive = button.dataset.size === activeSize;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }
}

function applySizeClass() {
  if (!sectionsEl) {
    return;
  }

  sectionsEl.classList.remove("size-small", "size-medium", "size-large");
  sectionsEl.classList.add(`size-${activeSize}`);
}

function updateCounter() {
  if (!countEl) {
    return;
  }

  countEl.textContent = `${selectedTeams.size} selected`;
}

function loadActiveLeague() {
  try {
    const leagueCode = localStorage.getItem(STORAGE_LEAGUE_KEY);
    if (leagueCode && LEAGUES[leagueCode]) {
      return leagueCode;
    }
  } catch {
    // Ignore localStorage failures and fallback to NFL.
  }

  return "NFL";
}

function persistActiveLeague() {
  localStorage.setItem(STORAGE_LEAGUE_KEY, activeLeague);
}

function loadActiveSize() {
  try {
    const sizeCode = localStorage.getItem(STORAGE_SIZE_KEY);
    if (sizeCode && SIZE_OPTIONS.includes(sizeCode)) {
      return sizeCode;
    }
  } catch {
    // Ignore localStorage failures and fallback to medium.
  }

  return "medium";
}

function persistActiveSize() {
  localStorage.setItem(STORAGE_SIZE_KEY, activeSize);
}

function storageKeyForLeague(leagueCode) {
  return `${STORAGE_KEY_PREFIX}:${leagueCode}`;
}

function loadSelectedTeams(leagueCode) {
  const league = LEAGUES[leagueCode];
  if (!league) {
    return [];
  }

  try {
    const raw = localStorage.getItem(storageKeyForLeague(leagueCode));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((teamCode) => league.teams[teamCode]);
  } catch {
    return [];
  }
}

function persistSelectedTeams() {
  localStorage.setItem(storageKeyForLeague(activeLeague), JSON.stringify([...selectedTeams]));
}
