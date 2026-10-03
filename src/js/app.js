import { createBuilder } from "./builder.js";
import { createController } from "./controller.js";
import { createPanel } from "./panel.js";
import { createPreview } from "./preview.js";

const builder = createBuilder(document);
const panel = createPanel(document);
const preview = createPreview(document, showToast);
const copy = document.querySelector("#copy-url");
const open = document.querySelector("#open-url");
const toast = document.querySelector("#toast");
let toastTimer;

const controller = createController({
  onChange(state) {
    builder.render(state);
    copy.disabled = !state.draft.valid;
    open.disabled = !state.draft.valid;
  },
  onApply(draft, closePanel) {
    preview.apply(draft);
    if (closePanel) panel.closeOnMobile();
  },
});

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

copy.addEventListener("click", async () => {
  const { draft } = controller.getState();
  if (!draft.valid) return;
  try {
    await navigator.clipboard.writeText(draft.url);
    showToast("URL copied to clipboard");
  } catch {
    builder.focusUrl();
    showToast("Select the URL and copy it manually");
  }
});

open.addEventListener("click", () => {
  const { draft } = controller.getState();
  if (draft.valid) window.open(draft.url, "_blank", "noopener,noreferrer");
});

builder.bind(controller);
builder.write(controller.getState().draft.values);
controller.apply(false);
