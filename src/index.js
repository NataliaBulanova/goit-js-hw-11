import './css/styles.css';
import axios from 'axios';
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

async function fetchImages(value, page) {
  const response = await axios.get(`${URL}&q=${value}${PARAMETER}&page=${page}`);
  const images = await response.data;
  return images;
}
form.addEventListener('submit', onSubmit);
async function onSubmit(e) {
  e.preventDefault();
  container.innerHTML = '';
  page = 1;
  value = form.elements.searchQuery.value;
  if (!value.trim()) {
    loadMoreBTN.hidden = true;
    Notify.info('Please, write something');
    return;
  }
  try {
    const { hits, totalHits } = await fetchImages(value, page);
    if (!totalHits) {
      loadMoreBTN.hidden = true;
      Notify.failure('Sorry, no matches were found for your query.');
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    createMarkup({ hits, totalHits });
    loadMoreBTN.hidden = false;
  } catch (error) {
    console.log(error.message);
  }
  // fetchImages(value, page)
  //   .then(images => {
  //     if (!images.totalHits) {
  //       Notify.failure('Sorry, no matches were found for your query.');
  //       return;
  //     }
  //     Notify.success(`Hooray! We found ${images.totalHits} images.`);
  //     createMarkup(images);
  //     loadMoreBTN.hidden = false;
  //   })
  //   .catch(error => error);
}

loadMoreBTN.addEventListener('click', onBtnClick);
async function onBtnClick() {
  page += 1;
  console.log(page);
  try {
    const images = await fetchImages(value, page);
    createMarkup(images);
  } catch (error) {
    console.log(error.message);
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  console.log({ height: cardHeight });
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  // fetchImages(value, page)
  //   .then(images => {
  //     createMarkup(images);
  //   })
  //   .catch(error => error);
}

function createMarkup({ hits, totalHits }) {
  const pageLimit = Math.ceil(totalHits / hits.length);
  const imagesMarkup = hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="360px" height="240px" />
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
  if (page === pageLimit) {
    setTimeout(() => {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBTN.hidden = true;
    }, 0);
  }
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 300,
  });
  lightbox.refresh();
}

container.addEventListener('click', e => {
  e.preventDefault();
});
