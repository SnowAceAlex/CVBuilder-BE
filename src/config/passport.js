import passport from 'passport';
import User from '../models/user.model.js';

// TODO: In the future, implement Google and GitHub OAuth strategies here.
// Example:
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// passport.use(new GoogleStrategy({ ... }, async (accessToken, refreshToken, profile, done) => { ... }));

//Github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Lấy email từ profile GitHub
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;
        // 2. Kiểm tra xem user đã tồn tại trong database chưa
        let user = await User.findOne({ githubId: profile.id });
        // Nếu dùng chung email cho cả đăng nhập thường và GitHub:
        if (!user && email) {
          user = await User.findOne({ email });
        }
        // 3. Nếu chưa có user, tạo mới và lưu vào MongoDB
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            firstName: profile.displayName || profile.username,
            email: email,
          });
        }
        // 4. Trả user về cho các bước tiếp theo của Passport
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

//Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. lấy email
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        // 2. tìm user theo googleId
        let user = await User.findOne({ googleId: profile.id });

        // 3. nếu chưa có thì check email (account linking)
        if (!user && email) {
          user = await User.findOne({ email });

          // account linking
          if (user && !user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        // 4. nếu chưa có nữa thì tạo user mới
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            firstName: profile.displayName,
            email: email,
            // avatar: profile.photos?.[0]?.value,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

export default passport;
