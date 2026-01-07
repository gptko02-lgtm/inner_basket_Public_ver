import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // 자격 증명 검증
        if (!validateCredentials(username, password)) {
            return NextResponse.json(
                { error: '아이디 또는 비밀번호가 올바르지 않습니다' },
                { status: 401 }
            );
        }

        // 세션 쿠키 설정
        await setSessionCookie(username);

        return NextResponse.json(
            { success: true, message: '로그인 성공' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
