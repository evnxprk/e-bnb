const express = require("express");
const router = express.Router();
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Spot,
  Review,
  ReviewImage,
  SpotImage,
  User,
  Booking,
  Sequelize,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { route } = require("./users");
const { Op } = require("sequelize");
// const spot = require("../../db/models/spots");

//? GET ALL SPOTS // returns all spots

router.get("/", async (req, res) => {
  let { page, size } = req.query;

  if (!page || page <= 0) page = 1;
  if (!size || size <= 0) size = 20;

  if (page > 10) page = 10;
  if (size > 20) size = 20;

  let pagination = {};
  if (page >= 1 && size >= 1) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }

  const spots = await Spot.findAll({ ...pagination });

  let allSpots = [];
  for (let spot of spots) {
    spot = spot.toJSON();

    const ratings = await Review.findAll({
      where: { spotId: spot.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
    });

    spot.avgRating = Number(ratings[0].toJSON().avgRating);

    const imageURL = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
      attributes: ["url"],
    });

    if (imageURL) {
      spot.previewImage = imageURL.url;
    } else {
      spot.previewImage = null;
    }

    allSpots.push(spot);
  }

  res.json({ Spots: allSpots, page, size });
});


module.exports = router;