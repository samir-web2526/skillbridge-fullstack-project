import bcrypt from 'bcrypt';
import { prisma } from '../../../lib/prisma';
import { envVars } from '../../../config/env';
import { jwtUtils } from '../../utils/jwt';
import { Secret } from 'jsonwebtoken';
import { ILoginPayload, IRegisterPayload } from './auth.interface';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';

const register = async (payload: IRegisterPayload) => {
    const { email, password, name, phone, image } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(status.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUNDS));

    const result = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone: phone || null,
            image: image || null
        },
    });

    const { password: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
};

const login = async (payload: ILoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(status.FORBIDDEN, 'Invalid password');
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        envVars.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN as any }
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        envVars.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN as any }
    );

    return {
        accessToken,
        refreshToken,
    };
};

const refreshToken = async (token: string) => {
    let verifiedToken = null;
    try {
        verifiedToken = jwtUtils.verifyToken(token, envVars.REFRESH_TOKEN_SECRET as Secret);
    } catch (err) {
        throw new AppError(status.FORBIDDEN, 'Invalid Refresh Token');
    }

    const { id } = verifiedToken;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        envVars.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN as any }
    );

    return {
        accessToken,
    };
};

export const AuthService = {
    register,
    login,
    refreshToken,
};
