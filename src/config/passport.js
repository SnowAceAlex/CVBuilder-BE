import passport from 'passport';
import User from '../models/user.model.js';

// TODO: In the future, implement Google and GitHub OAuth strategies here.
// Example:
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

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
            name: profile.displayName || profile.username,
            email: email,
            avatar: profile.photos[0].value,
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

export default passport;
