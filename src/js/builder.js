import { LIMITS, normalizeColor, SHAPES } from "./configuration.js";

export function createBuilder(root) {
  const form = root.querySelector("#builder-form");
  const fields = Object.fromEntries(
    ["n", "current", "delay", "loop", "bg", "pixel"].map((name) => [name, form.elements.namedItem(name)]),
  );
  const colorPicker = root.querySelector("#background");
  const autoApply = root.querySelector("#auto-apply");
  const actions = root.querySelector(".panel-actions");
  const apply = root.querySelector("#apply");
  const reset = root.querySelector("#reset");
  const generatedUrl = root.querySelector("#generated-url");
  const status = root.querySelector("#draft-status");
  const errors = Object.fromEntries(
    Object.entries(fields).map(([name, field]) => [
      name,
      root.querySelector(`#${field.getAttribute("aria-describedby")}`),
    ]),
  );

  fields.n.max = LIMITS.particles;
  fields.delay.max = LIMITS.delay;
  fields.current.replaceChildren(...SHAPES.map((name, id) => new Option(name, String(id))));

  function syncColor(value) {
    const color = normalizeColor(value);
    fields.bg.value = color;
    if (/^[0-9a-f]{6}$/.test(color)) colorPicker.value = `#${color}`;
  }

  function read() {
    return Object.fromEntries(
      Object.entries(fields).map(([name, field]) => [name, name === "loop" ? field.checked : field.value]),
    );
  }

  function write(values) {
    for (const [name, field] of Object.entries(fields)) {
      if (name === "loop") field.checked = values.loop;
      else field.value = values[name];
    }
    syncColor(values.bg);
  }

  function render({ draft, pending, autoApply: automatic }) {
    for (const [name, field] of Object.entries(fields)) {
      const error = draft.errors[name] || "";
      field.classList.toggle("is-invalid", Boolean(error));
      field.setAttribute("aria-invalid", String(Boolean(error)));
      if (errors[name]) errors[name].textContent = error;
    }
    generatedUrl.textContent = draft.url || "Fix the highlighted fields to generate a URL.";
    status.textContent = pending ? "Draft" : draft.valid ? "Applied" : "Invalid";
    status.classList.toggle("is-pending", pending || !draft.valid);
    apply.disabled = !draft.valid;
    autoApply.checked = automatic;
    actions.hidden = automatic;
  }

  function bind(controller) {
    // One event path per edit; color inputs no longer dispatch synthetic input events.
    form.addEventListener("input", (event) => {
      if (event.target === autoApply) {
        controller.setAutoApply(autoApply.checked);
        return;
      }
      if (event.target === colorPicker || event.target === fields.bg) syncColor(event.target.value);
      controller.update(read());
    });
    form.addEventListener("submit", (event) => event.preventDefault());
    apply.addEventListener("click", () => controller.apply());
    reset.addEventListener("click", () => {
      controller.reset();
      write(controller.getState().draft.values);
    });
  }

  return { write, render, bind, focusUrl: () => generatedUrl.focus() };
}
