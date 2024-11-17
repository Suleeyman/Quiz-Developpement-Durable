export default class Toast {
  static popup(correct) {
    const texte = `${correct ? "✅ Bonne" : "🔴 Mauvaise"} réponse`;
    document.querySelector(".toast")?.remove();
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
              <div class="toast ${correct ? "correct" : "wrong"}">${texte}</div>
          `
    );
  }

  static unpop() {
    document.querySelector(".toast")?.remove();
  }
}
