const serverModel = require("../models/server.model");

const serverController = {
  async getAll(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const skip = limit * (page - 1);
      const servers = await serverModel.find({}).skip(skip).limit(limit);
      const count = await serverModel.find({}).count();
      return res.status(200).json({ data: servers, count });
    } catch (error) {
      res.statusCode = 500;
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const server = await serverModel.create({ name: req.body.name });
      return res.status(200).json(server);
    } catch (error) {
      res.statusCode = 500;
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const id = req.body._id;
      if (!id) {
        return res.status(404).json({ message: "Missing id server" });
      }
      await serverModel.updateOne({ _id: id }, { ...req.body });
      const server = await serverModel.findById(id);
      return res.status(200).json(server);
    } catch (error) {
      res.statusCode = 500;
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(404).json({ message: "Missing id server in params" });
      }
      const server = await serverModel.findById(id);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }
      await serverModel.deleteOne({ _id: id });
      return res.status(200).json(server);
    } catch (error) {
      res.statusCode = 500;
      next(error);
    }
  },
};
module.exports = serverController;
