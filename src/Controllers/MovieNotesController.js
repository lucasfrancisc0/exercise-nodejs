const AppErrors = require("../Utils/AppErrors")
const knex = require("../database/knex")

class MovieNotesController {
  async create(request, response){
    const { title, description, rating, tags } = request.body
    const user_id  = request.user.id

    const user = await knex("users").select("id").where({ id: user_id}).first()
    if(!user){
      throw new AppErrors("Usuário não encontrado no sistema.")
    }

    if(!title){
      throw new AppErrors("O título do filme é obrigatório.")
    }

    const userMovieIsAlreadyUse = await knex("movie_notes").select("title").where({ user_id })

    const checkMovieTitles = userMovieIsAlreadyUse.filter( movie => movie.title === title)
    
    if(checkMovieTitles.length > 0){
      throw new AppErrors("Este filme já foi cadastrado pelo usuário, exclua o título ou altere para prosseguir.")
    }

    const [movie_id] = await knex("movie_notes").insert({ title, description, rating, user_id })

    if(tags){

      const tagsInsert = tags.map( name => {
        return{
          name, 
          user_id,
          movie_id
        }
      })

      await knex("movie_tags").insert(tagsInsert)
    }


    return response.json({
      message: `O filme ${title} foi cadastrado com sucesso.`
    })
    
  }

  async delete(request, response){
    const { movie_id } = request.params

    const movie = await knex("movie_notes").select("id", "title").where({ id: movie_id }).first()

    if(!movie){
      throw new AppErrors("Filme não encontrado")
    }

    await knex("movie_notes").delete().where({ id: movie_id })

    return response.json({
      message: `O filme ${movie.title} foi excluído com sucesso.`
    })
  }

  async update(request, response){
    const { title, description, rating, tags} = request.body
    const { movie_id } = request.params

    const movie = await knex("movie_notes").select("*").where({ id: movie_id }).first()

    if(!movie){
      throw new AppErrors("Filme não encontrado!")
    }

    movie.title = title ?? movie.title
    movie.description = description ?? movie.description
    movie.rating = rating ?? movie.rating
    
    await knex("movie_notes").update({
      title: movie.title,
      description: movie.description,
      rating: movie.rating
    })

    return response.json({
      message: "Filme alterado com sucesso"
    })
  }

  async index(request, response){
    const { title, tags, movie_id } = request.query
    const  user_id  = request.user.id

    let movie

    if(title){
      const searchMovieTitle = await knex("movie_notes")
        .select("*")
        .where({ user_id })
        .whereLike("title", `%${title}%`)

      movie = searchMovieTitle ?? "Não existem filmes cadastrados com este título"
    }

    if(tags){
      const filterTags = tags.split(",").map( tag => tag.trim())

      const searchMovieTags = await knex("movie_tags").select([
        "movie_notes.title",
        "movie_notes.description",
        "movie_notes.rating"
      ])
      .where("movie_notes.user_id", user_id)
      .whereIn("movie_tags.name", filterTags)
      .innerJoin("movie_notes", "movie_notes.id", "movie_tags.movie_id")
      .orderBy("title")


        movie = searchMovieTags ?? "Não existem filmes com as tags cadastradas"
    }

    if(movie_id){
      const searchMovieId = await knex("movie_notes").select("id", "title", "description", "rating")
      .where({ id : movie_id }).first()

      movie = searchMovieId ?? "Não existem filmes cadastrados com este título."
    }

    return response.json(movie)
  }

}

module.exports = MovieNotesController

