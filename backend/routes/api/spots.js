const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth, restoreUser } = require("../../utils/auth.js");
const {
  User,
  Spot,
  Booking,
  SpotImage,
  ReviewImage,
  Review,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { route } = require("./users");

// const spot = require("../../db/models/spots");

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat").exists({ checkFalsy: true }),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .withMessage("Stars is required")
    .isLength({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

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
      attributes: [[Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"]],
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

//? get all spots owned by current user

router.get("/current", restoreUser, requireAuth, async (req, res, next) => {
const allSpots = await Spot.findAll({
  where: {
    ownerId: req.user.id
  }
})
res.status(200)
res.json({ Spot: allSpots}) 
})

//? Get details of a spot from an ID 

router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params

  const spots = await Spot.findByPk(spotId, {
    include: [{
      model: User,
      attributes: ['firstName', 'lastName', 'id'],
    },{
      model: SpotImage, 
      attributes: ['id', 'url', 'preview']
  }]
  })
  if(!spots) {
    res.status(404)
    res.json({message: "Spot can't be found" ,
  statusCode: 404})
  }
  res.json(spots)
})

//? Create a spot

router.post("/", validateSpot, requireAuth, async (req, res) => {
const ownerId =  req.user.id
const mySpot = await Spot.create({ownerId, ...req.body})
res.json(mySpot)
})

//? create an image for a spot 

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)

  const { url, preview } = req.body

  if (!spot) {
    res.status(404)
    res.json({message: "Spot couldn't be found", 
  'statusCode': 404
})
  }

  const spotImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview
  })

  if(!spotImage) {
    res.status(400)
    res.json({
      message: "Need to provide url and preview",
    })
  }

  const spotImages = await SpotImage.findOne({
    where: {
      spotId: req.params.spotId
    }
  })

  if(!spotImages) {
    res.status(404)
    res.json({
      message: "Image for this spot wasn't created"
    })
  }
  res.json({
    id:spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview
  })
})
module.exports = router;
