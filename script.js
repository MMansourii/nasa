const resultsNav  = document.getElementById('resultsNav');
const favoritesNav  = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const savedConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorite={};

// Hsow content
function showContent(page){
    window.scrollTo({top:0, behavior:'instant'});
    loader.classList.add('hidden');
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
      } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
      }
}

// Create DOM nodes
function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorite);
    currentArray.forEach(result =>{
        // card container
        const card=document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title='View fullscreen';
        link.target = '_blank';
        // Images
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = result.url ; 
        image.alt = 'Nasa picture of the day';
        image.loading = 'lazy';
        // Card for body
        const bodyCard = document.createElement('div');
        bodyCard.classList.add('card-body');
        // card title
        const cardTitle = document.createElement('p');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Add to favorite
        const saveCard = document.createElement('h5');
        saveCard.classList.add('clickable');
        if(page === 'results'){
            saveCard.textContent = 'Add to Favorite';
            saveCard.setAttribute('onclick',`saveFavorites('${result.url}')`);
        }else{
            saveCard.textContent = 'Remove Favorite';
            saveCard.setAttribute('onclick',`removeFavorites('${result.url}')`);
        }

        // Card description
        const cardDescription = document.createElement('p');
        cardDescription.textContent = result.explanation;
        // Footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // CopyRight
        const copyright = document.createElement('span');
        copyright.textContent = `  ${result.copyright ? result.copyright : 'Unknown'}`;

        // Append
        link.append(image);
        footer.append(date,copyright)
        bodyCard.append(cardTitle,saveCard,cardDescription,footer);
        card.append(link,bodyCard);
        imagesContainer.appendChild(card);
    });
}

// Update elemnts
function updateDOM(page){
    if(localStorage.getItem('NASA favorites')){
        favorite = JSON.parse(localStorage.getItem('NASA favorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

async function getNASAPictures(){
    loader.classList.remove('hidden');
    try{
        const response = await fetch(apiUrl);
        resultsArray =  await response.json();
        console.log(resultsArray);
        updateDOM('results');
    }catch(error){
        // catch error here
    }
}
// Save Favorite
function saveFavorites(url){
    resultsArray.forEach(item =>{
        if(item.url.includes(url) && !favorite[url]){
            favorite[url] = item;
            // Show Confiramation  for 2 sec
            savedConfirmed.hidden = false ; 
            setTimeout(() => {
                savedConfirmed.hidden = true ; 
            }, 2000);
        }
        // Set favorites to Local storage
        localStorage.setItem('NASA favorites',JSON.stringify(favorite));
    });
}
// Remove favorites
function removeFavorites(url){
    if(favorite[url]){
        delete favorite[url];
        // Set favorites to Local storage
        localStorage.setItem('NASA favorites',JSON.stringify(favorite));
        updateDOM('favorites');
    }
}

//On load
getNASAPictures();
