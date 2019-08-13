/*
@Author: Marco Macedo
@Description: Strategy for use jws for autenticate routes

*/
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const MariaLib = require("../../../lib/mariadb");
const config = require("../../../config/");

passport.use(
  new Strategy(
    {
      secretOrKey    : config.authJwtSecret,
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, done) {
      const mariadb = new MariaLib();

      try {
        const [ user ] = await mariadb.read(
          "users",
          `WHERE user_id=${tokenPayload.sub}`
        );

        if (!user) {
          return done(new Error("Bad user"), false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
