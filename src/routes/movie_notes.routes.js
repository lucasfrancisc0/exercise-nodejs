const { Router } = require("express")
const MovieNotesController = require("../Controllers/MovieNotesController")

const movieRoutes = Router()
const moviesNotesController = new MovieNotesController()

movieRoutes.post("/:user_id", moviesNotesController.create)
movieRoutes.delete("/:movie_id", moviesNotesController.delete)
movieRoutes.put("/:movie_id", moviesNotesController.update)
movieRoutes.get("/:user_id", moviesNotesController.index)


module.exports = movieRoutes