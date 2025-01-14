require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const passport = require("passport");

const { Exercise, User } = require("../models");

router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.user;
  try {
    let currentUser = await User.findById(id);
    let exercises = await currentUser.populate('exercises');
    console.log('currentuser exercises', exercises);

    res.status(200).json({
      exercises: currentUser.exercises,

    });
  } catch (error) {
    console.log("exercises page", error);
    res.status(500).json({
      message: "There was an error. Please try again.",
    });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.user;
    let currentUser = await User.findById(id);
    let newExercise = await Exercise.create({
      type: req.body.type,
      muscleGroup: req.body.muscleGroup,
      name: req.body.name,
      durationGoal: req.body.durationGoal,
      weightGoal: req.body.weightGoal,
      repsGoal: req.body.repsGoal,
      setsGoal: req.body.setsGoal,
      distanceGoal: req.body.distanceGoal
    });

    console.log(newExercise);
    currentUser.exercises.push(newExercise);
    currentUser.save();
  } catch (error) {}
});

module.exports = router;
