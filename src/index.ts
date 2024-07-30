import type { Request } from "express";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import type {
  StrategyOptions,
  VerifyFunction as OAuth2VerifyFunction,
} from "passport-oauth2";

export interface VimeoUser {
  uri: string;
  id: string;
  name: string;
  displayName: string;
  email: string;
  link: string;
  accessToken: string;
}

export interface VimeoToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in?: number;
}

export type VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  profile: VimeoUser,
  verified: (error: Error | null, user?: VimeoUser, info?: unknown) => void
) => void;

export type DoneCallback = (
  error: Error | null,
  user?: VimeoUser,
  info?: unknown
) => void;

export interface VimeoStrategyOptions
  extends Omit<StrategyOptions, "authorizationURL" | "tokenURL"> {
  scope?: string[];
  authorizationURL?: string;
  tokenURL?: string;
  state?: string;
  grant_type?: string;
}

const VIMEO_AUTHORIZE_URL = "https://api.vimeo.com/oauth/authorize";
const VIMEO_TOKEN_URL = "https://api.vimeo.com/oauth/access_token";

export class Strategy extends OAuth2Strategy {
  name: string;

  constructor(options: VimeoStrategyOptions, verify: VerifyFunction) {
    const scopeSeparator = " ";
    options.authorizationURL = options.authorizationURL || VIMEO_AUTHORIZE_URL;
    options.tokenURL = options.tokenURL || VIMEO_TOKEN_URL;
    options.scopeSeparator = options.scopeSeparator || scopeSeparator;
    options.grant_type = "authorization_code";
    super(options as StrategyOptions, verify as OAuth2VerifyFunction);
    this.name = "vimeo";
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  authenticate(req: Request, options?: VimeoStrategyOptions): void {
    options = options || ({} as VimeoStrategyOptions);
    if (options?.state) {
      options.state = options.state || "";
    }
    super.authenticate(req, options);
  }

  userProfile(
    accessToken: string,
    done: (error: Error | null, profile?: VimeoUser) => void
  ): void {
    this._oauth2.get("https://api.vimeo.com/me", accessToken, (err, body) => {
      if (err) {
        return done(new Error(`Failed to fetch user profile`));
      }
      try {
        const profile = JSON.parse(body as string) as VimeoUser;
        profile.accessToken = accessToken;
        profile.displayName = profile.name;
        profile.id = profile.uri.replace("/users/", "");
        done(null, profile);
      } catch (e) {
        done(e instanceof Error ? e : new Error('Failed to parse user profile'));
      }
    });
  }
}

export default Strategy;
