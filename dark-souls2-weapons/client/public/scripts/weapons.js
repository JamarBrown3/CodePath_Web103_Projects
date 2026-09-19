const renderWeapons = async () => {
  const response = await fetch("/weapons");
  const weapons = await response.json();

  const weaponContent = document.getElementById("weapon-content");

  if (!weapons || weapons.length === 0) {
    weaponContent.innerHTML = "<h2> 😔 No weapons available.</h2>";
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
    type.innerHTML = `<strong>Type:</strong> ${weapon.weaponType}`;

    const damage = document.createElement("p");
    damage.innerHTML = `<strong>Damage:</strong> ${weapon.damage}`;

    const description = document.createElement("p");
    description.textContent = weapon.description;

    const link = document.createElement("a");
    link.href = `/weapons/${weapon.id}`;
    link.textContent = "View Details";
    link.role = "button";

    card.append(image, title, type, damage, description, link);
    weaponContent.append(card);
  });
};

renderWeapons();
