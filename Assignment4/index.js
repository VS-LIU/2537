

const addClassSelectedDifficulty = () => {
  // if the button clicked was #easyBtn
  if (difficulty === "easy") {
    // add class selectedDifficulty to #easyBtn
    $("#easyBtn").addClass("selectedDifficulty");
    // remove class selectedDifficulty from #mediumBtn and #hardBtn
    $("#mediumBtn").removeClass("selectedDifficulty");
    $("#hardBtn").removeClass("selectedDifficulty");
  }
  // if the button clicked was #mediumBtn
  if (difficulty === "medium") {
    // add class selectedDifficulty to #mediumBtn
    $("#mediumBtn").addClass("selectedDifficulty");
    // remove class selectedDifficulty from #easyBtn and #hardBtn
    $("#easyBtn").removeClass("selectedDifficulty");
    $("#hardBtn").removeClass("selectedDifficulty");
  }
  // if the button clicked was #hardBtn
  if (difficulty === "hard") {
    // add class selectedDifficulty to #hardBtn
    $("#hardBtn").addClass("selectedDifficulty");
    // remove class selectedDifficulty from #easyBtn and #mediumBtn
    $("#easyBtn").removeClass("selectedDifficulty");
    $("#mediumBtn").removeClass("selectedDifficulty");
  }
};



// function to set difficulty
const setDifficulty = () => {
  $("#startBtn").prop("disabled", true);
  $("#easyBtn").on("click", () => {
    difficulty = "easy";
    $("#mediumBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", false);
    $("#easyBtn").prop("disabled", true);
    addClassSelectedDifficulty();
    $("#startBtn").prop("disabled", false);
  });
  $("#mediumBtn").on("click", () => {
    difficulty = "medium";
    $("#easyBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", false);
    $("#mediumBtn").prop("disabled", true);
    addClassSelectedDifficulty();
    $("#startBtn").prop("disabled", false);
  });
  $("#hardBtn").on("click", () => {
    difficulty = "hard";
    $("#easyBtn").prop("disabled", false);
    $("#mediumBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", true);
    addClassSelectedDifficulty();
    $("#startBtn").prop("disabled", false);
  });
};


const resetGame = () => {
  // reset the timer to ""
  clearInterval(timer);
  $("#timer").text("");
  // stop the timer interval
  // reset the score to ""
  $("#clickCounter").text("");
  // reset the cards to ""
  $("#cards").text("");
  // remove class selectedDifficulty from #easyBtn, #mediumBtn, #hardBtn
  $("#easyBtn").removeClass("selectedDifficulty");
  $("#mediumBtn").removeClass("selectedDifficulty");
  $("#hardBtn").removeClass("selectedDifficulty");
};



const resetGameBtn = () => {
  $("#resetBtn").on("click", () => {
    // remove disabled attribute from #easyBtn, #mediumBtn, #hardBtn
    $("#easyBtn").prop("disabled", false);
    $("#mediumBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", false);
    resetGame();
    // reset game
    // reset timer
    // reset score
    // reset cards
    // disable start button until user selects a difficulty
    $("#startBtn").prop("disabled", true);
  });
};


const clickCounter = () => {
  // count the number of clicks
  let clicks = 0;
  $(".card").on("click", () => {
    clicks++;
    $("#clickCounter").text(clicks);
  });
};


// function to start game
const startGame = () => {
  $("#startBtn").on("click", () => {
    clickCounter();
    $("#resetBtn").prop("disabled", false);
    $("#startBtn").prop("disabled", true);
    // if difficulty is easy
    if (difficulty === "easy") {
      //disable other difficulty buttons
      $("#mediumBtn").prop("disabled", true);
      $("#hardBtn").prop("disabled", true);
      // start easy game
      easyGame();
    }
    // if difficulty is medium
    if (difficulty === "medium") {
      $("#easyBtn").prop("disabled", true);
      $("#hardBtn").prop("disabled", true);

      // start medium game
      mediumGame();
    }
    // if difficulty is hard
    if (difficulty === "hard") {
      $("#easyBtn").prop("disabled", true);
      $("#mediumBtn").prop("disabled", true);
      // start hard game
      hardGame();
    }
  });
};

const startEasyTimer = () => {
  // start timer for 2 minutes
  let time = 120;
  $("#timer").text(time);
  timer = setInterval(() => {
    time--;
    $("#timer").text(time);
    if (time === 0) {
      clearInterval(timer);
      alert("Game Over!");
      resetGame();
    }
  }, 1000);
};

const startMediumTimer = () => {
  // start timer for 3 minutes
  let time = 180;
  $("#timer").text(time);
  timer = setInterval(() => {
    time--;
    $("#timer").text(time);
    if (time === 0) {
      clearInterval(timer);
      alert("Game Over!");
      resetGame();
    }
  }, 1000);
};

const startHardTimer = () => {
  // start timer for 4 minutes
  let time = 240;
  $("#timer").text(time);
  timer = setInterval(() => {
    time--;
    $("#timer").text(time);
    if (time === 0) {
      clearInterval(timer);
      alert("Game Over!");
      resetGame();
    }
  }, 1000);
};


const easyGame = () => {
  // create array of 6 images
  //start timer for 2 minutes
  startEasyTimer();
};

const mediumGame = () => {
  // create array of 8 images
  //start timer for 3 minutes
  startMediumTimer();
};

const hardGame = () => {
  // create array of 10 images
  //start timer for 4 minutes
  startHardTimer();
};


const setup = () => {
  let difficulty;
  let timer;
  setDifficulty();
  resetGameBtn();
  startGame();
  let firstCard = undefined
  let secondCard = undefined
  $(".card").on(("click"), function () {
    $(this).toggleClass("flip");

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]
      console.log(firstCard, secondCard);
      if (
        firstCard.src
        ==
        secondCard.src
      ) {
        console.log("match")
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
      } else {
        console.log("no match")
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
        }, 1000)
      }
    }
  });
}

$(document).ready(setup)