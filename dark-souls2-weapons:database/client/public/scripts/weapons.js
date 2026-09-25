const renderWeapons = async () => {
  const response = await fetch("/weapons");
  if (!response.ok) {
    throw new Error(`Could not load weapons (HTTP ${response.status}).`);
  }
  const weapons = await response.json();
  if (!Array.isArray(weapons)) {
    throw new Error("The server did not return a weapon list.");
  }

  const weaponContent = document.getElementById("weapon-content");

  if (!weapons || weapons.length === 0) {
    weaponContent.textContent = "No weapons available.";
    return;
  }

  weapons.forEach((weapon) => {
    const card = document.createElement("article");
    card.className = "weapon-card";

    const image = document.createElement("img");
    image.src = weapon.image;
    image.alt = weapon.name;

    const title = document.createElement("h2");
    title.textContent = weapon.name;

    const type = document.createElement("p");
    const typeLabel = document.createElement("strong");
    typeLabel.textContent = "Type: ";
    type.append(typeLabel, weapon.weaponType);

    const damage = document.createElement("p");
    const damageLabel = document.createElement("strong");
    damageLabel.textContent = "Damage: ";
    damage.append(damageLabel, weapon.damage);

    const description = document.createElement("p");
    description.textContent = weapon.description;

    const link = document.createElement("a");
    link.href = `/weapons/${encodeURIComponent(weapon.id)}`;
    link.textContent = "View Details";
    link.role = "button";

    card.append(image, title, type, damage, description, link);
    weaponContent.append(card);
  });

  const searchInput = document.getElementById("weapon-search");
  const searchStatus = document.getElementById("search-status");
  const cards = weaponContent.querySelectorAll(".weapon-card");

  const filterWeapons = () => {
    const searchText = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const weaponName = weapons[index].name.toLowerCase();
      const matches = weaponName.includes(searchText);

      card.style.display = matches ? "" : "none";
      if (matches) {
        visibleCount++;
      }
    });
    searchStatus.textContent =
      visibleCount === 0
        ? "No weapons match your search."
        : `Showing ${visibleCount} of ${weapons.length} weapons.`;
  };

  searchInput.disabled = false;
  searchInput.addEventListener("input", filterWeapons);
  filterWeapons();
};

renderWeapons().catch((error) => {
  console.error(error);
  document.getElementById("weapon-content").textContent =
    "Unable to load weapons. Check that the server is running, then refresh.";
});
