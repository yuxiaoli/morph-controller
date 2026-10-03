import { AUTO_APPLY_DELAY, createDraft, DEFAULTS } from "./configuration.js";

// Owns draft/applied state and the single pending auto-apply timer. No DOM access.
export function createController({ onChange, onApply }) {
  let draft = createDraft(DEFAULTS);
  let applied = draft;
  let autoApply = false;
  let timer;

  function cancelAutoApply() {
    clearTimeout(timer);
    timer = undefined;
  }

  function getState() {
    return {
      draft,
      applied,
      autoApply,
      pending: draft.valid && draft.url !== applied.url,
    };
  }

  function scheduleAutoApply() {
    cancelAutoApply();
    if (autoApply && getState().pending) {
      timer = setTimeout(() => apply(false), AUTO_APPLY_DELAY);
    }
  }

  function update(values) {
    draft = createDraft(values);
    scheduleAutoApply();
    onChange(getState());
  }

  function apply(closePanel = true) {
    cancelAutoApply();
    if (!draft.valid) return false;
    applied = draft;
    onChange(getState());
    onApply(applied, closePanel);
    return true;
  }

  function setAutoApply(enabled) {
    autoApply = enabled;
    scheduleAutoApply();
    onChange(getState());
  }

  return {
    getState,
    update,
    apply,
    setAutoApply,
    reset: () => update(DEFAULTS),
  };
}
