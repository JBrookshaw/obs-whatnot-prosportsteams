const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const host = "127.0.0.1";
const port = 8080;
const root = __dirname;
const stateFile = path.join(root, "overlay-state.json");
const obsConfigFile = path.join(root, "obs-config.json");
const leagueKeys = ["NFL", "NBA", "MLB", "MLS", "NHL", "WNBA"];
const sizeOptions = ["small", "medium", "large"];
const supportedRpcVersion = 1;
const obsSourceKeys = ["overlay", "spotList"];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let sharedState = loadStateFromDisk();
let obsConfig = loadObsConfigFromDisk();

http
  .createServer(async (req, res) => {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
    const requestPath = decodeURIComponent(requestUrl.pathname);

    if (requestPath === "/api/state") {
      await handleStateRequest(req, res);
      return;
    }

    if (requestPath === "/api/obs/config") {
      await handleObsConfigRequest(req, res);
      return;
    }

    if (requestPath === "/api/obs/test") {
      await handleObsTestRequest(req, res);
      return;
    }

    if (requestPath === "/api/obs/source-visibility") {
      await handleObsSourceVisibilityRequest(req, res);
      return;
    }

    serveStaticFile(requestPath, res);
  })
  .listen(port, host, () => {
    console.log(`Serving ${root} at http://${host}:${port}/controller.html`);
  });

async function handleStateRequest(req, res) {
  if (req.method === "GET") {
    sendJson(res, 200, sharedState);
    return;
  }

  if (req.method === "POST") {
    try {
      const rawBody = await readRequestBody(req);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      sharedState = mergeState(sharedState, payload);
      persistState(sharedState);
      sendJson(res, 200, sharedState);
    } catch {
      sendJson(res, 400, { error: "Invalid state payload" });
    }

    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handleObsConfigRequest(req, res) {
  if (req.method === "GET") {
    sendJson(res, 200, obsConfig);
    return;
  }

  if (req.method === "POST") {
    try {
      const rawBody = await readRequestBody(req);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      obsConfig = mergeObsConfig(obsConfig, payload);
      persistObsConfig(obsConfig);
      sendJson(res, 200, obsConfig);
    } catch {
      sendJson(res, 400, { error: "Invalid OBS config payload" });
    }

    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handleObsTestRequest(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const versionInfo = await testObsConnection(obsConfig);
    sendJson(res, 200, {
      ok: true,
      message: `Connected to OBS ${versionInfo.obsStudioVersion} / obs-websocket ${versionInfo.obsWebSocketVersion}`,
      versionInfo,
    });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message });
  }
}

async function handleObsSourceVisibilityRequest(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const target = typeof payload.target === "string" ? payload.target : "";
    const visible = typeof payload.visible === "boolean" ? payload.visible : null;

    if (!obsSourceKeys.includes(target)) {
      throw new Error("Invalid OBS source target.");
    }

    if (visible === null) {
      throw new Error("Missing desired visibility state.");
    }

    const result = await setObsSourceVisibility(obsConfig, target, visible);
    sendJson(res, 200, {
      ok: true,
      message: `${result.sourceName} in ${result.sceneName} is now ${result.visible ? "shown" : "hidden"}.`,
      result,
    });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message });
  }
}

