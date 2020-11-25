React Google OAuth 2.0

Docs: https://joegasewicz.github.io/react-google-oauth2.0/

## Install
```bash
npm install react-google-oauth2
```


## Usage
```bash
import * as React from "react";
import * as ReactDOM from "react-dom";

import {  GoogleButton, IAuthorizationOptions } from "../src";

function App(props: any) {

    const options: IAuthorizationOptions = {
        clientId: "your_client_id",
        redirectUri: "http://localhost:3000",
        scopes: ["openid", "profile", "email"],
        includeGrantedScopes: true,
        accessType: "offline",
    };

    return (
        <>
          <GoogleButton placeholder="demo/search.png" options={options} />
        </>
    );
}

ReactDOM.render(
    </App>,
    document.getElementById("main"),
);
```