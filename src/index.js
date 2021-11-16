import './css/styles.css';
const container = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const URL = 'https://pixabay.com/api/?key=24354649-5345b0d4fac46ed3dd7873120';
function fetchImages(value) {
  return fetch(`${URL}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true`).then(
    response => response.json(),
  );
}
form.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  const value = form[0].value;
  fetchImages(value)
    .then(images => {
      // console.log(images.hits);
      createMarkup(images);
    })
    .catch(error => error);
}

function createMarkup({ hits }) {
  const imagesMarkup = hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
  console.log(container);
  console.log(imagesMarkup);
  container.innerHTML = imagesMarkup;
}
