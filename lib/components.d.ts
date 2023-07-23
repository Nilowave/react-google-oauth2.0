import { default as React, Dispatch, SetStateAction } from "react";
import { IAuthorizationOptions, TypePrompt } from "./authorization";
import { IServerResponseState } from "./apiUtils";
/** @public */
export interface IGoogleButton {
    /** Placeholder image displayed next to button text. The placeholder prop has no effect if placeholder is set to false */
    readonly placeholder?: string;
    /** Remove default styles.
     *  To Style the <button> element with CSS, use `google-oauth-btn`. For example:
     *  ```
     *  .google-oauth-btn {
     *      color: red;
     *      background-color: lime;
     *  }
     *  ```
     * (you can also pass your css selectors directly with Reacts' `className` prop)
     * */
    readonly defaultStyle?: boolean;
    /** See IAuthorizationRequestParams */
    readonly options: IAuthorizationOptions;
    /**
     * @property
     * @optional
     * A React component or any function that returns a React component.
     * This would normally be used to display a preloader to the user whilst
     * the OAuth2.0 login strategy is in flight. By default a `Loading...`
     * message will be displayed.
     * @example
     * ```
     * <GoogleButton
     *    callback={() => <>"Loading..."</>}
     *    // other props...
     * />
     * ```
     */
    readonly callback?: () => React.ReactHTMLElement<any>;
    /** The url of the api to perform the exchange */
    readonly apiUrl: string;
    /**
     * Optional. Default set to false.
     * Display an error to the user (will be displayed in a child `div` element).
     */
    readonly displayErrors?: boolean;
}
/** @internal */
type TypeGoogleButton = IGoogleButton & React.ButtonHTMLAttributes<HTMLButtonElement>;
export interface IOAuthState {
    isAuthenticated?: boolean;
    setOAuthState: Function;
    responseState?: IServerResponseState;
    options?: IAuthorizationOptions;
    setOptions: Function;
    setPrompt: Function;
    /**
     * ```
     *    import {
     *       responseState
     *   } from "react-google-oauth2";
     *
     *   <GoogleAuth>
     *   {({responseState}) => {
     *       // access the token from the state
     *       console.log(responseState.accessToken) // <ACCESS_TOKEN>
     *   }}
     *   </GoogleAuth>
     * ```
     */
    setResponseState: Dispatch<SetStateAction<IServerResponseState>>;
}
/** @internal */
export declare const GoogleAuthProvider: React.Provider<IOAuthState>;
/**
 * @example
 * Get notified when a user has logged in successfully by wrapping the GoogleButton
 * component within the GoogleAuth provider. For example:
 * ```
 *    import {
 *       GoogleAuth
 *   } from "react-google-oauth2";
 *
 *   <GoogleAuth>
 *   {({isAuthenticated}) => {
 *       // isAuthenticated will get set to true when a user has successfully logged in.
 *       console.log("value: ", isAuthenticated); // value: true or false
 *       return <GoogleButton
 *                 // options...
 *               />
 *   }}
 *   </GoogleAuth>
 * ```
 */
export declare const GoogleAuthConsumer: React.Consumer<IOAuthState>;
/** @internal */
interface IInnerButtonProps extends IGoogleButton {
    error?: string;
}
/** @internal */
export declare const InnerButton: (props: IInnerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => React.JSX.Element;
/**
 * @example
 * **Quick Start:**
 *
 * First create an options object that implements an {@link  IAuthorizationOptions} type.
 * Check the {@link  IAuthorizationOptions} and {@link  IAuthorizationBase} types for
 * all required properties. Then, pass the options to the {@link GoogleButton} component.
 *
 * ```
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
export declare function GoogleButton(props: TypeGoogleButton): React.JSX.Element;
/**
 *
 * @param setOptions
 * @param options
 * If for example your user updates their email in your app & you redirect them
 * to the login again, Google will by default skip the Google email select screen
 * & log you in with your existing credentials. To stop this happening you can use the following function:
 *
 * ```
 *  setPrompt("select_account");
 * ```
 *
 * Below is an example with `setPrompt` function resetting your
 * ```
 *   const sso_options: IAuthorizationOptions = {
 *      clientId: "<CLIENT_ID>",
 *      redirectUri: `http://localhost:3000/login`,
 *      scopes: ["openid", "profile", "email"],
 *      accessType: "offline",
 *   };
 * ```
 * Then in your login component, it could look like this:
 * ```
 *   <GoogleAuth>
 *   <GoogleAuthConsumer>
 *   {({ responseState, isAuthenticated, setPrompt }: IOAuthState) => {
 *     if (!isAuthenticated) {
 *         // Here we are using Lodash fp to get our prompt value
 *         // passed from the React Router location API e.g:
 *         // history.push({ pathname: "/login", {prompt: "select_account"});
 *         const prompt = fp.get("state.prompt", location);
 *         if (prompt) {
 *            // this will now set sso_option.prompt = "select_account"
 *            // for this login attempt, then the auto login flow will
 *           // continue as normal
 *             setPrompt(prompt);
 *         }
 *         return <StyledGoogleButton>
 *                 <GoogleButton
 *                     defaultStyle={false}
 *                     options={sso_option}
 *                     apiUrl="http://localhost:3000/users/login"
 *                 >Login</GoogleButton>
 *             </StyledGoogleButton>;
 *        } else {
 *             if (responseState?.accessToken && isOAuthLoggedIn()) {
 *                 updateShouldFetch(isOAuthLoggedIn());
 *                 if (staff) {
 *                    return <Redirect to="/staff"/>;
 *                 } else {
 *                     return null;
 *                 }
 *             }
 *            return null;
 *         }
 *          }}
 *      </GoogleAuthConsumer>
 *   </GoogleAuth>
 * ```
 */
export declare function setPrompt(setOptions: Function, options?: IAuthorizationOptions): (promptType: TypePrompt) => void;
/**
 *
 * @param props
 * @constructor
 */
export declare const GoogleAuth: (props: any) => React.JSX.Element;
export {};
