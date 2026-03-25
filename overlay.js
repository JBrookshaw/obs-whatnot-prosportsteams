const STORAGE_KEY_PREFIX = "team-overlay-selected-teams-v2";
const STORAGE_ASSIGNMENTS_KEY_PREFIX = "team-overlay-player-assignments-v1";
const STORAGE_LEAGUE_KEY = "team-overlay-active-league-v1";
const STORAGE_SIZE_KEY = "team-overlay-active-size-v1";
const STORAGE_SPOT_LIST_HIDDEN_KEY = "team-overlay-spot-list-hidden-v1";
const SIZE_OPTIONS = ["small", "medium", "large"];
const API_STATE_ENDPOINT = "./api/state";
const API_OBS_CONFIG_ENDPOINT = "./api/obs/config";
const API_OBS_TEST_ENDPOINT = "./api/obs/test";
const API_OBS_SOURCE_VISIBILITY_ENDPOINT = "./api/obs/source-visibility";
const SERVER_POLL_MS = 1000;
const isSpotListView = document.body?.dataset.view === "spot-list";
const isControllerView = document.body?.dataset.view === "controller";
const OBS_TARGET_LABELS = {
  overlay: "team grid",
  spotList: "spot list",
};

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
let spotListHidden = loadSpotListHidden();
let selectionsByLeague = loadAllSelectedTeams();
let assignmentsByLeague = loadAllPlayerAssignments();
let selectedTeams = new Set(selectionsByLeague[activeLeague] || []);
let playerAssignments = { ...(assignmentsByLeague[activeLeague] || {}) };
let serverVersion = -1;
let saveStateTimer;
let serverPollTimer;
let spotListLayoutFrame;

const sectionsEl = document.getElementById("sections");
const resetButton = document.getElementById("reset-button");
const countEl = document.getElementById("chosen-count");
const leagueButtonsEl = document.getElementById("league-buttons");
const sizeButtonsEl = document.getElementById("size-buttons");
const spotListEl = document.getElementById("spot-list");
const spotListEmptyEl = document.getElementById("spot-list-empty");
const toggleSpotListButton = document.getElementById("toggle-spot-list");
const obsStatusEl = document.getElementById("obs-status");
const obsHostInput = document.getElementById("obs-host");
const obsPortInput = document.getElementById("obs-port");
const obsPasswordInput = document.getElementById("obs-password");
const obsOverlaySceneInput = document.getElementById("obs-overlay-scene");
const obsOverlaySourceInput = document.getElementById("obs-overlay-source");
const obsSpotListSceneInput = document.getElementById("obs-spot-list-scene");
const obsSpotListSourceInput = document.getElementById("obs-spot-list-source");
const obsSaveButton = document.getElementById("obs-save-button");
const obsTestButton = document.getElementById("obs-test-button");
const obsVisibilityButtons = document.querySelectorAll("[data-obs-target][data-obs-visible]");

if (sectionsEl && isControllerView) {
  sectionsEl.addEventListener("click", (event) => {
    const card = event.target.closest("[data-team]");
    if (!card) {
      return;
    }

    toggleTeam(card.dataset.team, card);
  });
}

if (resetButton && isControllerView) {
  resetButton.addEventListener("click", resetAll);
}

if (leagueButtonsEl && isControllerView) {
  leagueButtonsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-league]");
    if (!button) {
      return;
    }

    setActiveLeague(button.dataset.league);
  });
}

if (sizeButtonsEl && isControllerView) {
  sizeButtonsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-size]");
    if (!button) {
      return;
    }

    setActiveSize(button.dataset.size);
  });
}

if (spotListEl && isControllerView) {
  spotListEl.addEventListener("input", (event) => {
    const input = event.target.closest("[data-team-input]");
    if (!input) {
      return;
    }

    updatePlayerAssignment(input.dataset.teamInput, input.value);
  });
}

if (toggleSpotListButton && isControllerView) {
  toggleSpotListButton.addEventListener("click", toggleSpotListVisibility);
}

if (obsSaveButton && isControllerView) {
  obsSaveButton.addEventListener("click", () => {
    void saveObsConfig({ announce: "OBS settings saved." });
  });
}

if (obsTestButton && isControllerView) {
  obsTestButton.addEventListener("click", () => {
    void testObsConnectionFromController();
  });
}

