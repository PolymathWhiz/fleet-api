const db = require("../../config/db");

const {
  trim
} = require('../helper/util');

exports.createVehicle = asyn(req, res) => {
  try {
    if (trim(req.body.token) && trim(req.body.vehicle_type) && trim(req.body.vehicle_model) && trim(req.body.vehicle_number) && trim(req.body.vehicle_capacity) && trim(req.body.driver_name)) {
      const token = trim(req.body.token);
      const vehicleType = trim(req.body.vehicle_type);
      const vehicleModel = trim(req.body.vehicle_model);
      const vehicleNumber = trim(req.body.vehicle_number);
      const vehicleCapacity = trim(req.body.vehicle_capacity);
      const driverName = trim(req.body.driver_name);

      if (vehicleType !== 'coach' || vehicleType !== 'mini') return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type'
      });

      const [checkToken] = await db.execute("SELECT id FROM users WHERE token = ? AND user_type = ?", [token, 'admin']);

      if (checkToken.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const userID = checkToken[0].id;

      await db.execute("INSERT INTO vehicles (id, vehicle_type, vehicle_model, vehicle_number, vehicle_capacity, driver_name, is_booked, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())", [userID, vehicleType, vehicleModel, vehicleNumber, vehicleCapacity, driverName, '0']);

      return res.status(201).json({
        success: true,
        message: 'Successfully created vehicle',
        data: {
          vehicle_type: vehicleType,
          vehicle_capacity: vehicleCapacity,
          vehicle_model: vehicleModel,
          vehicle_number: vehicleNumber,
          driver_name: driverName,
          is_booked: '0'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters'
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Could not reach network'
    });
  }
};