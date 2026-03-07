/**
 * Simple validation middleware
 * Define validation rules per route
 */

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

const validatePhone = (phone) => {
  // Indian phone format: 10 digits
  return phone && /^[0-9]{10}$/.test(phone);
};

const validateBookingData = (data) => {
  const errors = [];
  
  if (!data.serviceId) errors.push("Service ID is required");
  if (!data.bookingDate) errors.push("Booking date is required");
  if (!data.startTime) errors.push("Start time is required");
  if (!data.address) errors.push("Address is required");
  
  return { isValid: errors.length === 0, errors };
};

const validate = (schema) => {
  return (req, res, next) => {
    const { isValid, errors } = schema(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateBookingData,
  validate
};
