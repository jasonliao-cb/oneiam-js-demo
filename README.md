# oneiam-js

This javascript library allows your application to seamlessly synchronize authentication status with our new OneIAM
platform (auth.careerbuilder.com). If you know about the OneIAM on Matrix, this is the functional equivalent of the
[cb-auth](https://github.com/cbdr/cb-auth) library.

## Usage

### Prerequisites

  * Client id / secret for the new platform
  * Some knowledge of OpenID Connect / OAuth 2.0

### Server Side Preparations

This library assumes you have implemented the following two endpoints on the server side:

  * `/oneiam/authenticate`

    This endpoint does 302 redirection to OneIAM Authroization Endpoint with sufficient query parameters.

    * If query `silent=true` is passed in, it must adds query `prompt=none` to the authorization endpoint.
    * If query `next=<url>` is passed in, it should somehow save that URL for later use (redirect the user back once
      authenticated).

    The path of this endpoint could be changed, as long as it's correctly set in [OneiamConfig](#constructorconfig).

  * `/oneiam/callback`

    This is the `redirect_uri` for OneIAM Authroization Endpoint.

    Upon successful authentication, OneIAM would pass back an authorization code and a session state value, both in the
    query. The authorization code should be used to exchange for id token / access token / refresh token. The session
    state value must be written to a non-HttpOnly cookie, usually named `oneiam_ss`, so that `oneiam-js` could check if
    session state has changed later.

    For normal authentication, this endpoint should redirect user to the previously saved `next` URL. For silent
    authentication, a successfuly response code (2xx) must be rendered, with arbitrary response body.

    In case of failures from silent authentication, it must log the user out and delete session state cookie.

    This endpoint, as full URL with scheme and domain name, must be registered in OneIAM for your Client ID.

    The path of this endpoint could be changed, as long as it's correctly registered and set as the `redirect_uri`.

For better understanding, you should read about *Authorization Code Flow* and *Silent Authentication*. Example
implementations could be found in [oneiam-samples](https://github.com/cbdr/oneiam-samples).

### Browser side usage with Vanilla JS

  1. Include oneiam-js on the page from one of the two sources:

     * https://auth.careerbuilder.com/assets/oneiam-VERSION.min.js
       * Find version numbers in [github releases](https://github.com/cbdr/oneiam-js/releases).
     * npm package `@cb/oneiam`
       * You need a `.npmrc` file with access to https://cbdatascience.jfrog.io.

  2. Intialize `Oneiam`:

     ```javascript
     var oneiam = new Oneiam({
       issuer: 'https://auth.careerbuilder.com',
       clientId: 'Your Client ID'
     });
     ```

     For staging, set `issuer` to `https://wwwtest.auth.careerbuilder.com`.

  3. Call `oneiam.synchronize()` with appropriate options for each page.

     ```javascript
     oneiam.synchronize({
       requireAuthentication: false,
       refreshOnChange: true
     });
     ```

     See [oneiam.synchronize(options?)](#oneiamsynchronizeoptions) for more details.

### Browser side usage with Angular

  1. Put a `.npmrc` file with access to https://cbdatascience.jfrog.io under your project or home directory.

  2. Install dependency: `npm i @cb/oneiam`

  3. Import and configure `OneiamModule`:

     ```typescript
     import { NgModule } from '@angular/core';
     import { OneiamModule } from '@cb/oneiam/angular';
     import { AppComponent } from './app.component';

     @NgModule({
       declarations: [
         AppComponent
       ],
       imports: [
         OneiamModule.forRoot({
           issuer: 'https://auth.careerbuilder.com',
           clientId: 'Your Client ID'
         })
       ],
       bootstrap: [AppComponent]
     })
     export class AppModule {}
     ```

     For staging, set `issuer` to `https://wwwtest.auth.careerbuilder.com`.

  4. Add `OneiamAuthGuard` to your angular routes: <a name="oneiam-auth-guard-example"></a>

     ```typescript
     import { Routes } from '@angular/router';
     import { OneiamAuthGuard } from '@cb/oneiam/angular';
     import { SecureComponent } from './demo/secure/secure.component';
     import { HomeComponent } from './home/home.component';

     const routes: Routes = [
       {
         path: '',
         canActivateChild: [OneiamAuthGuard],
         children: [
           {
             path: '',
             component: HomeComponent
           },
           {
             path: 'demo/secure',
             data: { requireAuthentication: true },
             component: SecureComponent,
             children: [
               // any child routes here also require authentication
             ]
           }
         ]
       }
     ];
     ```

     It's recommended to wrap all routes with `OneiamAuthGuard`, so that all pages could synchronize authentication
     status with OneIAM. To require users to login on all or certain pages, add `data: { requireAuthentication: true }`
     to appropriate route(s).

## API

### constructor(config)

Instantiate `Oneiam` with provided `config`.

#### Arguments

  * `config`: `object`

    * `issuer`: `string` *Required \**

      The URL of OneIAM.

      * For production, use `https://auth.careerbuilder.com`.
      * For staging, use `https://wwwtest.auth.careerbuilder.com`.

    * `clientId`: `string` *Required \**

      Client ID for your application.

    * `authenticateUri`: `string` *Optional* <a name="config-authenticateuri"></a>

      The URI used when authentication or silent authentication is needed. Defaults to `/oneiam/authenticate`.

    * `cookieName`: `string` *Optional*

      The name of the cookie that stores session state value. It must match what's set in `/oneiam/callback`. Defaults
      to `oneiam_ss`.

    * `alternateOrigins`: `string[]` *Optional* (*v1.1.0+*)

      Alternate origins your app uses to connect with OneIAM. Use this if you have multiple domain names sharing the
      same session. For this to work, make sure you have shared the session state cookie across domains.

    * `debug`: `boolean` *Optional*

      Enable logging for [oneiam.synchronize(options?)](#oneiamsynchronizeoptions). Defaults to `false`.

#### Examples

```javascript
var oneiam = new Oneiam({
  issuer: 'https://auth.careerbuilder.com',
  clientId: 'Your Client ID'
});
```

### oneiam.config

Refer to the same `config` object passed in to [constructor](#constructorconfig).

### oneiam.session.state

A getter that returns the session state value from cookie. Could be a `string` or `undefined`.

### oneiam.session.changed()

Use the session state value saved in cookie to check if session state has changed or not on OneIAM.

#### Returns

`Promise<boolean>`

  * For unauthenticated users without a session state value in cookie, it resolves to `true` if user has been
    authenticated on OneIAM.

  * For authenticated users, it resolves to `true` if user has logged out or re-logged in on OneIAM.

  * Otherwise, it resolves to `false`.

### oneiam.authenticate(options?)

Redirect to [config.authenticateUri](#config-authenticateuri) or open that in a hidden iframe for silent authentiation.

#### Arguments

  * `options`: `object`

    * `silent`: `boolean` *Optional*

      Use silent authentication or not. Defaults to `false`.

    * `next`: `string` *Optional*

      The URL to redirect user to after authentication. Defaults to `location.href`.

      Ignored for silent authentication.

#### Returns

`Promise<string>`

  * For normal authentication, it always resolves to `authenticate`.

  * For silent authentication, it resolves to either `authenticated` or `unauthenticated`, depending on user's
    authentication status on OneIAM.

#### Examples

```javascript
oneiam.authenticate({ next: location.href });
```

```javascript
var result = await oneiam.authenticate({ silent: true });
```

### oneiam.authenticated()

Check if user has been authenticated or not on OneIAM.

#### Returns

`Promise<boolean>`

### oneiam.synchronize(options?)

Higher level method for easily synchronizing authentication status with OneIAM. Usually this should be called on every
page, during page loads, and pass in whether or not authentication is required for that page.

For angular apps, use [OneiamAuthGuard](#oneiam-auth-guard-example) instead.

#### Arguments

  * `options`: `object`

    * `requireAuthentication`: `boolean` *Optional*

      If user is not authenticated on OneIAM and this is set to `true`, it would redirect user to the OneIAM login page.
      Defaults to `false`.

      Regardless of this value, this method would always try to synchronize authentication status with OneIAM. For
      example, if user is authenticated on OneIAM but not yet on your app, it would make user authenticated on your app
      as well, even if `requireAuthentication` is set to `false`.

    * `refreshOnChange`: `boolean` *Optional*

      Whether or not to reload the page when authentication status changes. This is useful for server side rendered
      pages. Defaults to `true`.

    * `next`: `string` *Optional*

      Set redirect back URL to a different one when authentication is needed. Not useful usually. Used internally by
      `OneiamAuthGuard` because guard is run before the URL changes. Defaults to `location.href`.

    * `debug`: `boolean` *Optional*

      Enable logging. Defaults to `false`.

#### Returns

`Promise<string>` ->

  * `noop`: No operation is done because the authentication status is in sync.

  * `authenticate`: Redirected to OneIAM login page because authentication is required and user is not authenticated.

  * `authenticated`: User got authenticated or re-authenticated on your app.

  * `unauthenticated`: User got unauthenticated (logged out) on your app.

  * `disconnected`: The iframe used to communicate with OneIAM is no longer connected to the DOM. This happens if
                    [turbolinks](https://github.com/turbolinks/turbolinks) is used and the DOM gets dynamically
                    replaced. In this case, this is not an error.

#### Examples

```javascript
oneiam.synchronize({
  requireAuthentication: false,
  refreshOnChange: true
});
```

### OneiamModule.forRoot(config)

Configure `OneiamModule` and return a `ModuleWithProviders` for your angular module to import.

#### Arguments

See [constructor(config)](#constructorconfig).

#### Examples

```typescript
@NgModule({
  imports: [
    OneiamModule.forRoot({
      issuer: 'https://auth.careerbuilder.com',
      clientId: 'Your Client ID'
    })
  ]
})
export class AppModule {}
```

## Development

Check documentation [here](https://careerbuilder.atlassian.net/wiki/spaces/PS/pages/880607549/OneIAM+JS).
