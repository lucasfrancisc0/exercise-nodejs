const { Router } = require("express")
const UsersController = require("../Controllers/UsersController")

const userRoutes = Router()
const usersController = new UsersController()

userRoutes.post("/", usersController.create)
userRoutes.put("/:user_id", usersController.update)
userRoutes.delete("/:user_id", usersController.delete)
userRoutes.get("/:user_id", usersController.index)



module.exports = userRoutes