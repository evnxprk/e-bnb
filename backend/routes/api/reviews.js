const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth.js");
const {
  User,
  Spot,
  Booking,
  Review,
  SpotImage,
  ReviewImage,
} = require("../../db/models");

//? Get all Reviews of the Current User

router.get("/current", requireAuth, async (req, res, next) => {
    const reviews = await Review.findAll({ 
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot
            },
            {
                model: ReviewImage
            }
        ]
    })
    res.json(reviews)
});




module.exports = router;