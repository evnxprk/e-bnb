const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth.js");
const {
  User,
  Spot,
  Booking,
  SpotImage,
  ReviewImage,
  Review,
} = require("../../db/models");
 //? delete a spot image 
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const spotId  = req.params.imageId;
  // console.log(req.params)
  const spotOwner = await Spot.findByPk(spotImage.spotId)
  const spotImage = await SpotImage.findByPk(spotId);
if(spotImage.userId !== req.user.id) {
  res.status(403)
  res.json({
    message: "Forbidden",
    statusCode: 403
  })
}
  if (!spotImage) {
    res.status(404);
    res.json({
      message: "Spot Image cannot be found",
      statusCode: 404,
    });
  }
if(spotOwner.ownerId === id){
  spotImage.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
}
});

module.exports = router;
