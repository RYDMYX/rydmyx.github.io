// Inject CSS
const style = document.createElement("style");
style.textContent = `
#menuBtn {
  position: fixed;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
}

#menu {
  position: fixed;
  top: 50px;
  right: 15px;
  background: white;
  border: 1px solid #ccc;
  display: none;
  flex-direction: column;
  z-index: 1000;
}

#menu a {
  padding: 10px 15px;
  text-decoration: none;
  color: black;
  display: block;
}

#menu a:hover {
  background: #f0f0f0;
}
`;
document.head.appendChild(style);

// Inject HTML
const menuBtn = document.createElement("div");
menuBtn.id = "menuBtn";
menuBtn.innerHTML = "☰";

const menu = document.createElement("div");
menu.id = "menu";
menu.innerHTML = `
  <a href="/">About</a>
  <a href="/privacy.html">Privacy Policy</a>
  <a href="/contact.html">Contact</a>
`;

document.body.appendChild(menuBtn);
document.body.appendChild(menu);

// Toggle behavior
menuBtn.onclick = () => {
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

// Optional: close when clicking outside
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== menuBtn) {
    menu.style.display = "none";
  }
});