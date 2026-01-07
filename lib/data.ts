import { supabase } from './supabase';

// 타입 정의
export interface Category {
    id: string;
    name: string;
}

export interface ContentItem {
    id: string;
    details: string;
    duration?: number;
    type?: '실습' | '시연' | '이론';
}

export interface CurriculumPart {
    id: string;
    title: string;
    items: ContentItem[];
}

export interface CurriculumItem {
    id: string;
    title: string;
    learningObjectives: string;
    duration: number; // 분 단위
    categoryId: string;
    items: ContentItem[];
}

export interface Curriculum {
    id: string;
    title: string;
    duration: number; // 분 단위
    categoryId: string;
}

// 카테고리 CRUD
export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data.map(cat => ({
        id: cat.id,
        name: cat.name,
    }));
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return undefined;

    return {
        id: data.id,
        name: data.name,
    };
}

export async function createCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name: name.trim() }])
        .select()
        .single();

    if (error || !data) {
        throw new Error('Failed to create category');
    }

    return {
        id: data.id,
        name: data.name,
    };
}

export async function updateCategory(id: string, name: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        name: data.name,
    };
}

export async function deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    return !error;
}

// 커리큘럼 CRUD
export async function getCurriculums(categoryId?: string): Promise<Curriculum[]> {
    let query = supabase
        .from('curriculums')
        .select('*')
        .order('created_at', { ascending: true });

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching curriculums:', error);
        return [];
    }

    return data.map(curr => ({
        id: curr.id,
        title: curr.title,
        duration: curr.duration,
        categoryId: curr.category_id,
    }));
}

export async function getCurriculumById(id: string): Promise<Curriculum | undefined> {
    const { data, error } = await supabase
        .from('curriculums')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return undefined;

    return {
        id: data.id,
        title: data.title,
        duration: data.duration,
        categoryId: data.category_id,
    };
}

export async function createCurriculum(curriculum: {
    title: string;
    duration: number;
    categoryId: string;
    learningObjectives?: string;
    parts?: CurriculumPart[];
}): Promise<Curriculum> {
    // Create curriculum
    const { data: curriculumData, error: curriculumError } = await supabase
        .from('curriculums')
        .insert([{
            title: curriculum.title,
            duration: curriculum.duration,
            category_id: curriculum.categoryId,
        }])
        .select()
        .single();

    if (curriculumError || !curriculumData) {
        throw new Error('Failed to create curriculum');
    }

    // Create curriculum_items if learningObjectives or parts exist
    if (curriculum.learningObjectives || (curriculum.parts && curriculum.parts.length > 0)) {
        const { error: itemsError } = await supabase
            .from('curriculum_items')
            .insert([{
                curriculum_id: curriculumData.id,
                title: curriculum.title,
                learning_objectives: curriculum.learningObjectives || '',
                duration: curriculum.duration,
                category_id: curriculum.categoryId,
                items: { parts: curriculum.parts || [] },
            }]);

        if (itemsError) {
            console.error('Failed to create curriculum items:', itemsError);
        }
    }

    return {
        id: curriculumData.id,
        title: curriculumData.title,
        duration: curriculumData.duration,
        categoryId: curriculumData.category_id,
    };
}

export async function updateCurriculum(
    id: string,
    updateData: {
        title?: string;
        duration?: number;
        categoryId?: string;
        learningObjectives?: string;
        parts?: CurriculumPart[];
    }
): Promise<Curriculum | null> {
    // Update curriculum
    const dbData: any = {};
    if (updateData.title !== undefined) dbData.title = updateData.title;
    if (updateData.duration !== undefined) dbData.duration = updateData.duration;
    if (updateData.categoryId !== undefined) dbData.category_id = updateData.categoryId;

    const { data, error } = await supabase
        .from('curriculums')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) return null;

    // Update or create curriculum_items
    if (updateData.learningObjectives !== undefined || updateData.parts !== undefined) {
        // Check if curriculum_items exists
        const { data: existingItems } = await supabase
            .from('curriculum_items')
            .select('id')
            .eq('curriculum_id', id)
            .single();

        const itemsData: any = {};
        if (updateData.learningObjectives !== undefined) {
            itemsData.learning_objectives = updateData.learningObjectives;
        }
        if (updateData.parts !== undefined) {
            itemsData.items = { parts: updateData.parts };
        }
        if (updateData.title !== undefined) {
            itemsData.title = updateData.title;
        }
        if (updateData.duration !== undefined) {
            itemsData.duration = updateData.duration;
        }
        if (updateData.categoryId !== undefined) {
            itemsData.category_id = updateData.categoryId;
        }

        if (existingItems) {
            // Update existing
            await supabase
                .from('curriculum_items')
                .update(itemsData)
                .eq('curriculum_id', id);
        } else {
            // Create new
            await supabase
                .from('curriculum_items')
                .insert([{
                    curriculum_id: id,
                    title: updateData.title || data.title,
                    learning_objectives: updateData.learningObjectives || '',
                    duration: updateData.duration || data.duration,
                    category_id: updateData.categoryId || data.category_id,
                    items: { parts: updateData.parts || [] },
                }]);
        }
    }

    return {
        id: data.id,
        title: data.title,
        duration: data.duration,
        categoryId: data.category_id,
    };
}

