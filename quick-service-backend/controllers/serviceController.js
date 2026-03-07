const Service = require("../models/Service");

// GET ALL SERVICES WITH PAGINATION & FILTERING
exports.getServices = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, minPrice, maxPrice, search } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch services
    const services = await Service.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ isFeatured: -1, rating: -1 });

    // Count total
    const total = await Service.countDocuments(filter);

    res.json({
      success: true,
      data: services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("GET SERVICES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services"
    });
  }
};

// GET SERVICE BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service"
    });
  }
};

// ADD SERVICE (ADMIN ONLY)
exports.addService = async (req, res) => {
  try {
    const { name, description, category, price, image, serviceArea, estimatedDuration } =
      req.body;

    // Validation
    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const service = await Service.create({
      name,
      description,
      category,
      price,
      image,
      serviceArea: serviceArea || [],
      estimatedDuration: estimatedDuration || 60,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service
    });
  } catch (err) {
    console.error("ADD SERVICE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: err.message
    });
  }
};

// UPDATE SERVICE (ADMIN ONLY)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(id, updates, { new: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      data: service
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update service"
    });
  }
};

// DELETE SERVICE (ADMIN ONLY)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service"
    });
  }
};

// SEARCH SERVICES
exports.searchServices = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const services = await Service.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    }).limit(20);

    res.json({
      success: true,
      data: services
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Search failed"
    });
  }
};

// GET SERVICES BY CATEGORY
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find({ category, isActive: true })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    const total = await Service.countDocuments({ category, isActive: true });

    res.json({
      success: true,
      data: services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services"
    });
  }
};