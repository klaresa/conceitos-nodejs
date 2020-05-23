const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function idValidation(req, res, next){
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json( {error: 'Invalid ID'} );
  }

  return next();
}

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(), title, url, techs, likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", idValidation, (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  const repoLikes = repositories.find(repo => repo.id === id);

  let repository = {
    id, title, url, techs, likes: repoLikes.likes
  };

  repositories[repositoryIndex] = repository;
  return response.json(repository)

});

app.delete("/repositories/:id", idValidation, (request, response) => {
  const { id } = request.query;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", idValidation, (request, response) => {

  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id);

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
