const accountModel = require("../models/account.model");
const imageModel = require("../models/image.model");
const fs = require("fs");
const { generateRandomCode } = require("../../utils/myUtil");

const accountController = {
  async createMaTk() {
    let randomString = generateRandomCode(6);
    const isExist = await accountModel.findOne({ ma_tk: randomString });
    if (isExist) {
      accountController.createMaTk();
    } else {
      return randomString;
    }
  },
  async getAll(req, res, next) {
    try {
      const q = req.query.q;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const server = req.query.server || "";
      const sort = Number(req.query.sort) || 0; // 0: normal; 1: increase; 2: decrease
      const skip = limit * (page - 1);

      let condition = {};
      if (server) {
        condition.server = server;
      }
      const sortCondition = {};
      if (sort === 1) {
        sortCondition.price = "asc";
      } else if (sort === 2) {
        sortCondition.price = "desc";
      }

      if (q) {
        condition.$or = [];
        const conditionParse = JSON.parse(q);
        if (conditionParse.$or.length > 0) {
          conditionParse.$or.forEach((conditionItem) => {
            const keys = Object.keys(conditionItem);
            const values = Object.values(conditionItem);
            const regex = new RegExp(values[0].$regex, values[0].$options);
            condition.$or.push({ [keys[0]]: regex });
          });
        }
      }

      const accounts = await accountModel
        .find(condition)
        .skip(skip)
        .limit(limit)
        .sort(sortCondition)
        .populate("server");
      const count = await accountModel.find(condition).count();
      const totalItem = await accountModel.find({}).count();
      res.status(200).json({ data: accounts, count, totalItem });
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
      if (!price) {
        return res
          .status(404)
          .json({ message: "Please enter description account" });
      }
      const files = req.files;
      const ma_tk = await accountController.createMaTk();
      const account = new accountModel({
        ma_tk,
        title,
        description,
        price: Number(req.body.price),
        server: req.body.server,
        link_facebook: req.body.link_facebook,
        link_zalo: req.body.link_zalo,
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
  async getByMaTk(req, res, next) {
    try {
      const ma_tk = req.params.ma_tk;
      const account = await accountModel.findOne({ ma_tk }).populate("server");
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
          fs.access(filePath, (err) => {
            if (!err) {
              fs.unlink(filePath, (err) => {
                if (err) throw err;
              });
            }
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
