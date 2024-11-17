import Toast from "./js/toast.js";
import Score from "./js/score.js";
import { fetchQuestions } from "./js/utils.js";

class Card {
  question;
  options;
  answer;
  id;
  isCorrect;

  constructor(question, options, answer, id) {
    this.question = question;
    this.options = options;
    this.answer = answer;
    this.id = id;
  }

  generateOption(option, correct) {
    if (correct) {
      return `
            <li class="card__option" data-correct="correct">${option}</li>
        `;
    }
    return `
        <li class="card__option">${option}</li>
    `;
  }

  generateCard() {
    const acc = this.options.map((o, i) => {
      if (this.answer.length) {
        return this.generateOption(o, this.answer.includes(i + 1));
      }
      return this.generateOption(o, this.answer === i + 1);
    });

    return `
          <div class="card" id="qid${this.id}">
              <h2 class="card__question">${this.question}</h2>
              <ul class="card__options">
                ${acc.join("")}
              </ul>
              <button id="validate" type="button" class="secondary">Valider</button>
          </div>
      `;
  }

  listenCard(Quizz) {
    const questions = document.querySelector(
      `.card#qid${this.id} .card__options`
    );
    const validateChoices = document.querySelector("button#validate");
    let locked = false;

    questions.addEventListener("click", (e) => {
      if (locked) return;
      const target = e.target;
      if (!target.classList.contains("card__option")) {
        locked = false;
        return;
      }

      target.classList.toggle("selected");
    });

    validateChoices.addEventListener("click", () => {
      locked = true;
      let correctAnswers = questions.querySelectorAll(
        ".card__option[data-correct=correct]"
      );
      let selectedAnswers = questions.querySelectorAll(
        ".card__option.selected"
      );

      if (!selectedAnswers.length) {
        return;
      }

      if (selectedAnswers.length !== correctAnswers.length) {
        selectedAnswers.forEach((s) => s.classList.add("wrong"));
        correctAnswers.forEach((a) => a.classList.add("correct"));
        this.isCorrect = false;
        Toast.popup(this.isCorrect);
        return;
      }

      let correct = true;
      selectedAnswers.forEach((s) => {
        if (!s.dataset.correct) {
          correct = false;
          s.classList.add("wrong");
        } else {
          s.classList.add("correct");
        }
      });

      this.isCorrect = correct;

      if (this.isCorrect) {
        correctAnswers.forEach((a) => {
          a.classList.add("correct");
          a.classList.remove("selected");
        });
      }
      Toast.popup(this.isCorrect);
    });
  }
}

class Quizz {
  #questions;
  currentQuestion = 0;
  timer;
  #shuffledQuestions;
  correctAnswers = 0;
  incorrectAnswers = 0;
  notAnswered = 0;
  app;
  locked = false;
  score;
  currentCard;

  constructor(questions, app) {
    this.#questions = questions;
    this.app = app;
    this.score = new Score(
      document.querySelector(".correct > .score"),
      document.querySelector(".wrong > .score"),
      document.querySelector(".stats__stat.neutral > .score"),
      questions.length
    );
    this.start();
  }

  start() {
    this.#shuffledQuestions = this.#questions
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    this.correctAnswers = this.incorrectAnswers = this.notAnswered = 0;
    this.score.setScore(0, 0, 0);
    this.popQuestion();
  }

  popQuestion() {
    const question = this.#shuffledQuestions[this.currentQuestion];
    const card = new Card(
      question.question,
      question.choix,
      question.reponse,
      this.currentQuestion
    );
    this.currentCard = card;
    this.app.innerHTML = "";
    this.app.insertAdjacentHTML("afterbegin", this.currentCard.generateCard());
    this.currentCard.listenCard(this);
  }

  next(correct) {
    this.currentQuestion++;
    if (correct === true) {
      this.correctAnswers++;
    } else if (correct === false) {
      this.incorrectAnswers++;
    } else {
      this.notAnswered++;
    }
    this.score.setScore(
      this.correctAnswers,
      this.incorrectAnswers,
      this.notAnswered
    );

    if (this.currentQuestion === this.#questions.length) {
      this.score.finalScore(
        this.correctAnswers,
        this.incorrectAnswers,
        this.notAnswered,
        this.#restart
      );
      return;
    }

    this.popQuestion();
  }

  #restart() {
    document.querySelector("#restart").addEventListener("click", function () {
      window.location.reload();
    });
  }
}

window.addEventListener("DOMContentLoaded", async function () {
  const app = document.querySelector("#app");
  const nextBtn = document.querySelector("button#next");
  const questions = await fetchQuestions();

  if (app) {
    const quizz = new Quizz(questions, app);
    nextBtn.addEventListener("click", () => {
      quizz.next(quizz.currentCard.isCorrect);
      Toast.unpop();
    });
  }
});
