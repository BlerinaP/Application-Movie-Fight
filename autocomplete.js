 createAutoComplete = ({ //Here we declare the arguments needed.These functions are defined in index.js
   root,
   renderOption,
   onOptionSelect,
   inputValue,
   fetchData
 }) => {
   //Here is a part of html nedded for the menu with innerHTMl we declare where this
   //html gonna be renderd
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
     <div class="dropdown-menu">
       <div class="dropdown-content results"></div>
     </div>
    </div>
  `;
 //here we select the forms input,dropwdown,and dropdown content
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');


  const onInput = async event => {
      const items = await fetchData(event.target.value); // here event.target.value is actually the argument for the parameter search term(event.target.value means the name of the movie we write);

 //if we dont have any results from the search we made the dropdown menu will remove the class is-active
      if(!items.length){
        dropdown.classList.remove('is-active');
        return;
      }


      resultsWrapper.innerHTML = '';
      dropdown.classList.add('is-active');
      for(let item of items){// for every movie we search of array of movies
        const option = document.createElement('a'); //create an anchor tag for the movies

        option.classList.add('dropdown-item');//add this class from bulma to mak e a dropdown list for movies
        option.innerHTML = renderOption(item); // here we call the renderOption function which is in index.js with the item we want to render information for.

        option.addEventListener('click', () => { //when we click on the selected movie
          dropdown.classList.remove('is-active');//we remove the class is-active from dropdown
          input.value = inputValue(item); //and we call this function from index.js which will put the correct name of the movie on the input field after we click on it: ex: avengers => The Avengers
          onOptionSelect(item); //we call this function from index.js with the wanted item in this case with the movie
        });

      resultsWrapper.appendChild(option);// all these infos of option variable will be in the div as a child
    }
  };

  input.addEventListener('input', debounce(onInput, 200));// when we write on input with the debounce functions the results will be after 2 sec.

  document.addEventListener('click', event => { //here we add an event listener so if we click somewhere in the page
    // when the root doesn't contain that target (is not input,dropdow-menu)
    if(!root.contains(event.target)){
      dropdown.classList.remove('is-active'); // we remove the class is-active so the dropdown-menu will close
    }
  });

};
