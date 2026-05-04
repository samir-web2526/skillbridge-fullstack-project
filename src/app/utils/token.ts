import { Response } from "express";
import { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import { CookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";

const getAccessToken = (payload: JwtPayload) => {
    const options: SignOptions = {
        expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN as any
    };
    const accessToken = jwtUtils.createToken(
        payload,
        envVars.ACCESS_TOKEN_SECRET as Secret,
        options
    );

    return accessToken;
}

const getRefreshToken = (payload: JwtPayload) => {
    const options: SignOptions = {
        expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN as any
    };
    const refreshToken = jwtUtils.createToken(
        payload,
        envVars.REFRESH_TOKEN_SECRET as Secret,
        options
    );
    return refreshToken;
}

const setAccessTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: "lax",
        path: '/',
        maxAge: 60 * 60 * 24 * 1000,
    });
}

const setRefreshTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, 'refreshToken', token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: "lax",
        path: '/',
        maxAge: 60 * 60 * 24 * 1000 * 7,
    });
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
}
