const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    const toughtsData = await Tought.findAll({ include: User });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    console.log(toughts);
    res.render("toughts/home", { toughts });
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
      res.redirect("/login");
    }
    dashboard;

    const toughts = user.Toughts.map((result) => result.dataValues);

    console.log(toughts);

    res.render("toughts/dashboard", { toughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }
  static async teste(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    console.log(user);
    // Just checking if exists
    if (!user) {
      return res.json({ data: { status: "user not authorizs" } });
    }
    // dashboard;

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
        res.redirect("/toughts/dashboard");
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
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("deu err" + err);
    }
  }

  static async editTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    res.render("toughts/edit", { tought });
  }

  static async editToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Tought Updated");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Error" + err);
    }
  }
};
