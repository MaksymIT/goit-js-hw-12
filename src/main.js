import axios from 'axios';

// import functions
import { createGalerryCard } from "./js/render-functions";
import { fetchPhotos } from "./js/pixabay-api";

// find HTML elements
const searchForm = document.querySelector('.search-container');
const galerryEl = document.querySelector(".galerry-js");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

// Описаний у документації
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox(".galerry-js a", {
  captionsData: "alt",
  captionDelay: 250,
});

// Глобальні змінні для пагінації
let page = 1;
let userInput = '';

// Функція для приховування індикатора завантаження
function hideLoader() {
    loader.classList.add("hidden");
}

// Функція для показу індикатора завантаження
function showLoader() {
    loader.classList.remove("hidden");
}

// Функція для показу та приховування кнопки "Load more"
function showLoadMoreBtn() {
    loadMoreBtn.classList.remove("hidden");
}

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add("hidden");
}

// Основна функція обробки форми
const clickForm = async (event) => {
  event.preventDefault();

  userInput = searchForm.elements.user_query.value.trim();
  page = 1;

  if (!userInput) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search query.",
    });
    return;
  }

  galerryEl.innerHTML = "";
  hideLoadMoreBtn();
  showLoader();

  try {
    await loadImages();
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "An error occurred while fetching images. Please try again later.",
    });
    console.error(error);
  } finally {
    hideLoader();
  }
};

// Функція для завантаження зображень
const loadImages = async () => {
  try {
    const data = await fetchPhotos(userInput, page);

    if (data.hits.length === 0) {
      iziToast.error({
        title: "Error",
        message: "Sorry, there are no images matching your search query. Please try again!",
      });
      hideLoadMoreBtn();
      return;
    }

    const galerryCardTemplate = data.hits.map(img => createGalerryCard(img)).join('');
    galerryEl.insertAdjacentHTML('beforeend', galerryCardTemplate);
    lightbox.refresh();

    const totalPages = Math.ceil(data.totalHits / 15);
    if (page >= totalPages) {
      iziToast.info({
        title: "Info",
        message: "We're sorry, but you've reached the end of search results.",
      });
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }

    smoothScroll();
    page += 1;
  } catch (error) {
    console.error(error);
  }
};

// Функція для обробки кнопки "Load more"
const handleLoadMore = async () => {
  showLoader();
  hideLoadMoreBtn();
  await loadImages();
  hideLoader();
};

// Функція для плавного прокручування
const smoothScroll = () => {
  const { height: cardHeight } = galerryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
};

searchForm.addEventListener('submit', clickForm);
loadMoreBtn.addEventListener('click', handleLoadMore);
