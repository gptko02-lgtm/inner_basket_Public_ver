import { NextRequest, NextResponse } from 'next/server';
import {
    getCurriculums,
    getCurriculumById,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
} from '@/lib/data';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categoryId = searchParams.get('categoryId');
        const id = searchParams.get('id');

        if (id) {
            const curriculum = await getCurriculumById(id);
            if (!curriculum) {
                return NextResponse.json(
                    { error: '커리큘럼을 찾을 수 없습니다' },
                    { status: 404 }
                );
            }
            return NextResponse.json(curriculum);
        }

        const curriculums = await getCurriculums(categoryId || undefined);
        return NextResponse.json(curriculums);
    } catch (error) {
        return NextResponse.json(
            { error: '커리큘럼을 불러오는데 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newCurriculum = await createCurriculum(data);
        return NextResponse.json(newCurriculum, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: '커리큘럼 생성에 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID가 필요합니다' },
                { status: 400 }
            );
        }

        const data = await request.json();
        const updated = await updateCurriculum(id, data);

        if (!updated) {
            return NextResponse.json(
                { error: '커리큘럼을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { error: '커리큘럼 수정에 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID가 필요합니다' },
                { status: 400 }
            );
        }

        const success = await deleteCurriculum(id);

        if (!success) {
            return NextResponse.json(
                { error: '커리큘럼을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: '커리큘럼 삭제에 실패했습니다' },
            { status: 500 }
        );
    }
}
