const PAGE_SIZE = 10
let currentPage = 1;
let pokemons = []


const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty()
  let startPage;
  let endPage;
  if (currentPage < 3) {
    startPage = 1;
    endPage = 5;
  }
  else if (currentPage + 2 > numPages) {
    startPage = numPages - 4;
    endPage = numPages;
  }
  else {
    startPage = currentPage - 2;
    endPage = currentPage + 2;
  }
  for (let i = startPage; i <= endPage; i++) {
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 numberedButtons d-flex align-items-center justify-content-center" value="${i}">${i}</button>
    `)
  }
}


const updatePaginationDivFilter = (currentPage, numPages) => {
  $('#pagination').empty();

  let startPage;
  let endPage;

  if (currentPage <= 3) {
    startPage = 1;
    endPage = Math.min(5, numPages);
  } else if (currentPage + 2 >= numPages) {
    startPage = Math.max(numPages - 4, 1);
    endPage = numPages;
  } else {
    startPage = currentPage - 2;
    endPage = currentPage + 2;
  }

  for (let i = startPage; i <= endPage; i++) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons d-flex align-items-center justify-content-center" value="${i}">${i}</button>
    `);
  }
}


const disableNavigationButtons = (currentPage, numPages) => {
  if (currentPage === 1) {
    $('.prevBtn').attr('disabled', true)
  } else {
    $('.prevBtn').attr('disabled', false)
  }
  if (currentPage === numPages) {
    $('.nextBtn').attr('disabled', true)
  } else {
    $('.nextBtn').attr('disabled', false)
  }
}

const disableNavigationButtonsFilter = (currentPage, numPages) => {
  if (currentPage === 1) {
    $('.prevBtn').attr('disabled', true)
  } else {
    $('.prevBtn').attr('disabled', false)
  }
  if (currentPage === numPages) {
    $('.nextBtn').attr('disabled', true)
  } else {
    $('.nextBtn').attr('disabled', false)
  }
}



const disableActivePage = (currentPage) => {
  const currentSelected = document.querySelector(`.numberedButtons[value="${currentPage}"]`)
  currentSelected.classList.add('active')
  currentSelected.setAttribute('disabled', true)
}

const disableActivePageFilter = (currentPage) => {
  const currentSelected = document.querySelector(`.numberedButtons[value="${currentPage}"]`)
  currentSelected.classList.add('active')
  currentSelected.setAttribute('disabled', true)
}






const populatePage = async (currentPage, PAGE_SIZE, pokemons) => {
  limit_ten_pokemons = await pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  console.log("limit_ten_pokemons: ", limit_ten_pokemons)
  $('#pokeCards').empty()
  limit_ten_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    $('#pokeCards').append(`
    <div class="pokeCard card" pokeName=${res.data.name}>
    <h3>${res.data.name.toUpperCase()}</h3> 
    <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">
    More
    </button>
    </div>  
    `)
  })
}

const paginateFiltered = async (pokemons) => {
  console.log("paginateFiltered(): ", pokemons)
  // let rangeTenPokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
  console.log("numPages: ", numPages);
  console.log("currentPage: ", currentPage);
  updatePaginationDivFilter(currentPage, numPages)
  disableNavigationButtonsFilter(currentPage, numPages)
  disableActivePageFilter(currentPage)
  populatePage(currentPage, PAGE_SIZE, pokemons);
  console.log("Before watchButtons()")
  watchButtons(currentPage, numPages, pokemons, PAGE_SIZE)
  console.log("After watchButtons()")
}

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  // selected_pokemons = await pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  // console.log("selected_pokemons: ", selected_pokemons)
  // console.log("selected_pokemons type: ", typeof selected_pokemons)
  populatePage(currentPage, PAGE_SIZE, pokemons);
}


const watchButtons = (currentPage, numPages, pokemons, PAGE_SIZE) => {
  console.log("Inside watchButtons() Outside of eventlisteners: pokemon: ", pokemons);

  $('body').off('click', ".numberedButtons");
  $('body').off('click', ".prevBtn");
  $('body').off('click', ".nextBtn");

  // setup event listeners for pagination
  $('body').on('click', ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value)
    console.log("Inside watchButtons(): pokemon: ", pokemons);
    paginate(currentPage, PAGE_SIZE, pokemons)
    updatePaginationDivFilter(currentPage, numPages)
    disableActivePageFilter(currentPage)
    disableNavigationButtonsFilter(currentPage, numPages)
  })

  // add event listener to classes prevBtn and nextBtn
  $('body').on('click', ".prevBtn", async function (e) {
    if (currentPage > 1) {
      currentPage -= 1
      console.log("Inside watchButtons(): pokemon: ", pokemons);
      paginate(currentPage, PAGE_SIZE, pokemons)
      updatePaginationDiv(currentPage, numPages)
      disableActivePage(currentPage)
      disableNavigationButtons(currentPage, numPages)
    }
  })

  $('body').on('click', ".nextBtn", async function (e) {
    if (currentPage < numPages) {
      currentPage += 1
      console.log("Inside watchButtons(): pokemon: ", pokemons);
      updatePaginationDiv(currentPage, numPages)
      paginate(currentPage, PAGE_SIZE, pokemons)
      disableActivePage(currentPage)
      disableNavigationButtons(currentPage, numPages)
    }
  })

}
// const watchButtonsFilter = (currentPage, numPages, pokemons, PAGE_SIZE) => {
//   // setup event listeners for pagination
//   $('body').on('click', ".numberedButtons", async function (e) {
//     currentPage = Number(e.target.value)
//     paginateFiltered(pokemons)

