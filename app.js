import { createBoard } from "./script.js";

const boardElement = document.querySelector(".board");
const text_1 = document.querySelector('.txt-1')
const text_2 = document.querySelector('.txt-2')
const betBtn = document.getElementById('bet-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const mineInput = document.querySelector(".mineNum")
let MINE_COUNT = 0;
const currScore = document.querySelector(".curr-score");
let score = 0;
const BOARD_SIZE = 5;
const money = document.querySelector('.wallet-money');
const wallet = document.getElementById('wallet-btn');
const amountInput = document.querySelector(".amount");
let betAmount = 0;

window.onload = () => {
    amountInput.max = parseInt(money.innerText);
}

function checkInput(){
    betAmount = parseInt(amountInput.value);
    const  amountFilled = (amountInput.value.trim() !== "" && amountInput.value > 0 && amountInput.value <= parseInt(money.innerText));
    const mineFilled = MINE_COUNT > 0 && MINE_COUNT<25;
    betBtn.disabled = !(amountFilled && mineFilled);
}

mineInput.addEventListener("input", (e) => {
    MINE_COUNT = parseInt(e.target.value);
});
amountInput.addEventListener("input", checkInput);
mineInput.addEventListener("input", checkInput);

betBtn.addEventListener('click', () => {
    text_1.innerText = 'SCORE';
    text_2.innerText = '0';
    const board = createBoard(BOARD_SIZE, MINE_COUNT);
    boardElement.innerHTML = "";
    boardElement.style.setProperty("--size", BOARD_SIZE);
    board.forEach(row => {
        row.forEach(cell => {
            boardElement.appendChild(cell.element);
            cell.element.addEventListener("click", () => {
                if(cell.status === "hidden"){
                    if(cell.mine){
                        cell.status = "mine";
                        cell.element.classList.add("mine");
                        score = 0;
                        currScore.innerText = score;
                        withdrawBtn.disabled = true;
                        withdrawBtn.classList.add('hide');
                        amountInput.value = "";
                        mineInput.value = "";
                        setTimeout(() => {
                        alert("Game Over! You hit a mine!");
                        }, 800);
                        setTimeout(() => {
                            board.forEach(row => {
                                row.forEach(cell => {
                                    if(cell.mine){
                                        cell.status = "mine";
                                        cell.element.classList.add("mine");
                                    } else{
                                        cell.status = "safe";
                                        cell.element.classList.add("safe");
                                    }
                                });
                            });
                            setTimeout(() => {
                                boardElement.innerHTML = "";
                                boardElement.style.setProperty("--size", 0);
                            }, 2000);
                        }, 1000);
                        money.innerText = (Math.max(0, parseInt(money.innerText) - betAmount)).toFixed(2);
                        updateMoney(money.innerText);
                    } else{
                        cell.status = "safe";
                        cell.element.classList.add("safe");
                        score += 1;
                        if(score > 0){
                            withdrawBtn.disabled = false;
                            withdrawBtn.classList.remove('hide');
                        }
                        currScore.innerText = score;
                        if(score === (BOARD_SIZE * BOARD_SIZE) - MINE_COUNT){
                            alert(`You win ${calculateReward()}$! You cleared the board!`);
                            money.innerText = (parseInt(money.innerText) + calculateReward()).toFixed(2);
                            updateMoney(money.innerText);
                            score = 0;
                            currScore.innerText = score;
                            boardElement.innerHTML = "";
                            betBtn.disabled = false;
                            withdrawBtn.disabled = true;
                            withdrawBtn.classList.add('hide');
                        }
                    }
                }
            });
        });
    });
    betBtn.disabled = true;
});

withdrawBtn.addEventListener('click', () => {
    if(score > 0){
        const totalAmount = calculateReward();
        score = 0;
        currScore.innerText = 0;
        betBtn.disabled = false;
        withdrawBtn.disabled = true;
        withdrawBtn.classList.add('hide');
        alert(`You have withdrawn ${totalAmount}$!`);
        money.innerText = (totalAmount + parseInt(money.innerText)).toFixed(2);
        updateMoney(money.innerText);
        boardElement.innerHTML = "";
        boardElement.style.setProperty("--size", 0);
    } else{
        alert("You have no score to withdraw!");
    }
});

function calculateReward(){
    const safeCells = 25 - MINE_COUNT;
    const baseMultiplier = 1 + (MINE_COUNT / 24);
    let currentMultiplier = baseMultiplier;
    for(let i=1; i <= score; i++){
        const progress = i/safeCells;
        currentMultiplier *= (1 + progress * 0.1);
    }
    return +(betAmount * currentMultiplier).toFixed(2);
}

let savedMoney = localStorage.getItem('moneyLeft');
if(savedMoney != null){
    money.innerText = savedMoney;
}
function updateMoney(newAmount){
    amountInput.max = newAmount;
    localStorage.setItem('moneyLeft', newAmount);
}

wallet.addEventListener('click', () => {
    localStorage.clear();
    money.innerText = 100;
    updateMoney(money.innerText);
});