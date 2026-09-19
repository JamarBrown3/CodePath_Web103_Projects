const header = document.querySelector("header");

const nav = document.createElement("nav");
nav.className = "site-nav";

const brand = document.createElement("a");
brand.href = "/";
brand.className = "brand";
brand.textContent = "⚔ DS II Archive";

const homeLink = document.createElement("a");
homeLink.href = "/";
homeLink.textContent = "Weapon List";
homeLink.role = "button";

nav.append(brand, homeLink);
header.append(nav);
