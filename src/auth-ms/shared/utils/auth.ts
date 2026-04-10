
import { Response } from "express";

export const sendAuthResponse = (
  res: Response,
  user: any,
  accessToken: string,
  refreshToken: string,
  clientType: 'web' | 'native'
) => {

    if (clientType === 'native') {
      return { user, accessToken, refreshToken };
    } else {
      // Web: set cookies httpOnly
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user });
    }
};