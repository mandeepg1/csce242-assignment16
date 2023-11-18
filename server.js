const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let games = [
  {
    _id: 1,
    name: "God of War",
    platform: ["PS4", "PS5", "XBOX One", "PC", "Steam"],
    publisher: "Sony Interactive Entertainment",
    description:
      "God of War (2018) is a critically acclaimed action-adventure video game that follows Kratos, a former Greek god, and his son Atreus as they embark on a deeply emotional journey through the realms of Norse mythology, featuring stunning visuals, intense combat, and a compelling father-son narrative.",
    img: "images/god-of-war.jpg",
    add_info: ["Released in 2018", "Game of the Year"],
  },
  {
    _id: 2,
    name: "Spider-Man 2",
    platform: ["PS4", "PS5", "XBOX One", "PC", "Steam"],
    publisher: "Sony Interactive Entertainment",
    description: "The console version of Spider-Man 2 is a third-person action-adventure video game, set in an open world based on New York City and composed of Manhattan, Roosevelt Island, Ellis Island, and Liberty Island. Players take on the role of Spider-Man and complete missions—linear scenarios with set objectives—to progress through the story.",
    img: "images/spider-man.jpg",
    add_info: ["Released in 2018"],
  },
  {
    _id: 3,
    name: "Madden 24",
    platform: ["PS4", "PS5", "XBOX One", "PC", "Steam"],
    publisher: "EA Sports",
    description:"Madden NFL 24 is an American football video game developed by EA Tiburon and published by EA Sports. Based on the National Football League (NFL), it is an installment in the Madden NFL series and follows Madden NFL 23. Buffalo Bills quarterback Josh Allen is the cover athlete for the game.",
    img: "images/madden-24.jpg",
    add_info: ["Released in 2018"],
  },
  {
    _id: 4,
    name: "Overwatch 2",
    platform: ["PS4", "PS5", "XBOX One", "PC", "Steam"],
    publisher: "Blizzard Entertainment",
    description:"Overwatch 2 is a 2022 first-person shooter game developed and published by Blizzard Entertainment. As a sequel and replacement to the 2016 hero shooter Overwatch, the game intends a shared environment for player-versus-player (PvP) modes while initially having plans for introducing persistent cooperative modes, though the plans were later scrapped in 2023, focusing the game on its PvP elements.",
    img: "images/ow2.jpg",
    add_info: ["Released in 2018"],
  },
  {
    _id: 5,
    name: "Call of Duty: Modern Warfare 2019",
    platform: ["PS4", "PS5", "XBOX One", "PC", "Steam"],
    publisher: "Activision",
    description: "Call of Duty: Modern Warfare is a 2019 first-person shooter video game developed by Infinity Ward and published by Activision. Serving as the sixteenth overall installment in the Call of Duty series, as well as a reboot of the Modern Warfare sub-series, it was released on October 25, 2019, for PlayStation 4, Windows, and Xbox One.",
    img: "images/mw2019.jpg",
    add_info: ["Released in 2018"],
  },
  {
    _id: 6,
    name: "Starcraft 2",
    platform: ["BattleNet", "PC", "Steam"],
    publisher: "Blizzard Entertainment",
    description: "StarCraft II is a military science fiction video game created by Blizzard Entertainment as a sequel to the successful StarCraft video game released in 1998. Set in a fictional future, the game centers on a galactic struggle for dominance among the various fictional races of StarCraft.",
    img: "images/starcraft2.jpg",
    add_info: ["Released in 2018"],
  },
];

app.get("/api/games", (req, res) => {
  res.send(games);
});

app.listen(3000, () => {
  console.log("listening");
});

const validateThings = (game) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    platform: Joi.allow(""),
    publisher: Joi.allow(""),
    name: Joi.string().min(1).required(),
    description: Joi.string().min(3).required(),
    add_info: Joi.allow("")
  });
  return schema.validate(game);
};

app.delete("/api/games/:id", (req, res) => {
    const id = parseInt(req.params.id);
  
    const game = games.find((g) => g._id === id);
  
    if (!game) {
      res.status(404).send("The game was not found");
      return;
    }
  
    const index = games.indexOf(game);
    games.splice(index, 1);
    res.send(game);
  });

app.post("/api/games", upload.single("img"), (req, res) => {
  console.log("in post");
  const result = validateThings(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  if (req.file) {
    game.img = "images/" + req.file.filename;
  }

  console.log(req.body);
  const game = {
    _id: games.length + 1,
    name: req.body.name,
    description: req.body.description,
    platform: req.body.platform,
    publisher: req.body.publisher,
    img: req.body.img,
    add_info: req.body.add_info
  };

  games.push(game);

  res.send(game);
});

app.put("/api/games/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const game = games.find((g) => g._id === id);

    const result = validateThings(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    game.name = req.body.name;
    game.description = req.body.description;
    game.platform = req.body.platform;
    game.publisher = req.body.publisher;
    game.add_info = req.body.add_info;

    if (req.file) {
        game.img = "images/" + req.file.filename;
    }

    res.send(game);
});


