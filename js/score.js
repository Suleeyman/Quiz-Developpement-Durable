export default class Score {
  correctSpan;
  incorrectSpan;
  notAnsweredSpan;

  constructor(correctSpan, incorrectSpan, notAnsweredSpan, total) {
    this.correctSpan = correctSpan;
    this.incorrectSpan = incorrectSpan;
    this.notAnsweredSpan = notAnsweredSpan;
    this.total;
  }

  setScore(correct, incorrect, notAnswered) {
    this.correctSpan.textContent = correct;
    this.incorrectSpan.textContent = incorrect;
    this.notAnsweredSpan.textContent = notAnswered;
  }

  finalScore(nCorrect, nIncorrect, notAnswered, restartCb) {
    const nbQuestions = nCorrect + nIncorrect + notAnswered;
    const note = ((nCorrect - nIncorrect) * 20) / nbQuestions;
    const noteArrondie = Math.round((note + Number.EPSILON) * 100) / 100;
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div class="final">
            <div class="final__result">
                <h2>Votre score final</h2>
                <div class="body-stat">
                    <p class="body-stat__stat correct-body">${nCorrect} ✅<p>
                    <p class="body-stat__stat neutral-body">${notAnswered} ◽<p>
                    <p class="body-stat__stat wrong-body">${nIncorrect} 🔴<p>
                </div>
                <p>Celui équivaut à l'examen : <strong>${
                  noteArrondie <= 0 ? 0 : noteArrondie
                } / 20</strong></p>
                <button type="button" class="primary" id="restart">🎓 Rejouer</button>
            </div>
        </div>
    `
    );

    restartCb();
  }
}
