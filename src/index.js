import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const container = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMoreBTN = document.querySelector('.load-more');
const URL = 'https://pixabay.com/api/?key=24354649-5345b0d4fac46ed3dd7873120';
const PER_PAGE = 200;
const PARAMETER = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}`;
let value = '';
let page;
let pagesAmount = Math.floor(500 / PER_PAGE);
console.log(pagesAmount);
loadMoreBTN.hidden = true;
function fetchImages(value, page) {
  return fetch(`${URL}&q=${value}${PARAMETER}&page=${page}`).then(response => response.json());
}
form.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  container.innerHTML = '';
  page = 1;
  // console.log(form.elements);
  value = form.elements.searchQuery.value;
  fetchImages(value, page)
    .then(images => {
      // console.log(images.totalHits);
      createMarkup(images);
    })
    .catch(error => error);
  loadMoreBTN.hidden = false;
}

loadMoreBTN.addEventListener('click', onBtnClick);
function onBtnClick() {
  page += 1;
  console.log(page);
  fetchImages(value, page)
    .then(images => {
      createMarkup(images);
    })
    .catch(error => error);
}

function createMarkup({ hits, totalHits }) {
  const pageLimit = Math.ceil(totalHits / hits.length);
  const imagesMarkup = hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="200px" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  container.insertAdjacentHTML('beforeend', imagesMarkup);
  if (page === pageLimit) {
    setTimeout(() => {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }, 1000);
    loadMoreBTN.hidden = true;
  }
}