function serveStaticFile(requestPath, res) {
  const relativePath = requestPath === "/" ? "controller.html" : requestPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function createDefaultState() {
  return {
    version: 0,
    activeLeague: "NFL",
    activeSize: "medium",
    spotListHidden: false,
    selectedTeamsByLeague: {},
    playerAssignmentsByLeague: {},
  };
}

function createDefaultObsConfig() {
  return {
    host: "127.0.0.1",
    port: 4455,
    password: "",
    sources: {
      overlay: {
        sceneName: "",
        sourceName: "",
      },
      spotList: {
        sceneName: "",
        sourceName: "",
      },
    },
  };
}

function loadStateFromDisk() {
  try {
    const raw = fs.readFileSync(stateFile, "utf8");
    const parsed = JSON.parse(raw);
    return sanitizeState(parsed, createDefaultState());
  } catch {
    return createDefaultState();
  }
}

function loadObsConfigFromDisk() {
  try {
    const raw = fs.readFileSync(obsConfigFile, "utf8");
    const parsed = JSON.parse(raw);
    return sanitizeObsConfig(parsed, createDefaultObsConfig());
  } catch {
    return createDefaultObsConfig();
  }
}

function persistState(state) {
  fs.writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`, () => {});
}

function persistObsConfig(config) {
  fs.writeFile(obsConfigFile, `${JSON.stringify(config, null, 2)}\n`, () => {});
}

function mergeState(currentState, payload) {
  const nextState = sanitizeState(payload, currentState);
  return {
    ...nextState,
    version: currentState.version + 1,
  };
}

function mergeObsConfig(currentConfig, payload) {
  return sanitizeObsConfig(payload, currentConfig);
}

function sanitizeState(input, fallbackState) {
  const nextState = createDefaultState();
  const source = input && typeof input === "object" ? input : {};

  nextState.version = Number.isFinite(fallbackState.version) ? fallbackState.version : 0;
  nextState.activeLeague = leagueKeys.includes(source.activeLeague) ? source.activeLeague : fallbackState.activeLeague;
  nextState.activeSize = sizeOptions.includes(source.activeSize) ? source.activeSize : fallbackState.activeSize;
  nextState.spotListHidden =
    typeof source.spotListHidden === "boolean" ? source.spotListHidden : Boolean(fallbackState.spotListHidden);
  nextState.selectedTeamsByLeague = sanitizeSelectedTeamsMap(
    source.selectedTeamsByLeague,
    fallbackState.selectedTeamsByLeague
  );
  nextState.playerAssignmentsByLeague = sanitizeAssignmentsMap(
    source.playerAssignmentsByLeague,
    fallbackState.playerAssignmentsByLeague
  );

  return nextState;
}

function sanitizeObsConfig(input, fallbackConfig) {
  const source = input && typeof input === "object" ? input : {};
  const fallback = fallbackConfig && typeof fallbackConfig === "object" ? fallbackConfig : createDefaultObsConfig();
  const nextConfig = createDefaultObsConfig();

  nextConfig.host = sanitizeText(source.host, fallback.host, 255);
  nextConfig.port = sanitizePort(source.port, fallback.port);
  nextConfig.password = typeof source.password === "string" ? source.password : fallback.password;

  for (const sourceKey of obsSourceKeys) {
    const sourceConfig = source.sources?.[sourceKey];
    const fallbackSourceConfig = fallback.sources?.[sourceKey] || createDefaultObsConfig().sources[sourceKey];
    nextConfig.sources[sourceKey] = {
      sceneName: sanitizeText(sourceConfig?.sceneName, fallbackSourceConfig.sceneName, 255),
      sourceName: sanitizeText(sourceConfig?.sourceName, fallbackSourceConfig.sourceName, 255),
    };
  }

  return nextConfig;
}

function sanitizeSelectedTeamsMap(input, fallback) {
  const result = {};
  const base = input && typeof input === "object" ? input : fallback;

  for (const leagueKey of leagueKeys) {
    const teams = Array.isArray(base?.[leagueKey]) ? base[leagueKey] : [];
    result[leagueKey] = teams.filter((teamCode) => typeof teamCode === "string");
  }

  return result;
}

function sanitizeAssignmentsMap(input, fallback) {
  const result = {};
  const base = input && typeof input === "object" ? input : fallback;

  for (const leagueKey of leagueKeys) {
    const assignments = base?.[leagueKey];
    const safeAssignments = {};

    if (assignments && typeof assignments === "object" && !Array.isArray(assignments)) {
      for (const [teamCode, playerName] of Object.entries(assignments)) {
        if (typeof teamCode === "string" && typeof playerName === "string") {
          safeAssignments[teamCode] = playerName;
        }
      }
    }

    result[leagueKey] = safeAssignments;
  }

  return result;
}

function sanitizeText(value, fallback, maxLength) {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().slice(0, maxLength);
}

function sanitizePort(value, fallback) {
  const numericPort = Number(value);
  if (Number.isInteger(numericPort) && numericPort >= 1 && numericPort <= 65535) {
    return numericPort;
  }

  return fallback;
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function testObsConnection(config) {
  const session = await connectToObs(config);

  try {
    return await session.sendRequest("GetVersion");
  } finally {
    session.close();
  }
}

async function setObsSourceVisibility(config, target, visible) {
  const targetConfig = config.sources?.[target];
  if (!targetConfig?.sceneName || !targetConfig?.sourceName) {
    throw new Error(`Set the OBS scene and source name for ${target === "overlay" ? "the team grid" : "the spot list"} first.`);
  }

  const session = await connectToObs(config);

  try {
    const itemInfo = await session.sendRequest("GetSceneItemId", {
      sceneName: targetConfig.sceneName,
      sourceName: targetConfig.sourceName,
    });

    await session.sendRequest("SetSceneItemEnabled", {
      sceneName: targetConfig.sceneName,
      sceneItemId: itemInfo.sceneItemId,
      sceneItemEnabled: visible,
    });

    return {
      target,
      sceneName: targetConfig.sceneName,
      sourceName: targetConfig.sourceName,
      visible,
    };
  } finally {
    session.close();
  }
}

async function connectToObs(config) {
  const safeConfig = sanitizeObsConfig(config, createDefaultObsConfig());

  if (!safeConfig.host) {
    throw new Error("Set an OBS WebSocket host first.");
  }

  if (!Number.isInteger(safeConfig.port)) {
    throw new Error("Set a valid OBS WebSocket port first.");
  }

  const endpoint = `ws://${safeConfig.host}:${safeConfig.port}`;
  const ws = new WebSocket(endpoint, "obswebsocket.json");
  const pendingRequests = new Map();
  let connected = false;
  let settled = false;

  return await new Promise((resolve, reject) => {
    const fail = (message) => {
      if (settled) {
        return;
      }

      settled = true;
      reject(new Error(message));
      try {
        ws.close();
      } catch {
        // Ignore close failures during setup.
      }
    };

    const handleMessage = async (event) => {
      let payload;

      try {
        payload = JSON.parse(String(event.data));
      } catch {
        fail("OBS sent an unreadable response.");
        return;
      }

      if (payload.op === 0) {
        try {
          const identifyData = {
            rpcVersion: Math.min(supportedRpcVersion, Number(payload.d?.rpcVersion) || supportedRpcVersion),
          };

          if (payload.d?.authentication) {
            identifyData.authentication = createObsAuthentication(
              safeConfig.password,
              payload.d.authentication.salt,
              payload.d.authentication.challenge
            );
          }

          ws.send(JSON.stringify({ op: 1, d: identifyData }));
        } catch (error) {
          fail(error.message);
        }

        return;
      }

      if (payload.op === 2) {
        if (settled) {
          return;
        }

        settled = true;
        connected = true;
        resolve({
          async sendRequest(requestType, requestData = {}) {
            const requestId = crypto.randomUUID();

            return await new Promise((requestResolve, requestReject) => {
              pendingRequests.set(requestId, { requestResolve, requestReject, requestType });
              ws.send(
                JSON.stringify({
                  op: 6,
                  d: {
                    requestType,
                    requestId,
                    requestData,
                  },
                })
              );
            });
          },
          close() {
            for (const pending of pendingRequests.values()) {
              pending.requestReject(new Error("OBS connection closed before the request finished."));
            }

            pendingRequests.clear();
            try {
              ws.close();
            } catch {
              // Ignore close failures.
            }
          },
        });
        return;
      }

      if (payload.op === 7) {
        const requestId = payload.d?.requestId;
        const pending = pendingRequests.get(requestId);
        if (!pending) {
          return;
        }

        pendingRequests.delete(requestId);

        if (payload.d?.requestStatus?.result) {
          pending.requestResolve(payload.d.responseData || {});
        } else {
          const statusComment = payload.d?.requestStatus?.comment;
          const statusCode = payload.d?.requestStatus?.code;
          pending.requestReject(
            new Error(statusComment || `OBS rejected ${pending.requestType} (status ${statusCode ?? "unknown"}).`)
          );
        }
      }
    };

    ws.addEventListener("message", (event) => {
      void handleMessage(event);
    });

    ws.addEventListener("error", () => {
      if (!connected) {
        fail(`Unable to connect to OBS at ${endpoint}.`);
      }
    });

    ws.addEventListener("close", (event) => {
      const closeMessage = event.reason || `OBS closed the connection (code ${event.code}).`;

      if (!connected) {
        fail(closeMessage);
        return;
      }

      for (const pending of pendingRequests.values()) {
        pending.requestReject(new Error(closeMessage));
      }

      pendingRequests.clear();
    });
  });
}

function createObsAuthentication(password, salt, challenge) {
  if (typeof password !== "string") {
    throw new Error("OBS requires a password, but none is configured here.");
  }

  if (!salt || !challenge) {
    throw new Error("OBS authentication data was incomplete.");
  }

  const base64Secret = crypto.createHash("sha256").update(`${password}${salt}`).digest("base64");
  return crypto.createHash("sha256").update(`${base64Secret}${challenge}`).digest("base64");
}
