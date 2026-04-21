export function setLoadingState(mount, message = "Loading...") {
  if (!mount) return;
  mount.className = "state state--loading";
  mount.textContent = message;
}

export function setErrorState(mount, message = "Something went wrong.") {
  if (!mount) return;
  mount.className = "state state--error";
  mount.textContent = message;
}

export function setEmptyState(mount, message = "No items found.") {
  if (!mount) return;
  mount.className = "state state--empty";
  mount.textContent = message;
}

export function clearState(mount) {
  if (!mount) return;
  mount.className = "state";
  mount.textContent = "";
}
