export function createPanel(root) {
  const panel = root.querySelector("#control-panel");
  const shell = root.querySelector(".app-shell");
  const preview = root.querySelector("#preview-shell");
  const toggle = root.querySelector("#controls");
  const close = root.querySelector("#panel-close");
  const backdrop = root.querySelector("#drawer-backdrop");
  const mobile = window.matchMedia("(max-width: 899px)");
  let open = !mobile.matches;
  let desktopOpen = true;

  // Only layout and accessibility state change here; the iframe stays untouched.
  function setOpen(nextOpen, focus = true) {
    open = nextOpen;
    const modal = mobile.matches && open;
    if (!mobile.matches) desktopOpen = open;
    shell.classList.toggle("panel-collapsed", !mobile.matches && !open);
    panel.classList.toggle("mobile-open", modal);
    root.body.classList.toggle("drawer-open", modal);
    preview.inert = modal;
    toggle.setAttribute("aria-expanded", String(open));
    backdrop.setAttribute("aria-hidden", String(!modal));
    if (modal) {
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
    } else {
      panel.removeAttribute("role");
      panel.removeAttribute("aria-modal");
    }
    // Restore focus before hiding the element that previously contained it.
    if (!open && (focus || panel.contains(root.activeElement))) toggle.focus();
    panel.inert = !open;
    panel.setAttribute("aria-hidden", String(!open));
    if (open && (focus || modal)) {
      requestAnimationFrame(() => { if (open) close.focus(); });
    }
  }

  function onKeydown(event) {
    if (!mobile.matches || !open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...panel.querySelectorAll("button, input, select, [tabindex]:not([tabindex='-1'])")]
      .filter((element) => !element.disabled && element.offsetParent !== null);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && root.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && root.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener("click", () => setOpen(!open));
  close.addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));
  root.addEventListener("keydown", onKeydown);
  mobile.addEventListener("change", () => setOpen(mobile.matches ? false : desktopOpen, false));
  setOpen(open, false);

  return { closeOnMobile: () => { if (mobile.matches) setOpen(false); } };
}
