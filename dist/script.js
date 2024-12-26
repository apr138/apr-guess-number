"use strict";
// Game Global settings
const MAX_NUM = 20;
const MAX_LIFE = 20;
const XPATH_CHECK = ".check";
const XPATH_AGAIN = ".again";
const XPATH_GUESS = ".guess";
const XPATH_FEEDBACK = ".message";
const XPATH_LIFE = ".score";
const XPATH_BEST_LIFE = ".highscore";
const XPATH_REVEAL_BOARD = ".number";
// Game
class Game {
    maxNum;
    score;
    xpath_check;
    xpath_guess;
    xpath_feedback;
    xpath_life;
    xpath_reveal_board;
    xpath_best_life;
    xpath_again;
    highscore;
    #secret;
    // user interaction
    checkBtn;
    againBtn;
    guessInput;
    // feedback
    feedback;
    lifeBoard;
    revealBoard;
    bestLifeBoard;
    constructor(maxNum, score, xpath_check, xpath_guess, xpath_feedback, xpath_life, xpath_reveal_board, xpath_best_life, xpath_again, highscore = 0) {
        this.maxNum = maxNum;
        this.score = score;
        this.xpath_check = xpath_check;
        this.xpath_guess = xpath_guess;
        this.xpath_feedback = xpath_feedback;
        this.xpath_life = xpath_life;
        this.xpath_reveal_board = xpath_reveal_board;
        this.xpath_best_life = xpath_best_life;
        this.xpath_again = xpath_again;
        this.highscore = highscore;
        this.#secret = this.secret;
        this.checkBtn = this.query(xpath_check);
        this.guessInput = this.query(xpath_guess);
        this.feedback = this.query(xpath_feedback);
        this.lifeBoard = this.query(xpath_life);
        this.revealBoard = this.query(xpath_reveal_board);
        this.bestLifeBoard = this.query(xpath_best_life);
        this.againBtn = this.query(xpath_again);
    }
    /**
     * secret()
     * Generate a secret number
     * @returns {number} A secret number
     * @example
     * const mySecret = new Game().secret;
     * console.log(mySecret);
     */
    get secret() {
        const value = Math.floor(Math.random() * this.maxNum) + 1;
        return value;
    }
    /**
     * Queries the DOM for an element using provided css selector.
     * Throws an Error if no element is found or if the element does not match the expected type.
     *
     * @template T The expected type ofthe HTML element.
     * @param selector {string} selector - A CSS selector string used to locate the element.
     * @returns {T} The found element, cast to the specified type.
     * @throws {Error} If no  element is found for the provided CSS selector.
     * @example
     * const btn = this.query<HTMLButtonElement>('.selector');
     */
    query(selector) {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error(`No html element found by that xpath: ${selector}`);
        }
        if (!(el instanceof HTMLElement)) {
            throw new Error(`The found element is not an instance of HTMLElement: ${selector}`);
        }
        return el;
    }
    /**
     * Returns the current score.
     *
     * @returns {number} The correct score.
     * @example
     * const curLife = this.life;
     */
    get life() {
        return this.score;
    }
    /**
     * Updates the score with new provided value.
     * Keeps DOM and state in sync.
     *
     * @param newLife {number} A new score.
     * @example
     * this.life = 20;
     */
    set life(newLife) {
        this.score = newLife;
        this.lifeBoard.textContent = `${newLife}`;
    }
    /**
     * Returns the current high score.
     * @returns {number} The current High score.
     * @example
     * const x = this.bestScore;
     * console.log(x);
     */
    get bestScore() {
        return this.highscore;
    }
    /**
     * Updates the highscore with new provide value if it was better that last game.
     * Keeps DOM and state in sync.
     *
     * @param newSore {number} A new high score.
     * @example
     * this.bestScore = 20;
     */
    set bestScore(newSore) {
        this.highscore = Math.max(this.highscore, newSore);
        this.bestLifeBoard.textContent = `${this.highscore}`;
    }
    /**
     * Click event handler function for check button.
     * Provides feeback to the user.
     */
    listenForCheck() {
        const value = this.guessInput.value;
        if (!value) {
            this.feedback.textContent = "Please choose a number!!";
            this.life -= 1;
        }
        else {
            const diff = this.#secret - Number(value);
            if (diff === 0) {
                document.body.classList.add("win");
                this.feedback.textContent = "Correct!! you won.";
                this.revealBoard.textContent = `${this.#secret}`;
                this.bestScore = this.life;
            }
            else if (diff > 0) {
                this.feedback.textContent = "Too low";
                this.life -= 1;
            }
            else {
                this.feedback.textContent = "Too high";
                this.life -= 1;
            }
        }
    }
    /**
     * Click event handler function for again button.
     * Resets the game expect highscore.
     */
    listenForAgain() {
        this.life = MAX_LIFE;
        this.#secret = this.secret;
        this.revealBoard.textContent = "?";
        this.feedback.textContent = "Start guessing...";
        this.guessInput.value = "";
        document.body.classList.remove("win");
    }
    /**
     * Setups the event handler.
     */
    listen() {
        this.checkBtn.addEventListener("click", () => this.listenForCheck());
        this.againBtn.addEventListener("click", () => this.listenForAgain());
    }
}
const game = new Game(MAX_NUM, MAX_LIFE, XPATH_CHECK, XPATH_GUESS, XPATH_FEEDBACK, XPATH_LIFE, XPATH_REVEAL_BOARD, XPATH_BEST_LIFE, XPATH_AGAIN);
game.listen();
