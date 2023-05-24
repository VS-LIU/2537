checkWin = () => {
  // if total pairs remaining is0
  // add modal on top of the page
  //stop timer

  if ($("#pairsRemaining").text() === "0") {
    // add modal on top of the page
    //stop timer
    timeElapsed = timeDifficulty - $("#timer").text();
    clearInterval(timer);
    setTimeout(() => {
      $("#winModal").modal("toggle");
      $(".modal-body").html(`You've matched all the cards!<br>
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
  $("#game_grid").empty();
  //turn off click for start button
  $("#startBtn").off("click");
  // turn off click for game grid
  $("#game_grid").off("click");
  setup();
  // newGame();
};

// const newGame = async () => {
//   pokemons = await getPokemon();
//   let difficulty;
//   let timer;
//   let timeDifficulty;
//   let canFlip = true;
//   let firstCard = undefined
//   let secondCard = undefined
//   totalPairs = undefined;
//   resetGameBtn();
//   setDifficulty();
//   startGame(pokemons);
// };



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
const startGame = async (pokemons) => {
  $("#startBtn").on("click", async () => {
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
      await easyGame(pokemons);
      addClickEventToCards();
    }
    // if difficulty is medium
    if (difficulty === "medium") {
      $("#easyBtn").prop("disabled", true);
      $("#hardBtn").prop("disabled", true);

      // start medium game
      await mediumGame(pokemons);
      addClickEventToCards();
    }
    // if difficulty is hard
    if (difficulty === "hard") {
      $("#easyBtn").prop("disabled", true);
      $("#mediumBtn").prop("disabled", true);
      // start hard game
      await hardGame(pokemons);
      addClickEventToCards();
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

const hardGame = async (pokemons) => {
  timeDifficulty = 240;
  totalPairs = 15;
  //grab 15 random pokemons from pokemons 
  const randomPokemons = _.sampleSize(pokemons, totalPairs);
  let cardID = 1;
  for (const pokemon of randomPokemons) {
    // randomPokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    for (let i = 0; i < 2; i++) {
      $("#game_grid").append(`
      <div class="card">
      <img id="${cardID}" class="front_face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">
      <img class="back_face" src="back.webp" alt="">
      </div>
      `);
      $(".card").css("flex", "calc(100% / 6)");
      $(".card").css("max-width", "calc(100% / 6)");
      $(".card").css("padding-bottom", "170px");
      cardID++;
    }
    // });
  }
  $("#pairsRemaining").text(totalPairs);
  startHardTimer();
};

const mediumGame = async (pokemons) => {
  // change the flex and max-width css property of .card

  timeDifficulty = 180;
  totalPairs = 10;
  console.log("asdfasdftotalPairs: ", totalPairs)
  const randomPokemons = _.sampleSize(pokemons, totalPairs);
  let cardID = 1;
  const cards = [];
  for (const pokemon of randomPokemons) {
    // randomPokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    for (let i = 0; i < 2; i++) {
      const cardElement = `
      <div class="card">
      <img id="${cardID}" class="front_face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">
      <img class="back_face" src="back.webp" alt="">
      </div>
      `;

      cards.push(cardElement);
      cardID++;
    }
    // });
  }

  const shuffledCards = _.shuffle(cards);
  for (const card of shuffledCards) {
    $("#game_grid").append(card);
    $(".card").css("flex", "calc(100% / 5)");
    $(".card").css("max-width", "calc(100% / 5)");
    $(".card").css("padding-bottom", "190px");
  }
  $("#pairsRemaining").text(totalPairs);
  startMediumTimer();
};

const easyGame = async (pokemons) => {
  timeDifficulty = 120;
  totalPairs = 3;
  console.log("asdfasdftotalPairs: ", totalPairs)
  const randomPokemons = _.sampleSize(pokemons, totalPairs);
  let cardID = 1;
  const cards = [];
  for (const pokemon of randomPokemons) {
    // randomPokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    for (let i = 0; i < 2; i++) {
      const cardElement = `
      <div class="card">
      <img id="${cardID}" class="front_face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">
      <img class="back_face" src="back.webp" alt="">
      </div>
      `;

      cards.push(cardElement);
      cardID++;
    }
    // });
  }

  const shuffledCards = _.shuffle(cards);
  for (const card of shuffledCards) {
    $("#game_grid").append(card);
    $(".card").css("flex", "calc(100% / 3)");
    $(".card").css("max-width", "calc(100% / 3)");
    $(".card").css("padding-bottom", "315px");
  }



  $("#pairsRemaining").text(totalPairs);
  startEasyTimer();
};
// const easyGame = async (pokemons) => {
//   timeDifficulty = 120;
//   totalPairs = 3;
//   console.log("totalPairs: ", totalPairs)
//   const randomPokemons = _.sampleSize(pokemons, totalPairs);
//   let cardID = 1;
//   const cards = [];
//   for (const pokemon of randomPokemons) {
//   // randomPokemons.forEach(async (pokemon) => {
//     const res = await axios.get(pokemon.url);
//     for (let i = 0; i < 2; i++) {
//       $("#game_grid").append(`
//       <div class="card">
//       <img id="${cardID}" class="front_face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">
//       <img class="back_face" src="back.webp" alt="">
//       </div>
//       `);
//       $(".card").css("flex", "calc(100% / 3)");
//       $(".card").css("max-width", "calc(100% / 3)");
//       $(".card").css("padding-bottom", "315px");
//       cardID++;
//     }
//   // });
//   } 
//   $("#pairsRemaining").text(totalPairs);
//   startEasyTimer();
// };

const getPokemon = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  const pokemons = response.data.results;
  return pokemons
};

const helpBtn = () => {
  $("#helpBtn").on("click", function () {
    // for every card in the game grid, add a class of flip
    $(".card").addClass("flip");
    setTimeout(() => {
      // if the card does not have a class of match, remove the class of flip
      $(".card").not(".match").removeClass("flip");
    }, 500);
  });
};


const addClickEventToCards = () => {
  let canFlip = true;
  let firstCard = undefined
  let secondCard = undefined
  $("#game_grid").on("click", ".card", function () {
    // $(".card").on("click", function () {
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

};


const setup = async () => {
  let pokemons = [];
  pokemons = await getPokemon();
  let difficulty;
  let timer;
  let timeDifficulty;
  let canFlip = true;
  let firstCard = undefined
  let secondCard = undefined
  totalPairs = undefined;
  resetGameBtn();
  setDifficulty();
  helpBtn();
  await startGame(pokemons);

}

$(document).ready(setup)