if (obsVisibilityButtons.length > 0 && isControllerView) {
  obsVisibilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      void setObsVisibilityFromController(button.dataset.obsTarget, button.dataset.obsVisible === "true");
    });
  });
}

if (isSpotListView) {
  window.addEventListener("resize", scheduleSpotListLayout);
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => scheduleSpotListLayout());
  }
}

void initialize();

function render() {
  renderTeams();
  renderSpotList();
}

async function initialize() {
  render();
  updateCounter();
  syncLeagueUi();
  syncSizeUi();
  syncSpotListUi();

  if (isControllerView) {
    await loadObsConfig();
  }

  const remoteState = await fetchServerState();
  if (remoteState) {
    if (isServerStateEmpty(remoteState) && hasMeaningfulLocalState()) {
      await saveStateToServer();
    } else {
      applySharedState(remoteState, { persistLocalCache: true });
    }
  }

  startServerPolling();
}

function renderTeams() {
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
  syncDerivedLeagueState();
  persistActiveLeague();
  render();
  updateCounter();
  syncLeagueUi();
  syncSizeUi();
  syncSpotListUi();
  queueSaveStateToServer();
}

function setActiveSize(sizeCode) {
  if (!SIZE_OPTIONS.includes(sizeCode) || sizeCode === activeSize) {
    return;
  }

  activeSize = sizeCode;
  persistActiveSize();
  syncSizeUi();
  queueSaveStateToServer();
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
  renderSpotList();
  syncSpotListUi();
  queueSaveStateToServer();
}

function resetAll() {
  selectedTeams.clear();
  playerAssignments = {};
  persistSelectedTeams();
  persistPlayerAssignments();

  if (sectionsEl) {
    sectionsEl.querySelectorAll("[data-team]").forEach((card) => {
      card.classList.remove("chosen");
      card.setAttribute("aria-pressed", "false");
    });
  }

  updateCounter();
  renderSpotList();
  syncSpotListUi();
  queueSaveStateToServer();
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
  sectionsEl.classList.add(isControllerView ? "size-small" : `size-${activeSize}`);
}

function updateCounter() {
  if (!countEl) {
    return;
  }

  countEl.textContent = `${selectedTeams.size} selected`;
}

function renderSpotList() {
  if (!spotListEl) {
    return;
  }

  const focusedInputState = captureFocusedSpotListInput();
  const league = LEAGUES[activeLeague];
  const selectedTeamCodes = league.order.filter((teamCode) => selectedTeams.has(teamCode));
  const fragment = document.createDocumentFragment();

  for (const teamCode of selectedTeamCodes) {
    fragment.appendChild(createSpotListItem(teamCode));
  }

  spotListEl.replaceChildren(fragment);
  restoreFocusedSpotListInput(focusedInputState);
  scheduleSpotListLayout();
}

function createSpotListItem(teamCode) {
  const league = LEAGUES[activeLeague];
  const team = league.teams[teamCode];

  const item = document.createElement("label");
  item.className = "spot-list-item";

  const logoWrap = document.createElement("span");
  logoWrap.className = "spot-list-logo-wrap";

  const logo = document.createElement("img");
  logo.className = "spot-list-logo";
  logo.src = league.getLogoSrc(team);
  logo.alt = `${teamCode} ${team.name} logo`;
  logo.loading = "lazy";

  const input = document.createElement("input");
  input.className = "spot-list-input";
  input.type = "text";
  input.placeholder = "Player";
  input.value = playerAssignments[teamCode] || "";
  input.dataset.teamInput = teamCode;
  input.setAttribute("aria-label", `${teamCode} ${team.name} player name`);
  input.title = `${teamCode} ${team.name}`;
  input.readOnly = !isControllerView;

  logoWrap.appendChild(logo);
  item.append(logoWrap, input);
  return item;
}

function updatePlayerAssignment(teamCode, value) {
  if (!LEAGUES[activeLeague]?.teams[teamCode]) {
    return;
  }

  if (value) {
    playerAssignments[teamCode] = value;
  } else {
    delete playerAssignments[teamCode];
  }

  persistPlayerAssignments();
  queueSaveStateToServer();
}

function toggleSpotListVisibility() {
  spotListHidden = !spotListHidden;
  persistSpotListHidden();
  syncSpotListUi();
  queueSaveStateToServer();
}

