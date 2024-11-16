export const createGalerryCard = image => {
    return `
        <a href="${image.largeImageURL}">
            <div class="gallery-item">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info">
                    <p>Likes: ${image.likes}</p>
                    <p>Views: ${image.views}</p>
                    <p>Comments: ${image.comments}</p>
                    <p>Downloads: ${image.downloads}</p>
                </div>
            </div>
        </a>`;
};
