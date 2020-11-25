import * as React from "react";

import {
    Authorization,
    GoogleAPIConnectionStrings,
    IAuthorizationOptions,
} from "../src";
import {useState} from "react";

export interface IGoogleButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Placeholder image displayed next to button text */
    readonly placeholder?: string;
    /** Remove default styles. The placeholder prop has no effect if placeholder is set to false */
    readonly defaultStyle?: boolean;
    /** See IAuthorizationRequestParams */
    readonly options: IAuthorizationOptions;
    /** Could be your preloader or any other dumb component */
    readonly callback?: () => React.ReactHTMLElement<any>;
    /** The url of the api to perform the exchange */
    readonly apiUrl: string;
}
/** @internal */
type TypeButtonStyles = { [key: string]: string };
/** @internal */
interface IGoogleAuthContext { readonly queryParamsCode: boolean; }
/** @internal */
interface IServerResponseState { readonly accessToken?: string; error?: string }
/** @internal */
interface IApiResponseData { readonly accessToken: string; }
/** @internal */
interface IPayload {
    readonly email: string;
    readonly code: string;
    readonly scope: string;
}
/** @internal */
interface IServerResponse {
    readonly email?: string;
    error?: string;
    readonly code: string;
    readonly scope: string;
    readonly client_id: string;
    readonly apiUrl: string;
    responseState: IServerResponseState;
    setResponseState: any; // TODO
}
/** @internal */
const SERVER_RESPONSE_STATE = { };
/** @internal */
const DEFAULT_GOOGLE_AUTH_STATE = { queryParamsCode: false };
/** @internal */
const buttonStyling: TypeButtonStyles = {
    backgroundSize: "20px 20px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "12px 10px",
    textIndent: "19px",
    border: "1px solid #bdc3c7",
    padding: "9px 23px",
    borderRadius: "9px",
    backgroundColor: "##bdc3c7",
    fontSize: "18px",
};
/** @internal */
const GoogleAuthContext = React.createContext<IGoogleAuthContext>(DEFAULT_GOOGLE_AUTH_STATE);
export const GoogleAuth = GoogleAuthContext.Provider;
export const GoogleAuthConsumer = GoogleAuthContext.Consumer;
/** @internal */
const _getBackgroundImg = (placeholder: string, styles: TypeButtonStyles): TypeButtonStyles => {
    if(placeholder) {
        return { ...styles, backgroundImage: `url(${placeholder})` };
    }
    return styles;
}
/** @internal */
export const InnerButton = (props: IGoogleButton & { error?: string}) => {
    const { placeholder = "", defaultStyle = true, options } = props;

    const scopes = Authorization.createScopes(options.scopes);
    const auth = new Authorization(options, scopes);
    auth.createAuthorizationRequestURL();

    const styles = defaultStyle ? _getBackgroundImg(placeholder, buttonStyling) : undefined;
    return <button style={styles} onClick={auth.redirect} >Sign in with google</button>
}
/** @internal */
async function postToExchangeApiUrl(apiUrl: string, payload: IPayload): Promise<IApiResponseData> {
    const res: Response = await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return res.json();
}
/** @internal */
function serverResponse(props: IServerResponse): void {
    const { email, error, code, apiUrl, scope } = props;
    // TODO Make request with client_id & code to Flask API
    const payload: IPayload = { code, email, scope };
    postToExchangeApiUrl(apiUrl, payload)
        .then((data: IApiResponseData) => {
            // update responseState
        })
        .catch(err => {
            // update responseState error
        });
}
/**
 * @example
 * **Quick Start:**
*       First create an options object that implements an {@link  IAuthorizationOptions} type.
 *      Check the {@link  IAuthorizationOptions} and {@link  IAuthorizationBase} types for
 *      all required properties. Then, pass the options to the {@ GoogleButton} component.
 * ```IAuthorizationOptions
 *  const options:  = {
 *      clientId: (process.env.CLIENT_ID as string),
 *       redirectUri: "http://localhost:3000",
 *       scopes: ["openid", "profile", "email"],
 *       includeGrantedScopes: true,
 *       accessType: "offline",
 *   };
 *
 *   <GoogleButton
 *         placeholder="demo/search.png"
 *         options={options}
 *         apiUrl="http://localhost:5000/google_login"
 *   />
 * ```
 * @param props see IGoogleButton
 * @constructor
 */
export const GoogleButton = (props: IGoogleButton) => {
    const { callback } = props;
    const [responseState, setResponseState] = useState<IServerResponseState>(SERVER_RESPONSE_STATE);
    const currentUrl = new URLSearchParams(window.location.search);
    const queryParamsCode = currentUrl.get("code");
    const queryParamsError = currentUrl.get("error");
    if(responseState.accessToken) {
        window.localStorage.setItem("accessToken", responseState.accessToken);
        console.debug("`accessToken` set in local storage.")
        return null;
    } else if (queryParamsCode) {
        // Get rest of params
        const queryParamsEmail = currentUrl.get("email") || "";
        const queryParamsScope = currentUrl.get("scope") || "";
        const serverResponseProps: IServerResponse = {
            email: queryParamsEmail,
            scope: queryParamsScope,
            code: queryParamsCode,
            client_id: props.options.clientId,
            apiUrl: props.apiUrl,
            responseState,
            setResponseState,
        };
        serverResponse(serverResponseProps);
        return callback ? callback() : <>Loading...</>;
    } else if(queryParamsError) {
        return <InnerButton {...props} error={queryParamsError} />;
    }
        return <InnerButton {...props} />;
}