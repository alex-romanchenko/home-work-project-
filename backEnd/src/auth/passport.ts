import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/AuthService";

const JWT_SECRET = "super_secret_key";
const authService = new AuthService();

passport.use(
    new BearerStrategy(async (token, done) => {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { email: string };

            const user = await authService.getUserByEmail(payload.email);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(null, false);
        }
    })
);

export default passport;