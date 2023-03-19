const accountModel = require("../models/account.model");
const imageModel = require("../models/image.model");
const fs = require("fs");

const accountController = {
  async getAll(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const skip = limit * (page - 1);
      const accounts = await accountModel.find({}).skip(skip).limit(limit);
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const price = req.body.price;

      if (!title) {
        return res.status(404).json({ message: "Please enter title account" });
      }
      if (!description) {
        return res
          .status(404)
          .json({ message: "Please enter description account" });
      }
      if (!price) {
        return res
          .status(404)
          .json({ message: "Please enter description account" });
      }
      const files = req.files;
      const account = new accountModel({
        title,
        description,
        price: Number(req.body.price),
        server: req.body.server,
        link: req.body.link,
        images: files?.map((file) => `/uploads/${file.nameToSave}`),
      });
      await account.save();

      if (files?.length > 0) {
        [...files].forEach((file) => {
          const name = file.originalname;
          const path = `/uploads/${file.nameToSave}`;
          imageModel.create({ name, path, account: account._id });
        });
      }
      return res.status(200).json(account);
    } catch (error) {
      res.status(500);
      error.status = 500;
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const accountUpdated = await accountModel.updateOne(
        { _id: req.body._id },
        { ...req.body }
      );
      if (!accountUpdated) {
        return res.status(400).json({ message: "Bad request" });
      }
      const account = await accountModel.findById(req.body._id);
      return res.status(200).json(account);
    } catch (error) {
      res.statusCode = 500;
      next(error);
    }
  },
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const account = await accountModel.findById(id).populate("server");
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      return res.status(200).json(account);
    } catch (error) {
      res.statusCode = 404;
      next(error);
    }
  },
  async updateById(req, res) {
    try {
      const id = req.body._id;
      if (!id) {
        return res
          .status(404)
          .json({ message: "Missing id for update account" });
      }
      const accountUpdated = await accountModel.updateOne(
        { _id: id },
        { ...req.body }
      );
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async deleteById(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res
          .status(404)
          .json({ message: "Missing id to delete account" });
      }
      await imageModel.deleteMany({ account: id });

      const account = await accountModel.findById(id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      if (account.images.length > 0) {
        account.images.forEach((image) => {
          const filePath = `src/public/${image}`;
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        });
      }
      await accountModel.deleteOne({ _id: id });
      return res.status(200).json(account);
    } catch (error) {
      res.statusCode = 500;
      next(error);
    }
  },
};

module.exports = accountController;
