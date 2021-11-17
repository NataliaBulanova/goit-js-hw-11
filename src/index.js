import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const container = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMoreBTN = document.querySelector('.load-more');
const URL = 'https://pixabay.com/api/?key=24354649-5345b0d4fac46ed3dd7873120';
const PER_PAGE = 40;
const PARAMETER = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}`;
let value = '';
let page;
loadMoreBTN.hidden = true;
function fetchImages(value, page) {
  return fetch(`${URL}&q=${value}${PARAMETER}&page=${page}`).then(response => response.json());
}
form.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  container.innerHTML = '';
  page = 1;
  value = form.elements.searchQuery.value;
  if (!value.trim()) {
    Notify.info('Please, write something');
    return;
  }
  fetchImages(value, page)
    .then(images => {
      if (!images.totalHits) {
        Notify.failure('Sorry, no matches were found for your query.');
        return;
      }
      Notify.success(`Hooray! We found ${images.totalHits} images.`);
      createMarkup(images);
      loadMoreBTN.hidden = false;
    })
    .catch(error => error);
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
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="360px" />
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
</div></a>`;
    })
    .join('');
  container.insertAdjacentHTML('beforeend', imagesMarkup);
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 300,
  });
  lightbox.refresh();

  if (page === pageLimit) {
    setTimeout(() => {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }, 1000);
    loadMoreBTN.hidden = true;
  }
}

container.addEventListener('click', e => {
  e.preventDefault();
});
