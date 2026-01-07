import { NextRequest, NextResponse } from 'next/server';
import {
    getContentLibrary,
    createContentItem,
    updateContentItem,
    deleteContentItem,
} from '@/lib/data';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        const items = await getContentLibrary(query || undefined);
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { error: '콘텐츠를 불러오는데 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newItem = await createContentItem(data);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: '콘텐츠 생성에 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });
        }

        const data = await request.json();
        const updated = await updateContentItem(id, data);

        if (!updated) {
            return NextResponse.json(
                { error: '콘텐츠를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { error: '콘텐츠 수정에 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });
        }

        const success = await deleteContentItem(id);

        if (!success) {
            return NextResponse.json(
                { error: '콘텐츠를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: '콘텐츠 삭제에 실패했습니다' },
            { status: 500 }
        );
    }
}
