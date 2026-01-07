import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const curriculumId = searchParams.get('curriculumId');

        if (!curriculumId) {
            return NextResponse.json(
                { error: 'Curriculum ID is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('curriculum_items')
            .select('*')
            .eq('curriculum_id', curriculumId)
            .single();

        if (error) {
            console.error('Error fetching curriculum items:', error);
            return NextResponse.json(
                { learningObjectives: '', items: [] },
                { status: 200 }
            );
        }

        return NextResponse.json({
            learningObjectives: data?.learning_objectives || '',
            items: data?.items || {}, // Return full items object which may contain parts
        });
    } catch (error) {
        console.error('Error in curriculum-items API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch curriculum items' },
            { status: 500 }
        );
    }
}
