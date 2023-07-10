const AppErrors = require("../Utils/AppErrors")
const { hash, compare } = require("bcryptjs")
const knex = require("../database/knex")

class UsersController{
  async create(request, response){
    const { name, email, password } = request.body
    
    const checkEmailExists =  await knex("users").select("email").where({ email }).first()

    if(checkEmailExists) {
      throw new AppErrors("Este email já está cadastrado")
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({ name, email, password: hashedPassword })

    return response.status(201).json({
      status: "sucessful",
      message: "Usuário cadastrado com sucesso"
    })
  }

  async update(request, response){
    const { name, email, password, old_password } = request.body
    const { user_id } = request.params

    const user = await knex("users").select("*").where({ id: user_id }).first()

    if(!user){
      throw new AppErrors("Usuário não encontrado")
    }

    const checkUserEmail  = await knex("users").select("email", "id").where({ email }).first()

    if(checkUserEmail && checkUserEmail.id !== user.id){
      throw new AppErrors("Este email já está sendo utilizado por outro usuário.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password){
      throw new AppErrors("Necessário informar senha atual para prosseguir com a alteração da senha.")
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)
      console.log(checkOldPassword)

      if(!checkOldPassword){
        throw new AppErrors("Senha incorreta.")
      }

      user.password = await hash(password, 8)
    }

    await knex("users").update({
      name: user.name,
      email: user.email,
      password: user.password
    })



    return response.json({
      message: "Alteração realizada com sucesso."
    })
  }

  async delete(request, response){
    const { user_id } = request.params

    const checkuserExists = await knex("users").select("id").where({ id: user_id}).first()
    
    if(!checkuserExists){
      throw new AppErrors("Não pode ser excluido. Este usuário não existe.")
    }

    await knex("users").delete().where({ id: user_id})

    return response.json({
      message: "Usuário deletado com sucesso."
    })
  }

  async index(request, response){
    const { user_id } = request.params
    const { name, email } = request.query

    let user = await knex("users").select("name", "email", "avatar").where({ id: user_id }).first()

    if(name) {
      const searchUserName = await knex("users").select("id", "name")
      .whereLike("name", `%${name}%`).first()

      user = searchUserName ?? "Usuário não encontrado"
    }

    if(email){
      const searchUserEmail = await knex("users").select("id", "email")
      .where({ email }).first()

      user = searchUserEmail ?? "Usuário não encontrado"
    }


    if(!user){
      throw new AppErrors("Usuário não encontrado")
    }


    return response.json(user)

  }
}

module.exports = UsersController