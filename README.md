INFSCI 2560 Activity 10
========================

Implementing authentication Github OAuth with Passport.js.

## Getting Started

1. Remix this app
2. Create an application on Github's [app registration](https://github.com/settings/applications/new) page
3. Use `https://{your-remix}.glitch.me` as the Homepage URL
4. Use `https://{your-remix}.glitch.me/login/github/return` as the Authorization callback URL
5. Once you have created the app you will see the *Client ID* and *Client Secret* tokens. Copy those into your `.env` file.
6. Visit the site at https://{your-remix}.glitch.me and click the "Log In with GitHub" link. It should take you to Github (assuming you have a Github account, which you will need)
7. Submit the Glitch Project page to Canvas so we can try logging into your app ourselves!


## Check out the Code

On the back-end,
- the app starts at `server.js`
- frameworks and packages are in `package.json`
- app secrets are safely stored in `.env`

On the front-end,
- The unauthenticated page is `index.html` and users will see `success.html` once they log in


Made by Matt Burton and Fog Creek
-----------------

\ ゜o゜)ノ