function syncSpotListUi() {
  const hasSelections = selectedTeams.size > 0;
  const allowLocalHide = Boolean(toggleSpotListButton);
  const hideSpotList = allowLocalHide && spotListHidden;

  if (toggleSpotListButton) {
    toggleSpotListButton.textContent = spotListHidden ? "Show Spot List" : "Hide Spot List";
    toggleSpotListButton.setAttribute("aria-expanded", spotListHidden ? "false" : "true");
  }

  if (spotListEl) {
    spotListEl.hidden = hideSpotList || !hasSelections;
  }

  if (spotListEmptyEl) {
    spotListEmptyEl.hidden = hideSpotList || hasSelections;
  }

  scheduleSpotListLayout();
}

function scheduleSpotListLayout() {
  if (!isSpotListView || !spotListEl) {
    return;
  }

  cancelAnimationFrame(spotListLayoutFrame);
  spotListLayoutFrame = requestAnimationFrame(applySpotListLayout);
}

function applySpotListLayout() {
  if (!isSpotListView || !spotListEl || spotListEl.hidden) {
    return;
  }

  const itemCount = spotListEl.children.length;
  if (itemCount === 0) {
    resetSpotListLayoutVars();
    return;
  }

  const listRect = spotListEl.getBoundingClientRect();
  const availableWidth = Math.max(220, listRect.width);
  const preferredColumns = Math.min(3, itemCount);
  const maxColumns = preferredColumns;
  let bestLayout = null;

  for (let columns = preferredColumns; columns <= maxColumns; columns += 1) {
    const rows = Math.ceil(itemCount / columns);
    const columnGap = 4;
    const rowGap = rows >= 10 ? 2 : 4;
    const columnWidth = (availableWidth - columnGap * (columns - 1)) / columns;

    if (columnWidth <= 0) {
      continue;
    }

    const logoSize = clamp(columnWidth * 0.31, 30, 72);
    const itemGap = clamp(columnWidth * 0.03, 4, 10);
    const inputWidth = columnWidth - logoSize - itemGap;
    const fontSize = clamp(Math.min(logoSize * 0.34, inputWidth * 0.115), 12, 20);
    const inputPadY = clamp(fontSize * 0.34, 4, 7);
    const inputPadX = clamp(fontSize * 0.52, 6, 12);

    if (inputWidth < 110) {
      continue;
    }

    const tooWidePenalty = Math.max(0, inputWidth - 190) * 1.2;
    const tooNarrowPenalty = Math.max(0, 125 - inputWidth) * 2.5;
    const score = logoSize * 1.8 + fontSize * 2.4 - tooWidePenalty - tooNarrowPenalty - rows * 0.2;

    if (!bestLayout || score > bestLayout.score) {
      bestLayout = {
        columns,
        columnGap,
        rowGap,
        logoSize,
        itemGap,
        fontSize,
        inputPadY,
        inputPadX,
        score,
      };
    }
  }

  const layout = bestLayout || {
    columns: preferredColumns,
    columnGap: 4,
    rowGap: 3,
    logoSize: 36,
    itemGap: 4,
    fontSize: 13,
    inputPadY: 4,
    inputPadX: 6,
  };

  spotListEl.style.setProperty("--spot-columns", String(layout.columns));
  spotListEl.style.setProperty("--spot-column-gap", `${layout.columnGap}px`);
  spotListEl.style.setProperty("--spot-row-gap", `${layout.rowGap}px`);
  spotListEl.style.setProperty("--spot-logo-size", `${Math.round(layout.logoSize * 100) / 100}px`);
  spotListEl.style.setProperty("--spot-item-gap", `${Math.round(layout.itemGap * 100) / 100}px`);
  spotListEl.style.setProperty("--spot-font-size", `${Math.round(layout.fontSize * 100) / 100}px`);
  spotListEl.style.setProperty("--spot-pad-y", `${Math.round(layout.inputPadY * 100) / 100}px`);
  spotListEl.style.setProperty("--spot-pad-x", `${Math.round(layout.inputPadX * 100) / 100}px`);
}

function resetSpotListLayoutVars() {
  if (!spotListEl) {
    return;
  }

  [
    "--spot-columns",
    "--spot-column-gap",
    "--spot-row-gap",
    "--spot-logo-size",
    "--spot-item-gap",
    "--spot-font-size",
    "--spot-pad-y",
    "--spot-pad-x",
  ].forEach((property) => {
    spotListEl.style.removeProperty(property);
  });
}

