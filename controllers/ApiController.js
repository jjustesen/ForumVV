const Tought = require("../models/Tought");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class ApiController {
  static async showToughts(req, res) {
    const toughtsData = await Tought.findAll({ include: User });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    return res.json({ data: { status: "success", toughts } });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    // Just checking if exists
    if (!user) {
      return res.json({ data: { status: "Error" } });
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    return res.json({ data: { status: "success", toughts } });
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Tought created");

      req.session.save(() => {
        return res.json({ data: { status: "success", tought } });
      });
    } catch (err) {
      console.log("Erro: " + err);
    }
  }

  static async deleteTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Tought Deleted");
      req.session.save(() => {
        return res.json({ data: { status: "success", response: "deleted" } });
      });
    } catch (err) {
      console.log("deu err" + err);
    }
  }

  static async editTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    return res.json({ data: { status: "success", tought } });
  }

  static async editToughtSave(req, res) {
    const id = req.params.id;

    const tought = {
      title: req.body.title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Tought Updated");
      req.session.save(() => {
        return res.json({ data: { status: "success", tought } });
      });
    } catch (err) {
      console.log("Error" + err);
    }
  }
  //Login

  static async loginPost(req, res) {
    const { email, password } = req.body;

    // User exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ data: { status: "Error" } });
    }
    // Password valid
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Invalid password");
      return res.status(400).json({ data: { status: "Error" } });
    }
    req.session.userid = user.id;
    req.flash("message", "success");
    req.session.save(() => {
      return res.status(200).json({ data: { status: "Success", user } });
    });
  }

  static async registerPost(req, res) {
    const { name, email, password, password_confirm } = req.body;

    // Password match
    if (password != password_confirm) {
      req.flash("message", "Password dont match");
      res.render("auth/register");
      return;
    }

    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      req.flash("message", "User already exists");
      res.render("auth/register");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };
    try {
      const createdUser = await User.create(user);

      // Auto login
      req.session.userid = createdUser.id;

      req.flash("message", "Cadastro realizado");
      console.log(req.session.userid);
      req.session.save(() => {
        return res.json({ data: { status: "success", user } });
      });
    } catch (err) {
      console.log(err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    return res.json({
      data: { status: "success", message: "User disconected" },
    });
  }
};
