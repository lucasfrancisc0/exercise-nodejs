const { Router } = require("express")
const UsersController = require("../Controllers/UsersController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const userRoutes = Router()
const usersController = new UsersController()

userRoutes.post("/", usersController.create)
userRoutes.put("/", ensureAuthenticated, usersController.update)
userRoutes.delete("/", ensureAuthenticated, usersController.delete)
userRoutes.get("/", ensureAuthenticated, usersController.index)



module.exports = userRoutes