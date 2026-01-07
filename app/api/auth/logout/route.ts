import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth';

export async function POST() {
    try {
        // 세션 쿠키 삭제
        await deleteSessionCookie();

        return NextResponse.json(
            { success: true, message: '로그아웃 성공' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: '로그아웃 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
