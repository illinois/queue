# Authentication

The Queue uses Shibboleth to authenticate users. However, we don't do Shib
authentication on every request, for a couple of reasons:

- Websockets don't end up with Shibboleth authentication/identity headers,
  which we'll need for private queues
- Shibboleth is configured with policies that enforce reauthentication
  whenever the user changes networks, and also every 24 hours. With 2FA
  on the way, this will become increasingly annoying

To account for this, we only use Shibboleth initially to verify a user's
identity. We then establish our own "session" for them using a JSON Web
Token. When that token expires, we re-authenticate using Shibboleth. This
also allows us to use other forms of authentication, such as OAuth. In
all cases, we simply issue a JWT that identifies the user to us.

# Authorization

Every API request goes through the authorization middleware defined in
`src/middleware/authz.js`. That middleware attaches authorization information
to `res.locals.userAuthz`:

- `res.locals.userAuthz.isAdmin`: If the current user is a global admin
- `res.locals.userAuthz.staffedCourseIds`: A list of all course IDs that the current
  user is on staff for
