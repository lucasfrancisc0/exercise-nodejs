const { Router } = require("express")
const usersRoutes= require("./users.routes")
const movieRoutes = require("./movie_notes.routes")
const sessionsRoutes = require("./sessions.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/movies", movieRoutes)
routes.use("/sessions", sessionsRoutes)

module.exports = routes