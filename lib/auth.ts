import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const HARDCODED_CREDENTIALS = {
    username: 'gptkorea01',
    password: 'gpt1122!',
};

export interface Session {
    username: string;
    exp: number;
}

// 자격 증명 검증
export function validateCredentials(username: string, password: string): boolean {
    return (
        username === HARDCODED_CREDENTIALS.username &&
        password === HARDCODED_CREDENTIALS.password
    );
}

// JWT 토큰 생성
export async function createToken(username: string): Promise<string> {
    const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);

    return token;
}

// JWT 토큰 검증
export async function verifyToken(token: string): Promise<Session | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return {
            username: payload.username as string,
            exp: payload.exp as number,
        };
    } catch (error) {
        return null;
    }
}

// 세션 쿠키 설정
export async function setSessionCookie(username: string) {
    const token = await createToken(username);
    const cookieStore = await cookies();

    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
}

// 세션 쿠키 가져오기
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session');

    if (!token) return null;

    return await verifyToken(token.value);
}

// 세션 쿠키 삭제
export async function deleteSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
