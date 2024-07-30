# passport-vimeo-oauth2-ts

A Passport strategy for authenticating with Vimeo using OAuth 2.0, written in TypeScript.

## Installation

```bash
npm install passport-vimeo-oauth2-ts
```

## Usage

### Configure Strategy

The Vimeo authentication strategy authenticates users using a Vimeo account and OAuth 2.0 tokens. The strategy requires a verify callback, which receives the access token and optional refresh token, as well as profile which contains the authenticated user's Vimeo profile. The verify callback must call cb providing a user to complete authentication.

```typescript
import passport from 'passport';
import { Strategy as VimeoStrategy } from 'passport-vimeo-oauth2-ts';

passport.use(new VimeoStrategy({
    clientID: VIMEO_CLIENT_ID,
    clientSecret: VIMEO_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/vimeo/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ vimeoId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

## Authenticate Requests

Use passport.authenticate(), specifying the 'vimeo' strategy, to authenticate requests.
For example, as route middleware in an Express application:

```ts
app.get('/auth/vimeo',
  passport.authenticate('vimeo'));

app.get('/auth/vimeo/callback', 
  passport.authenticate('vimeo', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Profile Fields

The Vimeo profile contains the following fields:

- id: The user's Vimeo ID
- displayName: The user's display name
- name: The user's full name
- email: The user's email address
- link: URL to the user's Vimeo profile
- uri: Vimeo API URI for the user


