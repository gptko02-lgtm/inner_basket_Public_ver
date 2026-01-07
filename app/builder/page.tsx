'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, ContentItem, CurriculumPart } from '@/lib/data';
import CurriculumEditor from '@/components/CurriculumEditor';
import ContentLibrary from '@/components/ContentLibrary';

export default function BuilderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [formData, setFormData] = useState({
        title: '',
        learningObjectives: '',
        duration: 120,
        categoryId: '',
    });
    const [parts, setParts] = useState<CurriculumPart[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentEditingPartId, setCurrentEditingPartId] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
        if (editId) {
            loadCurriculum(editId);
        }
    }, [editId]);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        }
    };

    const loadCurriculum = async (id: string) => {
        try {
            // Get basic curriculum info
            const curriculumRes = await fetch(`/api/curriculums?id=${id}`);
            const curriculum = await curriculumRes.json();

            if (curriculum) {
                // Get curriculum_items data
                const itemsRes = await fetch(`/api/curriculum-items?curriculumId=${id}`);
                const itemsData = await itemsRes.json();

                setFormData({
                    title: curriculum.title,
                    learningObjectives: itemsData?.learningObjectives || '',
                    duration: curriculum.duration,
                    categoryId: curriculum.categoryId,
                });

                // Handle parts structure with migration from old format
                if (itemsData?.items?.parts && Array.isArray(itemsData.items.parts)) {
                    // New format: parts array
                    const loadedParts = itemsData.items.parts.map((part: any) => ({
                        id: part.id || crypto.randomUUID(),
                        title: part.title || '기본',
                        items: part.items.map((item: any) => ({
                            id: crypto.randomUUID(),
                            details: item.details,
                            duration: item.duration || 0,
                        })),
                    }));
                    setParts(loadedParts);
                } else if (itemsData?.items && Array.isArray(itemsData.items)) {
                    // Old format: flat items array - migrate to single part
                    const defaultPart: CurriculumPart = {
                        id: crypto.randomUUID(),
                        title: '기본',
                        items: itemsData.items.map((item: any) => ({
                            id: crypto.randomUUID(),
                            details: item.details,
                            duration: item.duration || 0,
                        })),
                    };
                    setParts([defaultPart]);
                } else {
                    setParts([]);
                }
            }
        } catch (error) {
            console.error('커리큘럼 로드 실패:', error);
        }
    };

    const handleAddPart = () => {
        const newPart: CurriculumPart = {
            id: crypto.randomUUID(),
            title: '새 파트',
            items: [],
        };
        setParts([...parts, newPart]);
    };

    const handleUpdatePartTitle = (partId: string, newTitle: string) => {
        setParts(parts.map(part =>
            part.id === partId ? { ...part, title: newTitle } : part
        ));
    };

    const handleDeletePart = (partId: string) => {
        if (confirm('이 파트를 삭제하시겠습니까?')) {
            setParts(parts.filter(part => part.id !== partId));
        }
    };

    const handleAddItemToPart = (partId: string, item: ContentItem) => {
        // Check if item with same details already exists in this part
        const existingPart = parts.find(p => p.id === partId);
        if (existingPart) {
            const isDuplicate = existingPart.items.some(existingItem =>
                existingItem.details === item.details
            );

            if (isDuplicate) {
                alert('이미 추가된 항목입니다.');
                return;
            }
        }

        setParts(parts.map(part => {
            if (part.id === partId) {
                const newItem = { ...item, id: crypto.randomUUID() };
                return { ...part, items: [...part.items, newItem] };
            }
            return part;
        }));
    };

    const handleRemoveItemFromPart = (partId: string, itemId: string) => {
        setParts(parts.map(part => {
            if (part.id === partId) {
                return { ...part, items: part.items.filter(item => item.id !== itemId) };
            }
            return part;
        }));
    };

    const handleUpdateItemType = (partId: string, itemId: string, newType: '실습' | '시연') => {
        setParts(parts.map(part => {
            if (part.id === partId) {
                return {
                    ...part,
                    items: part.items.map(item =>
                        item.id === itemId ? { ...item, type: newType } : item
                    )
                };
            }
            return part;
        }));
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.categoryId) {
            alert('필수 항목을 입력하세요');
            return;
        }

        try {
            const curriculumData = {
                title: formData.title,
                duration: formData.duration,
                categoryId: formData.categoryId,
                learningObjectives: formData.learningObjectives,
                parts: parts,
            };

            if (editId) {
                // Update existing curriculum
                const res = await fetch(`/api/curriculums?id=${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(curriculumData),
                });

                if (res.ok) {
                    alert('커리큘럼이 수정되었습니다');
                    router.push('/dashboard');
                } else {
                    const error = await res.json();
                    console.error('Update error:', error);
                    alert('수정에 실패했습니다: ' + (error.error || '알 수 없는 오류'));
                }
            } else {
                // Create new curriculum
                const res = await fetch('/api/curriculums', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(curriculumData),
                });

                if (res.ok) {
                    alert('커리큘럼이 생성되었습니다');
                    router.push('/dashboard');
                } else {
                    const error = await res.json();
                    console.error('Create error:', error);
                    alert('생성에 실패했습니다: ' + (error.error || '알 수 없는 오류'));
                }
            }
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류가 발생했습니다');
        }
    };

    const handleCancel = () => {
        if (confirm('변경사항이 저장되지 않습니다. 취소하시겠습니까?')) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl shadow-md border-b border-primary-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="뒤로 가기"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                커리큘럼 관리 시스템
                            </h1>
                            <p className="text-sm text-gray-600">AI 교육 과정 관리</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-2 gap-6">
                    {/* Left: Curriculum Editor */}
                    <CurriculumEditor
                        title={formData.title}
                        learningObjectives={formData.learningObjectives}
                        duration={formData.duration}
                        categoryId={formData.categoryId}
                        parts={parts}
                        onTitleChange={(title) => setFormData({ ...formData, title })}
                        onObjectivesChange={(learningObjectives) =>
                            setFormData({ ...formData, learningObjectives })
                        }
                        onDurationChange={(duration) => setFormData({ ...formData, duration })}
                        onCategoryChange={(categoryId) => setFormData({ ...formData, categoryId })}
                        onAddPart={handleAddPart}
                        onUpdatePartTitle={handleUpdatePartTitle}
                        onDeletePart={handleDeletePart}
                        onAddItemToPart={handleAddItemToPart}
                        onRemoveItemFromPart={handleRemoveItemFromPart}
                        onEditingPartChange={setCurrentEditingPartId}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        categories={categories}
                    />

                    {/* Right: Content Library - Sticky */}
                    <div className="sticky top-8 self-start h-[calc(100vh-8rem)]">
                        <ContentLibrary
                            usedItemDetails={parts.flatMap(part => part.items.map(item => item.details))}
                            onAddItem={(item) => {
                                // Add to currently editing part, or last part, or create new part
                                let targetPartId = currentEditingPartId;

                                if (!targetPartId) {
                                    // If no part is being edited, use the last part
                                    if (parts.length === 0) {
                                        handleAddPart();
                                    }
                                    targetPartId = parts[parts.length - 1]?.id;
                                }

                                if (targetPartId) {
                                    handleAddItemToPart(targetPartId, {
                                        ...item,
                                        type: '시연' // Default to demo when adding from library
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
