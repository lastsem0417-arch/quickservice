const Service = require("../models/Service");

exports.addService = async (req, res) => {
  const service = await Service.create(req.body);
  res.json(service);
};

exports.getServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};