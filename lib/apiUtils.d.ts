/** @internal */
import { Dispatch, SetStateAction } from "react";
export interface IPayload {
    readonly code: string;
    readonly scope: string;
}
export declare const GOOGLE_OAUTH2_EXCHANGE_TOKEN_URL = "https://oauth2.googleapis.com/token";
/** @internal */
export interface IApiResponseData {
    readonly access_token: string;
}
/** @internal */
export declare function postToExchangeApiUrl(apiUrl: string, payload: IPayload): Promise<IApiResponseData>;
/** @internal */
export interface IServerResponseState {
    readonly accessToken?: string;
    error?: string;
}
/** @internal */
export interface IServerResponseProps {
    readonly code: string;
    readonly scope: string;
    readonly apiUrl: string;
    responseState: IServerResponseState;
    setResponseState: Dispatch<SetStateAction<IServerResponseState>>;
}
/** @internal */
export declare function serverResponse(props: IServerResponseProps): void;
/** @internal */
export declare function storeAccessToken(token: string): void;
/**
 * @example
 * ```
 *  if(isLoggedIn()) { // returns true is accessToken exists in LocalStorage
 *      // user logged code...
 *  }
 * ```
 */
export declare function isLoggedIn(): boolean;
/**
 * @example
 * ```
 *  logOutOAuthUser() // removes the accessToken from LocalStorage
 * ```
 * @return void
 */
export declare function logOutOAuthUser(): void;
/**
 * @description Get the stored accessToken
 * @return The Access Token or none
 */
export declare function getAccessToken(): string | null;
/**
 * @description Warning: Please make sure that as of version `0.0.23` we have removed
 * the `application/json` content type headers from this function. This may cause an issue
 * if you originally didn't construct your request content type headers with `application/json`.
 * @example
 * ```
 *  fetch(url, {
 *      headers: createOAuthHeaders(),
 *  })
 * ```
 *
 * If you require your server to handle authenticating multiple users across many resources
 * (or tables) then pass in the name of the resource, for Example:
 * @example
 * ```
 *  fetch(url, {
 *      headers: createOAuthHeaders("users"),
 *  })
 * ```
 *
 *  With the resource value, the following headers are constructed:
 *
 *  @example
 *  ```
 *  {
 *    "X-Auth-Token" : "<TOKEN>",
 *    "X-Auth-Resource": "users",
 *  }
 *  ```
 * @param resource Optional resource name to look up on the server
 * @return Objects
 */
export declare function createOAuthHeaders(resource?: string): {
    [k: string]: string;
};
/** @internal */
export declare function removeOAuthQueryParams(): void;
/**
 * @description
 * Function to exchange a refresh token for an access token & sets the access
 * token into local storage..
 * @example
 * ```
 *  exchangeToken(CLIENT_ID, REFRESH_TOKEN, CLIENT_SECRET)
 *  .then(accessToken => {
 *       console.log(accessToken) // your access token...
 *   });
 * ```
 * If you require an access token to run your e2e tests then `exchangeToken` will set and return a new access token.
 * @example
 * ```
 *     Cypress.Commands.add("loginSSO",  (overrides = {}) => {
 *       Cypress.log({
 *           "name": "loginSSO",
 *       });
 *       if(!getAccessToken()) {
 *           exchangeToken(CLIENT_ID, REFRESH_TOKEN, CLIENT_SECRET)
 *           .then(accessToken => {
 *               cy.request({
 *                   method: 'GET',
 *                   url: `${API_URL}/staff`,
 *                   headers: createOAuthHeaders(),
 *               });
 *           });
 *       }
 *   });
 * ```
 * @param clientId Google OAuth Client ID
 * @param refreshToken Refresh Token (Use Google Oauth Playground to generate a refresh token)
 * See: https://developers.google.com/oauthplayground/
 * @param clientSecret Google Api's Client Secret
 * @return Promise<String> The string is the new access token also set in local storage
 */
export declare function exchangeToken(clientId: string, refreshToken: string, clientSecret: string): Promise<String>;
