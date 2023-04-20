// Cream un obiect in care punem o proprietate care primeste valoarea linkului din pagina
const global = {
    currentPage: window.location.pathname,
    search:{
        term:'',
        type:'',
        page:1,
        totalPages:1,
        totalResults:0
    },
    api: {
      apiKey: '8f28ca44b3ae15f44603c63265c7255e',
      apiUrl: 'https://api.themoviedb.org/3/'
    }
  }
  
  // Fetch data from TMDB API
  // cand va fi chemata functia fetchApiData(endpoint) vom pune fetchApiData(valoarea de aici va primi continuarea linkului in functie de ce avem nevoie din API )
  async function fetchApiData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
  
    showSpinner()
    // fetch(adaugam linkul API/si/variabila din functie si cealanta variabila cu api key) nu sa pus / pentru ca sa lasat in link /
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)
  
    const data = await response.json()
  
    hideSpinner()
  
    return data;
  }

//  Request to Search
 async function searchApiData(){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
  
    showSpinner()

    // Vom trage din API doar datele care corespund cu valoriile primite de la search(acolo vom face rost de type&term&page)
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`)
  
    const data = await response.json()
  
    hideSpinner()
  
    return data;
 } 

//   Search movie and shows
async function search(){

  // query string inseamna ce e in url dupa ?.....
    // in HTML form input avem name="search-term" si va aparea in url dupa submit si in url va aparea search-term=(textul pus in input)
    // in HTML form input radio button avem name="type" va aparea in url dupa submit iar valoarea lui va fi value="(in functie de butonu apasat)"

    const queryString = window.location.search;

    // cream un obiect pentru a putea trage datele din url.

    const urlParams = new URLSearchParams(queryString)

    // Add the type and term to the global object.
    // valorile vor fi oferite in object.object.key : in functie de valorile din url de dupa ?....

    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');

    if(global.search.term !== '' && global.search.term !== null){
        
        const {results, total_pages, page, total_results} = await searchApiData()

        global.search.page = page
        global.search.totalPages = total_pages
        global.search.totalResults = total_results

        if(results.length === 0){
            showAlert('No results found')
            return;
        }
        displaySearchResults(results);
        document.querySelector('#search-term').value='';
    }else{
        showAlert('Please enter a Movie or Show name')
    }
}

function displaySearchResults(results){
    // clear prev result
    document.querySelector('#search-results').innerHTML = ''
    document.querySelector('#search-results-heading').innerHTML = ''
    document.querySelector('#pagination').innerHTML = ''
    results.forEach(result => {
        const card = document.createElement('div')
        card.classList.add('card')
    
        card.innerHTML = `
              <a href="${global.search.type}-details.html?id=${result.id}">
                ${result.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" 
                    alt="${global.search.type === 'movie' ? result.title : result.name}"
                    class="card-img-top">`
            : `<img src="Portofolio-site/MovieApp/images/no-image.jpg" 
                    alt="${global.search.type === 'movie' ? result.title : result.name}
                    class="card-img-top">`
          }
              </a>
              <div class="card-body">
                <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
                <p class="card-text">
                  <small class="text-muted">Resale: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
                </p>
              </div>
            `
        document.querySelector('#search-results-heading').innerHTML=`
        <h2>${results.length} of ${global.search.totalResults}  for ${global.search.term}</h2>
        `
        document.querySelector('#search-results').appendChild(card)
      })

      displayPagination()
}
  
