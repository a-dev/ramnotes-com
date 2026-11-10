interface RadioMenu {
  trigger: HTMLButtonElement;
  menu: HTMLElement;
  items: HTMLButtonElement[];

  place: () => { x: number; y: number };
  onSelect: (item: HTMLButtonElement) => void;
}

export const wireRadioMenu = ({ trigger, menu, items, place, onSelect }: RadioMenu) => {
  const focusItem = (item: HTMLButtonElement | undefined) => {
    for (const other of items) other.tabIndex = other === item ? 0 : -1;
    item?.focus();
  };
  for (const item of items) item.tabIndex = -1;
  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (!open) return;
    const { x, y } = place();
    menu.style.setProperty("--_menu-x", `${x}px`);
    menu.style.setProperty("--_menu-y", `${y}px`);
    focusItem(items.find((item) => item.ariaChecked === "true") ?? items[0]);
  };

  trigger.addEventListener("click", () => setOpen(menu.hidden !== false));
  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true);
    focusItem(event.key === "ArrowDown" ? items[0] : items.at(-1));
  });
  for (const item of items) {
    item.addEventListener("pointerenter", () => focusItem(item));
    item.addEventListener("click", () => {
      for (const other of items) other.ariaChecked = String(other === item);
      setOpen(false);
      trigger.focus();
      onSelect(item);
    });
  }
  menu.addEventListener("keydown", (event) => {
    const index = items.findIndex((item) => item === document.activeElement);
    if (event.key === "Tab") {
      trigger.focus();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") focusItem(items[(index + 1) % items.length]);
    else if (event.key === "ArrowUp") focusItem(items[(index - 1 + items.length) % items.length]);
    else if (event.key === "Home") focusItem(items[0]);
    else if (event.key === "End") focusItem(items.at(-1));
    else if (event.key === "Escape") {
      setOpen(false);
      trigger.focus();
    } else return;
    event.preventDefault();
  });
  document.addEventListener("focusin", (event) => {
    if (
      event.target instanceof Node &&
      !trigger.contains(event.target) &&
      !menu.contains(event.target)
    )
      setOpen(false);
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!menu.hidden && !trigger.contains(target) && !menu.contains(target)) setOpen(false);
  });

  return {
    close: () => {
      if (menu.contains(document.activeElement)) trigger.focus();
      setOpen(false);
    },
    isOpen: () => !menu.hidden,
  };
};
