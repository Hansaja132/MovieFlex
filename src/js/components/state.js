const STATE_CLASSES = ["state--loading", "state--error", "state--empty"];

export function setLoadingState(mount, message = "Loading...") {
  setState(mount, "state--loading", message);
}

export function setErrorState(mount, message = "Something went wrong.") {
  setState(mount, "state--error", message);
}

export function setEmptyState(mount, message = "No items found.") {
  setState(mount, "state--empty", message);
}

export function clearState(mount) {
  if (!mount) return;
  mount.classList.add("state");
  mount.classList.remove(...STATE_CLASSES);
  mount.textContent = "";
}

function setState(mount, stateClass, message) {
  if (!mount) return;
  mount.classList.add("state", stateClass);
  mount.classList.remove(...STATE_CLASSES.filter((value) => value !== stateClass));
  mount.textContent = message;
}