function captureFocusedSpotListInput() {
  if (!isControllerView) {
    return null;
  }

  const activeInput = document.activeElement;
  if (!(activeInput instanceof HTMLInputElement) || !activeInput.matches("[data-team-input]")) {
    return null;
  }

  return {
    teamCode: activeInput.dataset.teamInput,
    selectionStart: activeInput.selectionStart,
    selectionEnd: activeInput.selectionEnd,
  };
}

function restoreFocusedSpotListInput(focusedInputState) {
  if (!focusedInputState?.teamCode || !spotListEl) {
    return;
  }

  const replacementInput = spotListEl.querySelector(`[data-team-input="${focusedInputState.teamCode}"]`);
  if (!(replacementInput instanceof HTMLInputElement)) {
    return;
  }

  replacementInput.focus();

  if (
    typeof focusedInputState.selectionStart === "number" &&
    typeof focusedInputState.selectionEnd === "number"
  ) {
    replacementInput.setSelectionRange(focusedInputState.selectionStart, focusedInputState.selectionEnd);
  }
}

async function loadObsConfig() {
  if (!isControllerView) {
    return;
  }

  try {
    const response = await fetch(API_OBS_CONFIG_ENDPOINT, { cache: "no-store" });
    if (!response.ok) {
      updateObsStatus("OBS settings could not be loaded.", true);
      return;
    }

    const config = await response.json();
    applyObsConfigToForm(config);
    updateObsStatus("OBS settings loaded.");
  } catch {
    updateObsStatus("OBS settings could not be loaded.", true);
  }
}

function applyObsConfigToForm(config) {
  if (obsHostInput) {
    obsHostInput.value = typeof config?.host === "string" ? config.host : "";
  }

  if (obsPortInput) {
    obsPortInput.value = Number.isFinite(Number(config?.port)) ? String(config.port) : "";
  }

  if (obsPasswordInput) {
    obsPasswordInput.value = typeof config?.password === "string" ? config.password : "";
  }

  if (obsOverlaySceneInput) {
    obsOverlaySceneInput.value = typeof config?.sources?.overlay?.sceneName === "string" ? config.sources.overlay.sceneName : "";
  }

  if (obsOverlaySourceInput) {
    obsOverlaySourceInput.value = typeof config?.sources?.overlay?.sourceName === "string" ? config.sources.overlay.sourceName : "";
  }

  if (obsSpotListSceneInput) {
    obsSpotListSceneInput.value =
      typeof config?.sources?.spotList?.sceneName === "string" ? config.sources.spotList.sceneName : "";
  }

  if (obsSpotListSourceInput) {
    obsSpotListSourceInput.value =
      typeof config?.sources?.spotList?.sourceName === "string" ? config.sources.spotList.sourceName : "";
  }
}

function readObsConfigFromForm() {
  return {
    host: obsHostInput?.value.trim() || "127.0.0.1",
    port: obsPortInput?.value.trim() ? Number(obsPortInput.value) : 4455,
    password: obsPasswordInput?.value || "",
    sources: {
      overlay: {
        sceneName: obsOverlaySceneInput?.value.trim() || "",
        sourceName: obsOverlaySourceInput?.value.trim() || "",
      },
      spotList: {
        sceneName: obsSpotListSceneInput?.value.trim() || "",
        sourceName: obsSpotListSourceInput?.value.trim() || "",
      },
    },
  };
}

async function saveObsConfig({ announce } = {}) {
  if (!isControllerView) {
    return null;
  }

  try {
    const response = await fetch(API_OBS_CONFIG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readObsConfigFromForm()),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      updateObsStatus(payload?.error || "OBS settings could not be saved.", true);
      return null;
    }

    applyObsConfigToForm(payload);
    if (announce) {
      updateObsStatus(announce);
    }

    return payload;
  } catch {
    updateObsStatus("OBS settings could not be saved.", true);
    return null;
  }
}

