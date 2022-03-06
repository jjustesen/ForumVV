const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "heroku_17f499b428bb0bf",
  "b72d4ba44bc750",
  "395797f9",
  {
    host: "us-cdbr-east-05.cleardb.net",
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("Conectamos");
} catch (err) {
  console.log(`Nao foi possivel ${err}`);
}

module.exports = sequelize;
