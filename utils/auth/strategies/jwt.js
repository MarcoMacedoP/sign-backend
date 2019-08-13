/*
@Author: Marco Macedo
@Description: Strategy for use jws for autenticate routes

*/
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");

const router = express.Router();
const config = require("../config/");

passport.use();
