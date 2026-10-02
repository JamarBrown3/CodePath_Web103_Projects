const renderWeapon = async () => {
  const requestedID = window.location.pathname.split("/").filter(Boolean).pop();
  const weaponDetail = document.getElementById("weapon-detail");

  const response = await fetch(`/weapons/${encodeURIComponent(requestedID)}/data`);
  if (response.status === 404) {
    weaponDetail.textContent = "Weapon not found.";
    return;
  }
  if (!response.ok) {
    throw new Error(`Could not load weapons (HTTP ${response.status}).`);
  }
  const weapon = await response.json();
  if (!weapon || Array.isArray(weapon) || typeof weapon !== "object") {
    throw new Error("The server did not return a weapon record.");
  }

  document.getElementById("image").src = weapon.image;
  document.getElementById("image").alt = weapon.name;
  document.getElementById("name").textContent = weapon.name;
  // Create the formatting ourselves; API values are inserted only as text.
  const setField = (id, labelText, value) => {
    const label = document.createElement("strong");
    label.textContent = `${labelText}: `;
    document.getElementById(id).replaceChildren(label, String(value));
  };

  setField("weaponId", "Weapon ID", weapon.id);
  setField("weaponType", "Weapon Type", weapon.weaponType);
  setField("damage", "Damage", weapon.damage);
  setField("scaling", "Scaling", weapon.scaling);
  setField("location", "Location", weapon.location);
  document.getElementById("description").textContent = weapon.description;
  document.title = `${weapon.name} | DS II Archive`;
};

renderWeapon().catch((error) => {
  console.error(error);
  document.getElementById("weapon-detail").textContent =
    "Unable to load weapon details. Check that the server is running, then refresh.";
});