// Display pagination for search
function displayPagination(){
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML =`
    <button class = "btn btn-primary" id="prev">Prev</button>
    <button class = "btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `
    document.querySelector('#pagination').append(div)

    // deseafle prev button if fPage
    if(global.search.page === 1){
        document.querySelector('#prev').disabled = true
    }
    if(global.search.page === global.search.totalPages){
        document.querySelector('#next').disabled = true
    }

    // next
    document.querySelector('#next').addEventListener('click', async () =>{
        global.search.page++
        const {results, total_pages} = await searchApiData()
        displaySearchResults(results)
    })
    // prev
    document.querySelector('#prev').addEventListener('click', async () =>{
        global.search.page--
        const {results, total_pages} = await searchApiData()
        displaySearchResults(results)
    })
}
  // Display popular movie
  async function displayPopularMovies() {
    // aici facem Deconstruction pentru a trage din arrayul API-ul doar results. pentru ca exista in array o prioritate cu numele results.
    const { results } = await fetchApiData('movie/popular')
  
    // pentru fiecare obiect facem un div cu clasa card si punem in el datele din API.
    results.forEach(movie => {
      const card = document.createElement('div')
      card.classList.add('card')
  
      card.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              ${movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                  alt="${movie.title}"
                  class="card-img-top">`
          : `<img src="Portofolio-site/MovieApp/images/no-image.jpg" 
                  alt="${movie.title}"
                  class="card-img-top">`
        }
            </a>
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">
                <small class="text-muted">Resale: ${movie.release_date}</small>
              </p>
            </div>
          `
  
      document.querySelector('#popular-movies').appendChild(card)
    })
  }
  
  // Display popular shows
  async function displayPopularShows() {
    const { results } = await fetchApiData('tv/popular')
  
    results.forEach(show => {
      const card = document.createElement('div')
      card.classList.add('card')
  
      card.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
              ${show.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
                  alt="${show.name}"
                  class="card-img-top">`
          : `<img src="Portofolio-site/MovieApp/images/no-image.jpg" 
                  alt="${show.name}"
                  class="card-img-top">`
        }
            </a>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">
                <small class="text-muted">Air Date: ${show.first_air_date}</small>
              </p>
            </div>
          `
  
      document.querySelector('#popular-shows').appendChild(card)
    })
  }
  
  // Display movie Details
  
  async function displayMovieDetails() {
    // aici cream o variabila care va extrage doar numarul id-lui.
    const movieId = window.location.search.split('=')[1]
  
    // Aici tragem cu fatch din baza de date movie/id(filmului) facem asta pentru ca fiecare film are un id.
    const movie = await fetchApiData(`movie/${movieId}`)
  
    // overlay for background image
  
    displayBackgroundImage('movie', movie.backdrop_path)
  
    const div = document.createElement('div')
  
    div.innerHTML = `
      <div class="details-top">
      <div>
        ${movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
          alt="${movie.title}"
          class="card-img-top">`
        : `<img src="Portofolio-site/MovieApp/images/no-image.jpg" 
          alt="${movie.title}"
          class="card-img-top">`
      }
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Relase Date: ${movie.release_date}</p>
        <p>${movie.overview}</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget: $${addCommasToNum(movie.budget)}</span></li>
        <li><span class="text-secondary">Revenue: $${addCommasToNum(movie.revenue)}</span></li>
        <li><span class="text-secondary">Runtime: ${movie.runtime} minutes</span></li>
        <li><span class="text-secondary">Status: ${movie.status}</span></li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
      ${movie.production_companies
        .map(company => `<span>${company.name}</span>`)
        .join(', ')}
      </div>
    </div>
      `
    document.querySelector('#movie-details').appendChild(div)
  }
  
  // Display Show Details
  
  async function displayShowDetails() {
    const showId = window.location.search.split('=')[1]
    // Aici tragem cu fatch din baza de date movie/id(filmului) facem asta pentru ca fiecare film are un id.
    const show = await fetchApiData(`tv/${showId}`)
  
    // overlay for background image
  
    displayBackgroundImage('tv', show.backdrop_path)
  
    const div = document.createElement('div')
  
    div.innerHTML = `
      <div class="details-top">
      <div>
        ${show.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
          alt="${show.name}"
          class="card-img-top">`
        : `<img src="Portofolio-site/MovieApp/images/no-image.jpg" 
          alt="${show.name}"
          class="card-img-top">`
      }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
        <p>${show.overview}</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of Episodes: ${show.number_of_episodes}</span></li>
        <li><span class="text-secondary">Last Episode to Air 
        ${show.last_episode_to_air.name}</span></li>
        <li><span class="text-secondary">Status: ${show.status}</span></li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
      ${show.production_companies
        .map(company => `<span>${company.name}</span>`)
        .join(', ')}
      </div>
      <br>
      <h4>Production Creators</h4>
      <div class="list-group">
      ${show.created_by
        .map(creator => `<span>${creator.name}</span>`)
        .join(', ')}
      </div>
    </div>
      `
    document.querySelector('#show-details').appendChild(div)
  }
  
  // Display backdrop Details Pages
  function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div')
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';
  
    if (type === 'movie') {
      document.querySelector('#movie-details').appendChild(overlayDiv)
    } else {
      document.querySelector('#show-details').appendChild(overlayDiv)
    }
  }
  
  // Display slider movies
  async function DisplaySlider() {
    const { results } = await fetchApiData('movie/now_playing')
  
    results.forEach((movie) => {
      const div = document.createElement('div')
      div.classList.add('swiper-slide')
  
      div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          </a>
          <h4>
            <i class="fas fa-star text-secondary"></i>${movie.vote_average}/10
          </h4>
      `
      document.querySelector('.swiper-wrapper').appendChild(div)
      initSwiper()
    })
  
  }
  // Displat tv slider
  async function DisplayTvSlider() {
    const { results } = await fetchApiData('tv/airing_today')
  
    results.forEach((show) => {
      const div = document.createElement('div')
      div.classList.add('swiper-slide')
  
      div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
          </a>
          <h4>
            <i class="fas fa-star text-secondary"></i>${show.vote_average}/10
          </h4>
      `
      
      document.querySelector('.swiper-wrapper').appendChild(div)
      initSwiper()
    })
  
  }
  // Swiper setup.
  function initSwiper() {
    const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: true,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      breakpoints: {
        500: {
          slidesPerView: 2
        },
        700: {
          slidesPerView: 3
        },
        1200: {
          slidesPerView: 4
        },
      }
    })
  }

  // Spinner
  
  function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
  }
  
  function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
  }
  
  //Show Alert
  function showAlert(message, className = 'error'){
    const alertElement = document.createElement('div')
    alertElement.classList.add('alert', className)
    alertElement.append(document.createTextNode(message))
    document.querySelector('#alert').append(alertElement)

    setTimeout(() => alertElement.remove(),2000)
  }
  
  // o functie care sa puna , dupa fiecare 3 numere.
  function addCommasToNum(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // init app
  function init() {
    // In aceasta functie folosim switch se putea folosi si if. 
    // in switch(punem obiectul cu key care detine valoarea url pagina)
    // switch (global.currentPage) {
    //   case '/':
    //   case '/index.html':
    //     DisplaySlider()
    //     displayPopularMovies();
    //     break;
    //   case '/shows.html':
    //     DisplayTvSlider();
    //     displayPopularShows();
    //     break;
    //   case '/movie-details.html':
    //     displayMovieDetails()
    //     break;
    //   case '/tv-details.html':
    //     displayShowDetails()
    //     break;
    //   case '/search.html':
    //     search()
    //     break;
    // }
    if(global.currentPage.includes('/index.html')){
      DisplaySlider()
      displayPopularMovies();
    }else if(global.currentPage.includes('/shows.html')){
      DisplayTvSlider();
      displayPopularShows();
    }else if(global.currentPage.includes('/movie-details.html')){
      displayMovieDetails()
    }else if(global.currentPage.includes('/tv-details.html')){
      displayShowDetails()
    }else if(global.currentPage.includes('/search.html')){
      search()
    }
  
    activeLi()
  }
  
  
  // run function on page load.
  document.addEventListener('DOMContentLoaded', init)