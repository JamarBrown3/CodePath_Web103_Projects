const renderWeapon = async () => {
  const requestedID = Number(window.location.pathname.split("/").pop());

  const response = await fetch("/weapons");
  const weapons = await response.json();

  const weapon = weapons.find((item) => item.id === requestedID);
  const weaponDetail = document.getElementById("weapon-detail");

  if (!weapon) {
    weaponDetail.innerHTML = "<h2>Weapon not found.</h2>";
    return;
  }

  document.getElementById("image").src = weapon.image;
  document.getElementById("image").alt = weapon.name;
  document.getElementById("name").textContent = weapon.name;
  document.getElementById("weaponType").innerHTML =
    `<strong>Weapon Type:</strong> ${weapon.weaponType}`;
  document.getElementById("damage").innerHTML =
    `<strong>Damage:</strong> ${weapon.damage}`;
  document.getElementById("scaling").innerHTML =
    `<strong>Scaling:</strong> ${weapon.scaling}`;
  document.getElementById("location").innerHTML =
    `<strong>Location:</strong> ${weapon.location}`;
  document.getElementById("description").textContent = weapon.description;
  document.title = ` ${weapon.name} | DS II Archive`;
};

renderWeapon();
