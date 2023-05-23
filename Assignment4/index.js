
// function to add CSS for selected difficulty
const addClassSelectedDifficulty = (difficulty) => {
  if (difficulty === "easy") {
    $("#mediumBtn").removeClass("selectedDifficulty");
    $("#hardBtn").removeClass("selectedDifficulty");
    $("#easyBtn").addClass("selectedDifficulty");
  }
  if (difficulty === "medium") {
    $("#easyBtn").removeClass("selectedDifficulty");
    $("#hardBtn").removeClass("selectedDifficulty");
    $("#mediumBtn").addClass("selectedDifficulty");
  }
  if (difficulty === "hard") {
    $("#easyBtn").removeClass("selectedDifficulty");
    $("#mediumBtn").removeClass("selectedDifficulty");
    $("#hardBtn").addClass("selectedDifficulty");
  }
};


// function to set difficulty level
const setDifficulty = () => {
  $("#startBtn").prop("disabled", true);
  $("#easyBtn").on("click", () => {
    difficulty = "easy";
    $("#mediumBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", false);
    $("#easyBtn").prop("disabled", true);
    addClassSelectedDifficulty(difficulty);
    $("#startBtn").prop("disabled", false);
  });
  $("#mediumBtn").on("click", () => {
    difficulty = "medium";
    $("#easyBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", false);
    $("#mediumBtn").prop("disabled", true);
    addClassSelectedDifficulty(difficulty);
    $("#startBtn").prop("disabled", false);
  });
  $("#hardBtn").on("click", () => {
    difficulty = "hard";
    $("#easyBtn").prop("disabled", false);
    $("#mediumBtn").prop("disabled", false);
    $("#hardBtn").prop("disabled", true);
    addClassSelectedDifficulty(difficulty);
    $("#startBtn").prop("disabled", false);
  });
};


const resetGame = () => {
  // reset the timer to ""
  clearInterval(timer);
  $("#timer").text("");
  $("#clickCounter").text("");
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

const startHardTimer = () => {
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

const startMediumTimer = () => {
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

const startEasyTimer = () => {
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

const hardGame = () => {
  startHardTimer();
};

const mediumGame = () => {
  startMediumTimer();
};

const easyGame = () => {
  startEasyTimer();
};

const setup = () => {
  let difficulty;
  let timer;
  resetGameBtn();
  setDifficulty();
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