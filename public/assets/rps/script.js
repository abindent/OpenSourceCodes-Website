let userScore = 0;
let computerScore = 0;
let alerts = false

// SELECTING SOME ELEMENTS BY THEIR SELECTOR
const scoreBoard = document.getElementsByClassName(".score-board");
const resultBoard = document.querySelector(".result > p");
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("bot-score");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissor_div = document.getElementById("s");
const reset_div = document.getElementById("reset");
const alert_div = document.getElementById("alert")

// FUMCTION CONVERTTOWORD
function convertToWord(letter){
    if(letter === "r") return "Rock";
    if(letter === "p") return "Paper";
    return "Scissor";
}

// FUNCTION WIN
function win(userChoice, opponentChoice){
    userScore++;
    userScore_span.innerHTML = userScore
    computerScore_span.innerText = computerScore
    resultBoard.innerHTML = `${convertToWord(userChoice)} <sub>user</sub>  beats  ${convertToWord(opponentChoice)} <sub>bot</sub> You win! 🔥`
    if(alerts===true){
    Swal.fire({
        title: 'You have won this turn.',
        icon: 'success',
        html:
            `${convertToWord(userChoice)} <sub>user</sub>  beats  ${convertToWord(opponentChoice)} <sub>bot</sub> You win! 🔥`,
        timer: 1500
    })
  }
}

// FUNCTION LOSE
function lose(userChoice, opponentChoice){
    computerScore++;
    computerScore_span.innerHTML = computerScore
    userScore_span.innerText = userScore    
    resultBoard.innerHTML =  `${convertToWord(opponentChoice)} <sub>bot</sub> beats  ${convertToWord(userChoice)} <sub>user</sub> You lose! 🔥`
    if(alerts===true){
    Swal.fire({
        title: 'You have lost this turn.',
        icon: 'error',
        html:
            `${convertToWord(opponentChoice)} <sub>bot</sub> beats  ${convertToWord(userChoice)} <sub>user</sub> You lose! 🔥`,
        timer: 1500
    })
   }
}
// FUNCTION DRAW
function draw(){
    userScore_span.innerText = userScore    
    computerScore_span.innerHTML = computerScore
    resultBoard.innerHTML = "No one is winner."   
}

// FUNCTION GETBOTCHOICE
function getBotChoice(){
const choices = ['r', 'p', 's']
const randomnumber =  Math.floor(Math.random() * 3)
return choices[randomnumber]
}

// FUNCTION GAME 
function game(userChoice){
    const opponentChoice = getBotChoice()
    switch(userChoice + opponentChoice){
        case "rs":
        case "pr":
        case "sp":
            win(userChoice, opponentChoice)
            break;
        case "rp":
        case "ps":
        case "sr":
            lose(userChoice, opponentChoice)
            break;
        case "rr":
        case "pp":
        case "ss":
            draw()
            break;
    }
}    

// FUNCTION MAIN
function main(){
    rock_div.addEventListener("click", function(){
        game("r");
    });

    paper_div.addEventListener("click", function(){
        game("p");
    });

    scissor_div.addEventListener("click", function(){
        game("s");
    });

    reset_div.addEventListener("click", function(){
        userScore = 0;
        computerScore = 0;
        userScore_span.innerHTML = userScore;
        computerScore_span.innerHTML = computerScore;
        resultBoard.innerText = `Rock Paper Scissors, Can You Win?`
    })
    alert_div.addEventListener("click", function(){
        if(alerts===false){
        alerts = true
        Swal.fire({
            title: 'Success',
            icon: 'success',
            html:
                `Enabled the alerts.`,
            timer: 1500
        })
        alert_div.innerText = "DISABLE ALERTS"
    }
        else{
            alerts = false;
            Swal.fire({
                title: 'Disabled',
                icon: 'success',
                html:
                    `Disabled the alerts.`,
                timer: 1500
            })
            alert_div.innerText = "ENABLE ALERTS"
        }
        
    });
}

main();