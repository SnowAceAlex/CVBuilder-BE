import passport from 'passport';
import User from '../models/user.model.js';

// TODO: In the future, implement Google and GitHub OAuth strategies here.
// Example:
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';

// passport.use(new GoogleStrategy({ ... }, async (accessToken, refreshToken, profile, done) => { ... }));
// passport.use(new GitHubStrategy({ ... }, async (accessToken, refreshToken, profile, done) => { ... }));

export default passport;
