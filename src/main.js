import { getImagesByQuery } from "./js/pixabay-api.js";
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    query = e.target.elements["search-text"].value.trim();

    if (!query) {
        iziToast.warning({
            title: "Oops!",
            message: "Please enter a search term!",
            position: "topRight",
        });
        return;
    }

    page = 1;
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(query, page);
        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            iziToast.info({
                title: "No results",
                message:
                    "Sorry, there are no images matching your search query. Please try again!",
                position: "topRight",
            });
            return;
        }

        createGallery(data.hits);
        if (data.totalHits > 15) showLoadMoreButton();
    } catch (error) {
        iziToast.error({
            title: "Error",
            message: "Something went wrong. Please try again later.",
            position: "topRight",
        });
    } finally {
        hideLoader();
    }
});

loadMoreBtn.addEventListener("click", async () => {
    page += 1;
    showLoader();

    try {
        const data = await getImagesByQuery(query, page);
        createGallery(data.hits);

        const totalPages = Math.ceil(totalHits / 15);
        if (page >= totalPages) {
            hideLoadMoreButton();
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "bottomRight",
            });
        }

        // плавний скрол
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    } catch (error) {
        iziToast.error({
            title: "Error",
            message: "Something went wrong while loading more images.",
            position: "topRight",
        });
    } finally {
        hideLoader();
    }
});
