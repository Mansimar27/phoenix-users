import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.util";
import { RefreshToken } from "../models/refreshToken.model";

export const authService = {
  async createTokens(userId: string) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await RefreshToken.create({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  },

  async rotateRefreshToken(oldToken: string) {
    const stored = await RefreshToken.findOne({ token: oldToken });
    if (!stored) throw new Error("Invalid refresh token");

    // verify expired?
    let decoded: any;
    try {
      decoded = verifyToken(oldToken);
    } catch (err) {
      await stored.deleteOne();
      throw new Error("Expired refresh token");
    }

    const { accessToken, refreshToken } = await this.createTokens(
      decoded.userId
    );

    // remove old token
    await stored.deleteOne();

    return { accessToken, refreshToken };
  },
};
