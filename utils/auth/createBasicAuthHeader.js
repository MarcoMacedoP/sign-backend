/**Create a Basic Auth header formatted and enconded.
 * see how it's formatted: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
 * @param {String} user the user name to be used for auth
 * @param {String} password the password for the user
 */
function createBasicAuthHeader(user, password) {
  const authHeader = `${user}:${password}`;
  const buffer = Buffer.from(authHeader);
  const authHeaderBase64 = buffer.toString("base64");
  return `Basic ${authHeaderBase64}==`;
}
module.exports = createBasicAuthHeader;
