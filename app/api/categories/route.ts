import { NextRequest, NextResponse } from 'next/server';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/lib/data';

export async function GET() {
    try {
        const categories = await getCategories();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: '카테고리를 불러오는데 실패했습니다' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: '카테고리 이름을 입력하세요' },
                { status: 400 }
            );
        }

        const newCategory = await createCategory(name);
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: '카테고리 생성에 실패했습니다' },
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

        const { name } = await request.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: '카테고리 이름을 입력하세요' },
                { status: 400 }
            );
        }

        const updated = await updateCategory(id, name);

        if (!updated) {
            return NextResponse.json(
                { error: '카테고리를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { error: '카테고리 수정에 실패했습니다' },
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

        const success = await deleteCategory(id);

        if (!success) {
            return NextResponse.json(
                { error: '카테고리를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: '카테고리 삭제에 실패했습니다' },
            { status: 500 }
        );
    }
}
