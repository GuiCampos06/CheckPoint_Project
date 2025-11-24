document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("btnMenuMobile");
    const menu = document.getElementById("menuMobile");

    if (botao) {
        botao.addEventListener("click", () => {
            if (menu.style.display === "flex") {
                menu.style.display = "none";
            } else {
                menu.style.display = "flex";
            }
        });
    }
});