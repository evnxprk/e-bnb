const express = require("express");

const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth.js");
const {
  Spot,
  User,
  Booking,
  Review,
  ReviewImage,
  SpotImage,
  sequelize,
} = require("../../db/models");

const router = express.Router();

//? edit a booking

router.put("/:bookingId", requireAuth, async (req, res, next) => {
    
})


module.exports = router;