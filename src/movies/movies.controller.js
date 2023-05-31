const asyncErrorBoundary = require("../utils/errors/asyncErrorBoundary");
const service = require("./movies.service");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found."});
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function theatersWithMovie(req, res) {
  const data = await service.theatersPlayingMovie(res.locals.movie.movie_id);
  res.json({ data });
}

async function reviewsByMovie(req, res) {
  const data = await service.readReviewsAndCritics(res.locals.movie.movie_id);
  res.json({ data });
}

async function list(req, res) {
    if (req.query.is_showing === 'true') {
      const data = await service.moviesShowing();
      res.json({ data });
    } else if (req.query.is_showing === 'false') {
      const data = await service.moviesNotShowing();
      res.json({ data });
    }
    const data = await service.list();
    res.json({ data });
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  theatersWithMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theatersWithMovie)],
  reviewsByMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(reviewsByMovie)],
}