async function testObsConnectionFromController() {
  const savedConfig = await saveObsConfig();
  if (!savedConfig) {
    return;
  }

  setObsControlsBusy(true, "Testing OBS connection...");

  try {
    const response = await fetch(API_OBS_TEST_ENDPOINT, { method: "POST" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      updateObsStatus(payload?.error || "OBS connection failed.", true);
      return;
    }

    updateObsStatus(payload?.message || "OBS connection is working.");
  } catch {
    updateObsStatus("OBS connection failed.", true);
  } finally {
    setObsControlsBusy(false);
  }
}

async function setObsVisibilityFromController(target, visible) {
  if (!OBS_TARGET_LABELS[target]) {
    return;
  }

  const savedConfig = await saveObsConfig();
  if (!savedConfig) {
    return;
  }

  setObsControlsBusy(true, `${visible ? "Showing" : "Hiding"} ${OBS_TARGET_LABELS[target]} in OBS...`);

  try {
    const response = await fetch(API_OBS_SOURCE_VISIBILITY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, visible }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      updateObsStatus(payload?.error || `Could not ${visible ? "show" : "hide"} the ${OBS_TARGET_LABELS[target]}.`, true);
      return;
    }

    updateObsStatus(payload?.message || `${OBS_TARGET_LABELS[target]} updated in OBS.`);
  } catch {
    updateObsStatus(`Could not ${visible ? "show" : "hide"} the ${OBS_TARGET_LABELS[target]}.`, true);
  } finally {
    setObsControlsBusy(false);
  }
}

function setObsControlsBusy(isBusy, statusMessage) {
  if (obsSaveButton) {
    obsSaveButton.disabled = isBusy;
  }

  if (obsTestButton) {
    obsTestButton.disabled = isBusy;
  }

  obsVisibilityButtons.forEach((button) => {
    button.disabled = isBusy;
  });

  if (statusMessage) {
    updateObsStatus(statusMessage);
  }
}

