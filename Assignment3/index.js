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
  // let startPage = currentPage;
  // let endPage = numPages;
  for (let i = startPage; i <= endPage; i++) {
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 numberedButtons d-flex align-items-center justify-content-center" value="${i}">${i}</button>
    `)
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


const disableActivePage = (currentPage) => {
  const currentSelected = document.querySelector(`.numberedButtons[value="${currentPage}"]`)
  currentSelected.classList.add('active')
  currentSelected.setAttribute('disabled', true)
}

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  $('#typeDiv').empty()
  const types = []
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    // const types = res.data.types.map((type) => type.type.name)

    res.data.types.forEach((type) => {
      if (!types.includes(type.type.name)) {
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
      }
    })
  })
  $('#pokeCards').empty()
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">
          More
        </button>
        </div>  
        `)
  })




}

const setup = async () => {
  // test out poke api using axios here


  $('#pokeCards').empty()
  // let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1015');
  pokemons = response.data.results;


  paginate(currentPage, PAGE_SIZE, pokemons)
  const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
  updatePaginationDiv(currentPage, numPages)
  disableActivePage(currentPage)
  disableNavigationButtons(currentPage, numPages)

  // pop up modal when clicking on a pokemon card
  // add event listener to each pokemon card
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

  // add event listener to pagination buttons
  $('body').on('click', ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value)
    paginate(currentPage, PAGE_SIZE, pokemons)

    //update pagination buttons
    updatePaginationDiv(currentPage, numPages)
    disableActivePage(currentPage)
    disableNavigationButtons(currentPage, numPages)
  })

  // if (currentPage === 1) {
  //   $('.prevBtn').attr('disabled', true)
  // }
  // if (currentPage === numPages) {
  //   $('.nextBtn').attr('disabled', true)
  // }


  // add event listener to classes prevBtn and nextBtn
  $('body').on('click', ".prevBtn", async function (e) {
    if (currentPage > 1) {
      currentPage -= 1
      paginate(currentPage, PAGE_SIZE, pokemons)
      updatePaginationDiv(currentPage, numPages)
      disableActivePage(currentPage)
      disableNavigationButtons(currentPage, numPages)
    }
  })

  $('body').on('click', ".nextBtn", async function (e) {
    if (currentPage < numPages) {
      currentPage += 1
      paginate(currentPage, PAGE_SIZE, pokemons)
      updatePaginationDiv(currentPage, numPages)
      disableActivePage(currentPage)
      disableNavigationButtons(currentPage, numPages)
    }
  })

}


$(document).ready(setup)