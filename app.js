const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

const durationInput = document.getElementById('duration');
const searchInput = document.getElementById('search');
const errorBlock = document.getElementById('error-message');

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.length != 0) {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
  else {
    showError("No Matching Result Found.")
  }
  toggleSpinner();    // spinner end
}

const getImages = (query) => {
  // loading spinner
  toggleSpinner();

  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    // .then(data => showImages(data.hitS))
    .then(data => showImages(data.hits))
    .catch(err => {
      console.log(err);
      toggleSpinner();    // spinner end
    })
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');  //toggle image

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);        // add border 
  }
  else {
    sliders.splice(item, 1);  // remove border
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = durationInput.value || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  imagesArea.style.display = 'none';            // remove previous results
  errorBlock.classList.add('d-none');           // remove previous error

  clearInterval(timer);

  if (searchInput.value != '') {
    getImages(searchInput.value)
    sliders.length = 0;
  }
  else {                                         // for empty search
    showError('Write Something to Search');
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// removing negative time inputs
durationInput.addEventListener('keyup', function (event) {
  if (event.key == '-' || parseFloat(durationInput.value) < 0) {
    durationInput.value = '';
  }
});

// search on Enter
searchInput.addEventListener('keydown', function (event) {
  if (event.key == 'Enter') {
    // event.preventDefault();
    searchBtn.click();
  }
});

const showError = errorMsg => {
  errorBlock.innerHTML = `<h2>${errorMsg}</h2>`;
  errorBlock.classList.remove('d-none');
}

const toggleSpinner = () => {
  const spinnerBlock = document.getElementById('loading-spinner');
  spinnerBlock.classList.toggle('d-none');
  console.log("toggle", spinnerBlock.classList);
}