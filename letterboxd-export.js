// Your Letterboxd username should be but here
// letterboxd-export.js
// Your Letterboxd username should be but here
const LETTERBOXD_USERNAME1 = process.argv[2];
const LETTERBOXD_USERNAME2 = process.argv[3];
// ... rest of the code

// Set this to true if you are already up to date, but want to prepare your local cache for future use.
// When a movie is rated on Taste, your local cache will be changed to true for that movie
// Set the value to null if it should be unchanged on update
const TASTE_DEFAULT_STATUS = null;

const fs = require("fs");
const PromiseCrawler = require("promise-crawler");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter1 = new FileSync("movies1.json");
const db1 = low(adapter1);

db1.defaults({ movies: [] }).write();

const adapter2 = new FileSync("movies2.json");
const db2 = low(adapter2);

db2.defaults({ movies: [] }).write();

const crawler = new PromiseCrawler({
  maxConnections: 10,
  retries: 3
});

const LETTERBOXD_FILMS_BASE1 = `https://letterboxd.com/${LETTERBOXD_USERNAME1}/films/`;
const LETTERBOXD_FILMS_BASE2 = `https://letterboxd.com/${LETTERBOXD_USERNAME2}/films/`;

let LETTERBOXD_MAX_PAGES = 0;

const movies1 = db1.get("movies");
const movies2 = db2.get("movies");
const getLetterboxdPage1 = ({ page }) =>
  crawler.request({
    url: `${LETTERBOXD_FILMS_BASE1}${page > 1 ? `page/${page}/` : ""}`
  });

const getLetterboxdPage2 = ({ page }) =>
  crawler.request({
    url: `${LETTERBOXD_FILMS_BASE2}${page > 1 ? `page/${page}/` : ""}`
  });

const handleLetterBoxdResponse = ({ $ }) => {
  if (!LETTERBOXD_MAX_PAGES) {
    LETTERBOXD_MAX_PAGES = parseInt(
      $(".paginate-page:last-child")
        .text()
        .trim()
    );
  }

  $(".poster-list > li").each((i, el) => {
    const $li = $(el);
    const $img = $("img.image", $li);
    const $poster = $(".film-poster", $li);
    const $ratingEl= $(".poster-viewingdata > .rating", $li);

    const letterboxdId = parseInt($poster.data("filmId"));

    let letterboxdRating = 0;
    if($ratingEl.prop('name') !== undefined){
        const ratingStr = $ratingEl.attr('class')
        letterboxdRating = parseInt(ratingStr.substring(ratingStr.lastIndexOf('-') + 1));
    }
    const title = $img.attr("alt");
    const found = movies.find({ letterboxdId }).value();

    if (found) {
      const updatedObj = {
        letterboxdRating
      };

      if (TASTE_DEFAULT_STATUS !== null) {
        updatedObj.tasteStatus = !!TASTE_DEFAULT_STATUS;
      }

      movies
        .find({ letterboxdId })
        .assign(updatedObj)
        .write();
    } else {
      movies
        .push({
          letterboxdId,
          title,
          letterboxdRating,
          tasteStatus:
            TASTE_DEFAULT_STATUS === null ? false : TASTE_DEFAULT_STATUS
        })
        .write();
    }

    console.log(title, found ? "UPDATED" : "ADDED");
  });
};

(async () => {
  await crawler.setup();

  const res1 = await getLetterboxdPage1({ page: 1 });
  handleLetterBoxdResponse(res1);

  const res2 = await getLetterboxdPage2({ page: 1 });
  handleLetterBoxdResponse(res2);

  // ... rest of the code
function handleLetterBoxdResponse1(response) {
  // Function body goes here
}
  let pages = [];

  if (LETTERBOXD_MAX_PAGES > 1) {
    for (let i = 0; i < LETTERBOXD_MAX_PAGES - 1; i++) {
      pages.push(i + 2);
    }
  }

  const responses = await Promise.all(
    pages.map(pg => getLetterboxdPage({ page: pg }))
  );

  responses.forEach(handleLetterBoxdResponse);

  process.nextTick(() => crawler.destroy());
})();
