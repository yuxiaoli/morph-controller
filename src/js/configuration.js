export const BASE_URL = "https://morph.vectorindex.cloud/";
export const AUTO_APPLY_DELAY = 800;
export const LIMITS = Object.freeze({ particles: 10000, delay: 120000 });
export const DEFAULTS = Object.freeze({
  n: 2000,
  current: 1,
  delay: 8000,
  loop: true,
  bg: "000000",
  pixel: "",
});

// Array positions are the IDs accepted by the remote server. Keep their order.
export const SHAPES = Object.freeze([
  "Line",
  "Ring",
  "Plane",
  "Twisted Ring",
  "Cylinder",
  "Curved Canopy",
  "Parabolic Curtain",
  "Twisted Ring (Continuous)",
  "Folded Sphere",
  "Pinched Shell",
  "Parabolic Band",
  "Butterfly Shell",
  "Diagonal Plane",
  "Crossed Shell",
  "Bow Tie",
  "Twin Wings",
  "Butterfly Shell (Alternate)",
  "Wave Curtain",
]);

export function normalizeColor(value) {
  return String(value).trim().replace(/^#/, "").toLowerCase();
}

function isIntegerInRange(value, min, max) {
  const text = String(value).trim();
  return /^\d+$/.test(text) && Number(text) >= min && Number(text) <= max;
}

// Pure validation: invalid drafts never produce a navigable or copyable URL.
export function createDraft(raw) {
  const values = {
    n: Number(raw.n),
    current: Number(raw.current),
    delay: Number(raw.delay),
    loop: raw.loop,
    bg: normalizeColor(raw.bg),
    pixel: raw.pixel,
  };
  const errors = {};

  if (!isIntegerInRange(raw.n, 1, LIMITS.particles)) {
    errors.n = `Enter a whole number from 1 to ${LIMITS.particles}.`;
  }
  if (!isIntegerInRange(raw.current, 0, SHAPES.length - 1)) {
    errors.current = "Choose an available shape.";
  }
  if (!isIntegerInRange(raw.delay, 1, LIMITS.delay)) {
    errors.delay = `Enter milliseconds from 1 to ${LIMITS.delay}.`;
  }
  if (typeof raw.loop !== "boolean") errors.loop = "Choose whether to cycle shapes.";
  if (!/^[0-9a-f]{6}$/.test(values.bg)) {
    errors.bg = "Use exactly 6 hexadecimal characters.";
  }
  if (!["", "ff2b2b"].includes(values.pixel)) {
    errors.pixel = "Choose an available texture.";
  }

  const valid = Object.keys(errors).length === 0;
  let url = "";
  if (valid) {
    const target = new URL(BASE_URL);
    for (const [key, value] of Object.entries(values)) {
      if (key === "pixel" && value === "") continue;
      target.searchParams.set(key, String(value));
    }
    url = target.href;
  }
  return { values, errors, valid, url };
}
