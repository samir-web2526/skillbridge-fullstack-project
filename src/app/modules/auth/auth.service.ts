import bcrypt from 'bcrypt';
import { prisma } from '../../../lib/prisma';
import { envVars } from '../../../config/env';
import { jwtUtils } from '../../utils/jwt';
import { Secret } from 'jsonwebtoken';
import { ILoginPayload, IRegisterPayload } from './auth.interface';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';
import { Role, UserStatus, Prisma } from '../../../generated';

const register = async (payload: IRegisterPayload) => {
    const { email, password, name, phone, image, role, bio, hourlyRate, experience, categoryId, gender, dateOfBirth, address, class: studentClass, group: studentGroup } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(status.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUNDS));

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone: phone || null,
                image: image || null,
                role: role as Role,
                status: role === Role.TUTOR ? UserStatus.PENDING : UserStatus.ACTIVE,
            },
        });

        if (role === Role.TUTOR) {
            if (!hourlyRate || !experience || !categoryId) {
                throw new AppError(status.BAD_REQUEST, 'Tutor profile information is missing');
            }

            await tx.tutorProfile.create({
                data: {
                    userId: user.id,
                    bio: bio ?? null,
                    gender: gender ?? null,
                    hourlyRate: new Prisma.Decimal(hourlyRate),
                    experience,
                    categoryId,
                },
            });
        }

        if (role === Role.STUDENT) {
            await tx.studentProfile.create({
                data: {
                    userId: user.id,
                    gender: gender ?? null,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    address: address ?? null,
                    class: studentClass ?? null,
                    group: studentGroup ?? null,
                },
            });
        }

        return user;
    });

    const { password: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
};

const login = async (payload: ILoginPayload) => {
    const { email, password } = payload;
    console.log("Login attempt for email:", email);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    if (user.status === UserStatus.BANNED) {
        throw new AppError(status.FORBIDDEN, 'Your account has been banned');
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
    const verifyResponse = jwtUtils.verifyToken(token, envVars.REFRESH_TOKEN_SECRET as Secret);

    if (!verifyResponse.success) {
        throw new AppError(status.FORBIDDEN, 'Invalid Refresh Token');
    }

    const { id } = verifyResponse.data!;

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