function updateObsStatus(message, isError = false) {
  if (!obsStatusEl || typeof message !== "string") {
    return;
  }

  obsStatusEl.textContent = message;
  obsStatusEl.classList.toggle("is-error", isError);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function syncDerivedLeagueState() {
  selectedTeams = new Set(selectionsByLeague[activeLeague] || []);
  playerAssignments = { ...(assignmentsByLeague[activeLeague] || {}) };
}

function queueSaveStateToServer() {
  clearTimeout(saveStateTimer);
  saveStateTimer = setTimeout(() => {
    void saveStateToServer();
  }, 150);
}

function startServerPolling() {
  clearInterval(serverPollTimer);
  serverPollTimer = setInterval(() => {
    void pollServerState();
  }, SERVER_POLL_MS);
}

async function pollServerState() {
  const remoteState = await fetchServerState();
  if (!remoteState) {
    return;
  }

  if (typeof remoteState.version === "number" && remoteState.version === serverVersion) {
    return;
  }

  applySharedState(remoteState, { persistLocalCache: true });
}

async function fetchServerState() {
  try {
    const response = await fetch(API_STATE_ENDPOINT, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

async function saveStateToServer() {
  try {
    const response = await fetch(API_STATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshotSharedState()),
    });

    if (!response.ok) {
      return;
    }

    const remoteState = await response.json();
    applySharedState(remoteState, { persistLocalCache: true });
  } catch {
    // Fallback to local cache only when the server is unavailable.
  }
}

function snapshotSharedState() {
  return {
    activeLeague,
    activeSize,
    spotListHidden,
    selectedTeamsByLeague: serializeSelectedTeamsMap(),
    playerAssignmentsByLeague: serializeAssignmentsMap(),
  };
}

function applySharedState(sharedState, { persistLocalCache } = { persistLocalCache: false }) {
  activeLeague = getValidLeague(sharedState.activeLeague, activeLeague);
  activeSize = getValidSize(sharedState.activeSize, activeSize);
  spotListHidden = typeof sharedState.spotListHidden === "boolean" ? sharedState.spotListHidden : spotListHidden;
  selectionsByLeague = normalizeSelectedTeamsMap(sharedState.selectedTeamsByLeague);
  assignmentsByLeague = normalizeAssignmentsMap(sharedState.playerAssignmentsByLeague);
  serverVersion = Number.isFinite(sharedState.version) ? sharedState.version : serverVersion;

  syncDerivedLeagueState();

  if (persistLocalCache) {
    persistAllLocalState();
  }

  render();
  updateCounter();
  syncLeagueUi();
  syncSizeUi();
  syncSpotListUi();
}

function hasMeaningfulLocalState() {
  return (
    activeLeague !== "NFL" ||
    activeSize !== "medium" ||
    spotListHidden ||
    Object.values(selectionsByLeague).some((teams) => teams.length > 0) ||
    Object.values(assignmentsByLeague).some((assignments) => Object.keys(assignments).length > 0)
  );
}

function isServerStateEmpty(sharedState) {
  const selectedTeamsMap = normalizeSelectedTeamsMap(sharedState.selectedTeamsByLeague);
  const assignmentsMap = normalizeAssignmentsMap(sharedState.playerAssignmentsByLeague);

  return (
    getValidLeague(sharedState.activeLeague, "NFL") === "NFL" &&
    getValidSize(sharedState.activeSize, "medium") === "medium" &&
    !sharedState.spotListHidden &&
    Object.values(selectedTeamsMap).every((teams) => teams.length === 0) &&
    Object.values(assignmentsMap).every((assignments) => Object.keys(assignments).length === 0)
  );
}

function serializeSelectedTeamsMap() {
  const result = {};

  for (const leagueCode of Object.keys(LEAGUES)) {
    result[leagueCode] = [...(selectionsByLeague[leagueCode] || [])];
  }

  return result;
}

function serializeAssignmentsMap() {
  const result = {};

  for (const leagueCode of Object.keys(LEAGUES)) {
    result[leagueCode] = { ...(assignmentsByLeague[leagueCode] || {}) };
  }

  return result;
}

function normalizeSelectedTeamsMap(source) {
  const result = {};

  for (const leagueCode of Object.keys(LEAGUES)) {
    const teams = Array.isArray(source?.[leagueCode]) ? source[leagueCode] : [];
    result[leagueCode] = teams.filter((teamCode) => LEAGUES[leagueCode].teams[teamCode]);
  }

  return result;
}

function normalizeAssignmentsMap(source) {
  const result = {};

  for (const leagueCode of Object.keys(LEAGUES)) {
    const assignments = source?.[leagueCode];
    result[leagueCode] = {};

    if (!assignments || typeof assignments !== "object" || Array.isArray(assignments)) {
      continue;
    }

    for (const [teamCode, playerName] of Object.entries(assignments)) {
      if (LEAGUES[leagueCode].teams[teamCode] && typeof playerName === "string") {
        result[leagueCode][teamCode] = playerName;
      }
    }
  }

  return result;
}

function persistAllLocalState() {
  persistActiveLeague();
  persistActiveSize();
  persistSpotListHidden();

  for (const leagueCode of Object.keys(LEAGUES)) {
    localStorage.setItem(storageKeyForLeague(leagueCode), JSON.stringify(selectionsByLeague[leagueCode] || []));
    localStorage.setItem(
      assignmentStorageKeyForLeague(leagueCode),
      JSON.stringify(assignmentsByLeague[leagueCode] || {})
    );
  }
}

function getValidLeague(candidate, fallback) {
  return LEAGUES[candidate] ? candidate : fallback;
}

function getValidSize(candidate, fallback) {
  return SIZE_OPTIONS.includes(candidate) ? candidate : fallback;
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

function assignmentStorageKeyForLeague(leagueCode) {
  return `${STORAGE_ASSIGNMENTS_KEY_PREFIX}:${leagueCode}`;
}

function loadAllSelectedTeams() {
  const result = {};

  for (const leagueCode of Object.keys(LEAGUES)) {
    result[leagueCode] = loadSelectedTeams(leagueCode);
  }

  return result;
}

function loadAllPlayerAssignments() {
  const result = {};

  for (const leagueCode of Object.keys(LEAGUES)) {
    result[leagueCode] = loadPlayerAssignments(leagueCode);
  }

  return result;
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
  selectionsByLeague[activeLeague] = [...selectedTeams];
  localStorage.setItem(storageKeyForLeague(activeLeague), JSON.stringify([...selectedTeams]));
}

function loadPlayerAssignments(leagueCode) {
  const league = LEAGUES[leagueCode];
  if (!league) {
    return {};
  }

  try {
    const raw = localStorage.getItem(assignmentStorageKeyForLeague(leagueCode));
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([teamCode, value]) => league.teams[teamCode] && typeof value === "string")
    );
  } catch {
    return {};
  }
}

function persistPlayerAssignments() {
  assignmentsByLeague[activeLeague] = { ...playerAssignments };
  localStorage.setItem(assignmentStorageKeyForLeague(activeLeague), JSON.stringify(playerAssignments));
}

function loadSpotListHidden() {
  try {
    return localStorage.getItem(STORAGE_SPOT_LIST_HIDDEN_KEY) === "true";
  } catch {
    return false;
  }
}

function persistSpotListHidden() {
  localStorage.setItem(STORAGE_SPOT_LIST_HIDDEN_KEY, String(spotListHidden));
}
