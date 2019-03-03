const db = require("../../config/db");

const {
  trim
} = require('../helper/util');

exports.create = async (req, res) => {
  try {
    if (trim(req.body.token) && trim(req.body.vehicle_id) && trim(req.body.need_date) && trim(req.body.reason)) {
      const token = trim(req.body.token);
      const vehicleId = trim(req.body.vehicle_id);
      const needDate = trim(req.body.need_date);
      const reason = trim(req.body.reason);

      // check token validity
      const [checkToken] = await db.execute("SELECT id FROM users WHERE token = ? AND user_type = ?", [token, 'user']);

      if (checkToken.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const userID = checkToken[0].id;

      await db.execute("INSERT INTO bookings (vehicle_id, user_id, need_date, reason, is_confirmed, created_at) VALUES (?,?,?,?, ?, NOW())", [vehicleId, userID, needDate, reason, '0']);

      return res.status(201).json({
        success: true,
        message: 'Booking created',
        data: {
          vehicle_id: vehicleId,
          need_date: needDate,
          is_confirmed: '0',
          reason
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

exports.viewBookings = async (req, res) => {
  try {
    if (trim(req.query.token)) {
      const token = trim(req.query.token);

      const [checkToken] = await db.execute("SELECT id FROM users WHERE token = ? AND user_type = ?", [token, 'user']);

      if (checkToken.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const userID = checkToken[0].id;

      const [bookings] = await db.execute("SELECT * FROM bookings WHERE user_id = ?", [userID]);

      return res.status(200).json({
        success: true,
        message: 'Successfully fetched bookings',
        data: bookings[0]
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameter'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not reach network'
    });
  }
};