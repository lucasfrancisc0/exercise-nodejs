const { Router } = require("express")
const MovieNotesController = require("../Controllers/MovieNotesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const movieRoutes = Router()
const moviesNotesController = new MovieNotesController()

movieRoutes.use(ensureAuthenticated)

movieRoutes.post("/", moviesNotesController.create)
movieRoutes.delete("/:movie_id", moviesNotesController.delete)
movieRoutes.put("/:movie_id", moviesNotesController.update)
movieRoutes.get("/", moviesNotesController.index)


module.exports = movieRoutes