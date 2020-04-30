const autocompleteConfig = {
  renderOption(movie) {
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; // we define if the movie has a poster or is
      //blank if is blank return no imagesrc if has a poster return the posteras img, and return the Title and the year
      return`
       <img src="${imgSrc}"/>
       ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie){ // we creatr this function to return movie correct title on the input
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/',{ // making the api call to this api and assing it to response variable
      params: {
        apikey: '12990f4a', //apikey required from this api to use it
        s: searchTerm // to search for movie title
      }
    });
    if (response.data.Error){// if we dont have response for the thing we search will return empty array
      return [];
    }
    return response.data.Search; // if is successful will return the response of datas we search
  }
}
 createAutoComplete({
   ...autocompleteConfig, //we make a copy of the constant autocomplete with all elements
   root: document.querySelector('#left-autocomplete'), //selecting the left div
   onOptionSelect(movie){
     document.querySelector('.tutorial').classList.add('is-hidden'); /* here we select the square which tells Search for the movies on both sides with a tutorial
     class and add a hidden class for hiding that square which is hardcoded in index.html*/
     onMovieSelect(movie, document.querySelector('#left-summary'), 'left'); // we select the movie in the left div created in index.html and declare the side as argument
   },
  });

  createAutoComplete({
    ...autocompleteConfig,//we make a copy of the constant autocomplete with all elements
    root: document.querySelector('#right-autocomplete'),//selecting the right div
    onOptionSelect(movie){
      document.querySelector('.tutorial').classList.add('is-hidden');/* here we select the square which tells Search for the movies on both sides with a tutorial
      class and add a hidden class for hiding that square which is hardcoded in index.html*/
      onMovieSelect(movie, document.querySelector('#right-summary'), 'right');// we select the movie in the right div created in index.html, we declare the side as argument
    },
   });

let leftMovie; //we declare this variable
let rightMovie;//we declare this variable
const onMovieSelect = async (movie, summaryElement, side) => {  //we create this function and tell is a sync function with these parameters needed to fullfill when we call it.
  const response = await axios.get('http://www.omdbapi.com/',{ // we make the ip call to this api
    params: { // we declare the params
      apikey: '12990f4a', // this is an apikey which omdbapi gives us for using this api
      i: movie.imdbID // i: is for searching IMDb
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if(side === 'left'){ // here we ask if the side is left for the datas to be put in the left
    leftMovie = response.data;
  } else { // if is right the datas will be put in the right side.
    rightMovie = response.data;
  }

  if(leftMovie && rightMovie){ //if two sides are filled with re datas of searched movies we will do a comparisson.
    runComparsion();
  }
};

const runComparsion = () =>{
  const leftSideStats = document.querySelectorAll('#left-summary .notification');//selecting the div with the datas
  const rightSideStats = document.querySelectorAll('#right-summary .notification');//selecting the div with the datas

  leftSideStats.forEach((leftStat, index)=>{ // for every data of movie displayed with current index m on the left side
    const rightStat = rightSideStats[index]; // will be equal to the right side datas with the same index.

    const leftSideValue = parseInt(leftStat.dataset.value); //using parseInt to take only numbers of the values
    const rightSideValue = parseInt(rightStat.dataset.value);//using parseInt to take only numbers of the values

    if(leftSideValue > rightSideValue){ //checking if the value of leftSideValue is bigger than the same value of the rightSideValue
      rightStat.classList.remove('is-primary');// if is true we will remove the is-primary class(blue color) and
      rightStat.classList.add('is-warning')  //will add is-warning(red color)
    } else {
      leftStat.classList.remove('is-primary');// if is false we will remove the is-primary class(blue color) and
      leftStat.classList.add('is-warning');//will add is-warning(red color)
    }
  });
};

//all the results are in string so we need to make them as numbers for comparison
const movieTemplate = movieDetail => {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/, ''));// here we remove the $ sign and we remove all commas and make the string a number
  const metascore = parseInt(movieDetail.Metascore);//metascore is only converted in number with parseInt
  const imdbRating = parseFloat(movieDetail.imdbRating);//we use Parsefloat to remove the decimals make a whole number
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, '')); // we remove the commas and make it a number from a string

  let count = 0; //we declared the count to start from 0 // to count the awards of movie
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => { // we used split to make an array of words and numbers
    const value = parseInt(word); /* we take the element of an array and if is string will parseInt
    when we try to parsInt an string the results wil be nAn*/
    if(isNaN(value)){ // if results is Nan than we will return the prev value which will be a number in this case
      return prev;
    } else { // if not Nan but a number will sum prev value and value
      return prev + value;
    }
  }, 0);

//Here in html we set as data-values the variables created above which are converted in numbers for comparissons;
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">imdb Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">imdb Votes</p>
    </article>
  `;
};
