


checkWin = () => {
  // jquery code to check if all cards have class "matched"
  if ($(".matched").length === 6) {
    // add modal on top of the page
    //stop timer
    timeElapsed = timeDifficulty - $("#timer").text();
    clearInterval(timer);
    setTimeout(() => {
      $("#winModal").modal("toggle");
      $(".modal-body").html(`You've matched all cards!<br>
      Total time Elapsed: ${timeElapsed} seconds<br>
      Total clicks: ${$("#clickCounter").text()}<br>`);
    }, 100);
  }
};


checkPairsCount = () => {
  // $("#pairsRemaining").text(totalPairs - $(".matched").length);
  $("#pairsRemaining").text(totalPairs);
}


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
  console.log(timer);
  timer = null;
  $("#timer").addClass("d-none");
  console.log(timer);
  $("#timer").html("");
  $("#clickCounter").text("");
  $("#cards").text("");
  // remove class selectedDifficulty from #easyBtn, #mediumBtn, #hardBtn
  $("#easyBtn").removeClass("selectedDifficulty");
  $("#mediumBtn").removeClass("selectedDifficulty");
  $("#hardBtn").removeClass("selectedDifficulty");
  // toggle class flip for all cards
  $(".card").removeClass("flip");
  // remove class matched for all cards
  $(".card").removeClass("border border-success border-4 matched");
  // remove all previous event listeners
  $(".card").off("click");
  $("#game_grid").addClass("d-none");
  setup();

};



const resetGameBtn = () => {
  $(".resetBtn").on("click", () => {
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
    //show game grid
    $("#game_grid").removeClass("d-none");
    $("#resetBtn").prop("disabled", false);
    $("#startBtn").prop("disabled", true);
    $("#timer").removeClass("d-none");
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
  if (timer !== null) {
    clearInterval(timer);
  }
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
  if (timer !== null) {
    clearInterval(timer);
  }
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
  if (timer !== null) {
    clearInterval(timer);
  }
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
  timeDifficulty = 240;
  totalPairs = 15;
  $("#pairsRemaining").text(totalPairs);
  startHardTimer();
};

const mediumGame = () => {
  timeDifficulty = 180;
  totalPairs = 10;
  $("#pairsRemaining").text(totalPairs);
  startMediumTimer();
};

const easyGame = () => {
  timeDifficulty = 120;
  totalPairs = 3;
  console.log("totalPairs: ", totalPairs)
  $("#pairsRemaining").text(totalPairs);
  startEasyTimer();
};


const setup = () => {
  let difficulty;
  let timer;
  let timeDifficulty;
  totalPairs = undefined;
  resetGameBtn();
  setDifficulty();
  startGame();
  let canFlip = true;
  let firstCard = undefined
  let secondCard = undefined
  $(".card").on(("click"), function () {
    if (!canFlip || $(this).hasClass("flip")) {
      return; // Do nothing if flipping is not allowed or the card is already flipped
    }
    $(this).toggleClass("flip");

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0]
      console.log("First card selected: ", firstCard);
    } else {
      // console.log("First card selected: ", firstCard);
      secondCard = $(this).find(".front_face")[0]
      console.log("Second card selected: ", secondCard);
      if (firstCard.src == secondCard.src) {
        console.log(firstCard.src, "+", secondCard.src, "= Match!");
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        $(`#${firstCard.id}`).parent().addClass("border border-success border-4 matched")
        $(`#${secondCard.id}`).parent().addClass("border border-success border-4 matched")
        console.log("Total pairs remaining: ", totalPairs);
        totalPairs--;
        console.log("Total pairs remaining: ", totalPairs);
        firstCard = undefined;
        secondCard = undefined;
      } else {
        console.log(firstCard.src, "+", secondCard.src, "= Not a match!");
        canFlip = false;
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
          firstCard = undefined;
          secondCard = undefined;
          canFlip = true;
        }, 1000)
      }

      checkPairsCount();
      checkWin();
    }
  });

}

$(document).ready(setup)