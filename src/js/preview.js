import { SHAPES } from "./configuration.js";

export function createPreview(root, showToast) {
  const shell = root.querySelector("#preview-shell");
  const iframe = root.querySelector("#morph-frame");
  const loading = root.querySelector("#preview-loading");
  const status = root.querySelector("#preview-status");
  const label = root.querySelector("#applied-label");
  const fullscreen = root.querySelector("#fullscreen");
  let appliedUrl;

  function navigate(url, message) {
    loading.classList.remove("is-hidden");
    status.textContent = message;
    iframe.src = url;
  }

  function apply({ url, values }) {
    appliedUrl = url;
    label.textContent = `Applied · ${SHAPES[values.current]} · ${values.n.toLocaleString()} particles`;
    navigate(url, "Loading Morph preview…");
  }

  root.querySelector("#reload").addEventListener("click", () => {
    if (appliedUrl) navigate(appliedUrl, "Reloading Morph preview…");
  });
  iframe.addEventListener("load", () => {
    loading.classList.add("is-hidden");
    status.textContent = "Preview document loaded";
  });
  fullscreen.addEventListener("click", async () => {
    try {
      if (root.fullscreenElement) await root.exitFullscreen();
      else await shell.requestFullscreen();
    } catch {
      showToast("Fullscreen is unavailable in this browser");
    }
  });
  root.addEventListener("fullscreenchange", () => {
    const text = root.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen";
    fullscreen.title = text;
    fullscreen.querySelector(".sr-only").textContent = text;
  });

  return { apply };
}