//     //update pagination buttons
//     updatePaginationDivFilter(currentPage, numPages)
//     disableActivePageFilter(currentPage)
//     disableNavigationButtonsFilter(currentPage, numPages)
//   })

//   // add event listener to classes prevBtn and nextBtn
//   $('body').on('click', ".prevBtn", async function (e) {
//     if (currentPage > 1) {
//       currentPage -= 1
//       paginateFiltered(pokemons)
//       updatePaginationDivFilter(currentPage, numPages)
//       disableActivePageFilter(currentPage)
//       disableNavigationButtonsFilter(currentPage, numPages)
//     }
//   })

//   $('body').on('click', ".nextBtn", async function (e) {
//     if (currentPage < numPages) {
//       currentPage += 1

//       updatePaginationDivFilter(currentPage, numPages)
//       paginateFiltered(pokemons)
//       disableActivePageFilter(currentPage)
//       disableNavigationButtonsFilter(currentPage, numPages)
//     }
//   })

// }

const filterPage = async (pokemons) => {
  // const filterPage = async (currentPage, PAGE_SIZE, pokemons) => {
  const selectedTypes = []
  const filteredPokemonList = []
  const typeCheckboxes = document.querySelectorAll('.form-check-input')
  typeCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedTypes.push(checkbox.value)
    }
  })
  // console.log("selectedTypes length: ", selectedTypes.length)
  console.log("selectedTypes: ", selectedTypes);
  // if no types are selected, show the default 10 pokemon:
  if (selectedTypes.length === 0) {
    console.log("No types selected!")
    paginate(currentPage, PAGE_SIZE, pokemons)
    return
  }
  // only add pokemon to filteredList if it has a type that matches all selected types
  for (const pokemon of pokemons) {
    const res = await axios.get(pokemon.url)
    const types = res.data.types.map((type) => type.type.name)
    let addPokemon = true
    selectedTypes.forEach((type) => {
      if (!types.includes(type)) {
        addPokemon = false
      }
    })
    if (addPokemon) {
      filteredPokemonList.push(pokemon)
    }
  }
  if (filteredPokemonList.length === 0) {
    console.log("filteredPokemonList: ", filteredPokemonList);
    $('#pokeCards').empty()
    $('#pokeCards').append(`
    <div>
    <h3>No Pokemon Found :(</h3>
    </div>
    `)
  }
  else {
    console.log("filterpage(): filteredPokemonList: ", filteredPokemonList);
    let pokemons = filteredPokemonList
    console.log("filterpage(): pokemons: ", pokemons);
    paginateFiltered(pokemons)
  }
}
// Populate the sidebar with all available pokemon types
const populateSidebarTypes = (pokemons) => {
  $('#typeDiv').empty()
  const types = []
  pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    // const types = res.data.types.map((type) => type.type.name)
    res.data.types.forEach((type) => {
      if (!types.includes(type.type.name)) {
        let typeSelector;
        types.push(type.type.name)
        $('#typeDiv').append(`
        <li>
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${type.type.name}" id="${type.type.name}">
        <label class="form-check-label" for="${type.type.name}">
        ${type.type.name}
        </label>
        </div>
        </li>
        `)
        typeSelector = document.querySelector(`#${type.type.name}`)
        typeSelector.addEventListener('change', () => { filterPage(pokemons) })
      }
    })
  })
  console.log("Current Page types: ", types);
}

const getPokemonAPI = async () => {
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemons = response.data.results;
  return pokemons
};


// Main function
const setup = async () => {
  $('#pokeCards').empty()
  pokemons = await getPokemonAPI()
  const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
  populateSidebarTypes(pokemons);
  paginate(currentPage, PAGE_SIZE, pokemons)
  updatePaginationDiv(currentPage, numPages)
  disableActivePage(currentPage)
  disableNavigationButtons(currentPage, numPages)
  watchButtons(currentPage, numPages, pokemons, PAGE_SIZE)
  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    // console.log("types: ", types);
    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>
        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
        </div>
        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
        `)
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
  })
}


$(document).ready(setup)