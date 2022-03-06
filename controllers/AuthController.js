const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }
  static async loginPost(req, res) {
    const { email, password } = req.body;

    // User exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "User doenst exists");
      res.render("auth/login");
    }
    // Password valid
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Invalid password");
      res.render("auth/login");
      return;
    }
    req.session.userid = user.id;
    req.flash("message", "success");
    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
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
        res.redirect("/");
      });
    } catch (err) {
      console.log(err);
    }
  }
  static logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
};
