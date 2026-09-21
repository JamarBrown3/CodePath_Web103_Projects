const renderWeapon = async () => {
  const requestedID = Number(window.location.pathname.split("/").pop());

  const response = await fetch("/weapons");
  if (!response.ok) {
    throw new Error(`Could not load weapons (HTTP ${response.status}).`);
  }
  const weapons = await response.json();
  if (!Array.isArray(weapons)) {
    throw new Error("The server did not return a weapon list.");
  }

  const weapon = weapons.find((item) => item.id === requestedID);
  const weaponDetail = document.getElementById("weapon-detail");

  if (!weapon) {
    weaponDetail.textContent = "Weapon not found.";
    return;
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
