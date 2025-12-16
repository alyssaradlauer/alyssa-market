import { getUserById } from "../db/queries/users.js";
import { verifyToken } from "../utils/jwt.js";

/** Attaches the user to the request if a valid token is provided */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");

  //first - see if the request has a login token, and if not move on from it
  //token was not being recognized because it was not checking lowercase
  if (!authorization || !authorization.toLowerCase().startsWith("bearer "))
    return next();

  //taking the token from the header, which is whatever comes after bearer
  const rawToken = authorization.split(" ")[1];

  //rawToken is what comes directly after bearer, can be overridden later
  let token = rawToken;

  //tests were not passing for me because token was sometimes a JSON string that needed to be parsed
  if (rawToken.startsWith("{")) {
    try {
      token = JSON.parse(rawToken).token;
    } catch (error) {
      return res.status(401).send("Invalid token.");
    }
  }

  try {
    const { id } = verifyToken(token);

    const user = await getUserById(id);

    req.user = user;
    console.log("REQ.USER AFTER TOKEN:", req.user);
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Invalid token.");
  }
}
