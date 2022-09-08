const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  app.get("/api/pokemons", auth, (req, res) => {
    if (req.query.name) {
      if (req.query.name.length > 1) {
        const name = req.query.name;
        const limit = parseInt(req.query.limit) || 5;
        return Pokemon.findAndCountAll({
          where: {
            name: {
              //'name' est la propriété du modèle pokémon
              [Op.like]: `%${name}%`, //'name' est le critère de la recherche
            },
          },
          order: ["name"],
          limit: limit,
        }).then(({ count, rows }) => {
          const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`;
          res.json({ message, data: rows });
        });
      } else {
        const message =
          "Veuillez saisir au moins 2 caractères pour votre recherche.";
        return res.status(400).json({ message });
      }
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((error) => {
          const message =
            "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instant.";
          res.status(500).json({ message, data: error });
        });
    }
  });
};
