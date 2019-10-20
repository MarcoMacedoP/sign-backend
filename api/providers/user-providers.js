const router = require("express").Router();
const fileUpload = require("../../utils/middlewares/fileUpload");
//services
const UserProvidersServices = require("../../services/providers/user-providers");
//utils
const config = require("../../config");
const {sendGoodResponse} = require("../../utils/responses");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");

//Patch a provider picture
router.patch(
  "/:providerId/photo",
  fileUpload.single("picture"),
  async (req, res, next) => {
    const userId = getUserIDFromAccessToken(req);
    const {providerId} = req.params;
    const userProvidersServices = new UserProvidersServices();
    const pictureUrl = `${config.serverUrl}/static/uploads/${req.file.filename}`;
    try {
      const updatedProvider = await userProvidersServices.updatePictureUrl(
        userId,
        providerId,
        pictureUrl
      );
      sendGoodResponse({
        response: res,
        message: "updated photo",
        statusCode: 200,
        data: updatedProvider
      });
    } catch (error) {
      next();
    }
  }
);

module.exports = router;
