const router = require("express").Router();
const sessionRouter = require("./sessions.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
// const reviewsRouter = require("./reviews.js");
// const bookingsRouter = require("./bookings.js");
// const spotImagesRouter = require("./spot-images.js");
// const reviewImagesRouter = require("./review-images.js");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth.js");
const { User } = require("../../db/models");

// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

router.use("/sessions", sessionRouter);

router.use("/users", usersRouter);

router.use("/spots", spotsRouter);

// router.use("/reviews", reviewsRouter);

// router.use("/bookings", bookingsRouter);

// router.use("/spot-images", spotImagesRouter);

// router.use("/review-images", reviewImagesRouter);

router.use(restoreUser);
router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;