export async function deleteCurriculum(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('curriculums')
        .delete()
        .eq('id', id);

    return !error;
}

// 커리큘럼 상세 항목 CRUD
export async function getCurriculumItemById(id: string): Promise<CurriculumItem | undefined> {
    const { data, error } = await supabase
        .from('curriculum_items')
        .select('*')
        .eq('curriculum_id', id)
        .single();

    if (error || !data) return undefined;

    return {
        id: data.curriculum_id,
        title: data.title,
        learningObjectives: data.learning_objectives || '',
        duration: data.duration,
        categoryId: data.category_id,
        items: data.items || [],
    };
}

export async function createCurriculumItem(item: Omit<CurriculumItem, 'id'>): Promise<CurriculumItem> {
    // First create the curriculum
    const curriculum = await createCurriculum({
        title: item.title,
        duration: item.duration,
        categoryId: item.categoryId,
    });

    // Then create the curriculum item
    const { data, error } = await supabase
        .from('curriculum_items')
        .insert([{
            curriculum_id: curriculum.id,
            title: item.title,
            learning_objectives: item.learningObjectives,
            duration: item.duration,
            category_id: item.categoryId,
            items: item.items,
        }])
        .select()
        .single();

    if (error || !data) {
        throw new Error('Failed to create curriculum item');
    }

    return {
        id: data.curriculum_id,
        title: data.title,
        learningObjectives: data.learning_objectives || '',
        duration: data.duration,
        categoryId: data.category_id,
        items: data.items || [],
    };
}

export async function updateCurriculumItem(id: string, updateData: Partial<CurriculumItem>): Promise<CurriculumItem | null> {
    const dbData: any = {};
    if (updateData.title !== undefined) dbData.title = updateData.title;
    if (updateData.learningObjectives !== undefined) dbData.learning_objectives = updateData.learningObjectives;
    if (updateData.duration !== undefined) dbData.duration = updateData.duration;
    if (updateData.categoryId !== undefined) dbData.category_id = updateData.categoryId;
    if (updateData.items !== undefined) dbData.items = updateData.items;

    const { data, error } = await supabase
        .from('curriculum_items')
        .update(dbData)
        .eq('curriculum_id', id)
        .select()
        .single();

    if (error || !data) return null;

    // Also update the curriculum if title, duration, or categoryId changed
    if (updateData.title || updateData.duration || updateData.categoryId) {
        await updateCurriculum(id, {
            title: updateData.title,
            duration: updateData.duration,
            categoryId: updateData.categoryId,
        });
    }

    return {
        id: data.curriculum_id,
        title: data.title,
        learningObjectives: data.learning_objectives || '',
        duration: data.duration,
        categoryId: data.category_id,
        items: data.items || [],
    };
}

// 콘텐츠 라이브러리 CRUD
export async function getContentLibrary(searchTerm?: string): Promise<ContentItem[]> {
    let query = supabase
        .from('content_library')
        .select('id, details, duration, type')
        .order('created_at', { ascending: false });

    if (searchTerm) {
        query = query.ilike('details', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching content library:', error);
        return [];
    }

    return data.map(item => ({
        id: item.id,
        details: item.details,
        duration: item.duration || 0,
        type: item.type as '실습' | '시연' | '이론' || '시연'
    }));
}

export async function createContentItem(item: Omit<ContentItem, 'id'>): Promise<ContentItem | null> {
    const { data, error } = await supabase
        .from('content_library')
        .insert([{
            details: item.details,
            duration: item.duration || 0,
            type: item.type || '시연'
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating content item:', error);
        return null;
    }

    return {
        id: data.id,
        details: data.details,
        duration: data.duration,
        type: data.type
    };
}

export async function updateContentItem(id: string, item: Partial<ContentItem>): Promise<ContentItem | null> {
    const updates: any = {};
    if (item.details !== undefined) updates.details = item.details;
    if (item.duration !== undefined) updates.duration = item.duration;
    if (item.type !== undefined) updates.type = item.type;

    const { data, error } = await supabase
        .from('content_library')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating content item:', error);
        return null;
    }

    return {
        id: data.id,
        details: data.details,
        duration: data.duration,
        type: data.type
    };
}

export async function deleteContentItem(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('content_library')
        .delete()
        .eq('id', id);

    return !error;
}
