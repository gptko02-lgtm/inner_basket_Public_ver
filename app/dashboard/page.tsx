'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryTabs from '@/components/CategoryTabs';
import CurriculumCard from '@/components/CurriculumCard';
import CategoryManager from '@/components/CategoryManager';
import ContentLibraryManager from '@/components/ContentLibraryManager';
import { Category, Curriculum } from '@/lib/data';
import { exportCurriculumToExcel } from '@/lib/exportExcel';
import { exportCurriculumToPdf } from '@/lib/exportPdf';
import { exportCurriculumToHtml } from '@/lib/exportHtml';

export default function DashboardPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [isContentLibraryManagerOpen, setIsContentLibraryManagerOpen] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (activeCategory) {
            loadCurriculums(activeCategory);
        }
    }, [activeCategory]);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
            if (data.length > 0) {
                setActiveCategory(data[0].id);
            }
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCurriculums = async (categoryId: string) => {
        try {
            const res = await fetch(`/api/curriculums?categoryId=${categoryId}`);
            const data = await res.json();
            setCurriculums(data);
        } catch (error) {
            console.error('커리큘럼 로드 실패:', error);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/builder?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('이 커리큘럼을 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/curriculums?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                loadCurriculums(activeCategory);
            }
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제 중 오류가 발생했습니다');
        }
    };

    const handleExport = async (id: string) => {
        try {
            // Get curriculum basic info
            const curriculumRes = await fetch(`/api/curriculums?id=${id}`);
            const curriculum = await curriculumRes.json();

            if (!curriculum) {
                alert('커리큘럼을 찾을 수 없습니다.');
                return;
            }

            // Get curriculum_items data
            const itemsRes = await fetch(`/api/curriculum-items?curriculumId=${id}`);
            const itemsData = await itemsRes.json();

            // Format data for Excel export
            let parts = [];

            if (itemsData?.items?.parts && Array.isArray(itemsData.items.parts)) {
                // New format: parts array
                parts = itemsData.items.parts;
            } else if (itemsData?.items && Array.isArray(itemsData.items)) {
                // Old format: flat items array - convert to single part
                parts = [{
                    id: 'default',
                    title: '기본',
                    items: itemsData.items
                }];
            }

            // Export to Excel
            await exportCurriculumToExcel({
                title: curriculum.title,
                learningObjectives: itemsData?.learningObjectives || '',
                duration: curriculum.duration,
                parts: parts,
            });

        } catch (error) {
            console.error('엑셀 내보내기 실패:', error);
            alert('엑셀 파일 생성에 실패했습니다.');
        }
    };

    const handleExportPdf = async (id: string) => {
        try {
            console.log('🔍 PDF Export - Curriculum ID:', id);

            // Get curriculum basic info
            const curriculumRes = await fetch(`/api/curriculums?id=${id}`);
            const curriculum = await curriculumRes.json();

            console.log('📄 Curriculum data:', curriculum);
            console.log('📝 Curriculum title:', curriculum.title);

            if (!curriculum) {
                alert('커리큘럼을 찾을 수 없습니다.');
                return;
            }

            // Get curriculum_items data
            const itemsRes = await fetch(`/api/curriculum-items?curriculumId=${id}`);
            const itemsData = await itemsRes.json();

            // Format data for PDF export
            let parts = [];

            if (itemsData?.items?.parts && Array.isArray(itemsData.items.parts)) {
                // New format: parts array
                parts = itemsData.items.parts;
            } else if (itemsData?.items && Array.isArray(itemsData.items)) {
                // Old format: flat items array - convert to single part
                parts = [{
                    id: 'default',
                    title: '기본',
                    items: itemsData.items
                }];
            }

            const exportData = {
                title: curriculum.title,
                learningObjectives: itemsData?.learningObjectives || '',
                duration: curriculum.duration,
                parts: parts,
            };

            console.log('🎯 Export data being sent:', exportData);

            // Export to PDF
            await exportCurriculumToPdf(exportData);

        } catch (error) {
            console.error('PDF 내보내기 실패:', error);
            alert('PDF 파일 생성에 실패했습니다.');
        }
    };

    const handleExportHtml = async (id: string) => {
        try {
            // Get curriculum basic info
            const curriculumRes = await fetch(`/api/curriculums?id=${id}`);
            const curriculum = await curriculumRes.json();

            if (!curriculum) {
                alert('커리큘럼을 찾을 수 없습니다.');
                return;
            }

            // Get curriculum_items data
            const itemsRes = await fetch(`/api/curriculum-items?curriculumId=${id}`);
            const itemsData = await itemsRes.json();

            // Format data for HTML export
            let parts = [];

            if (itemsData?.items?.parts && Array.isArray(itemsData.items.parts)) {
                // New format: parts array
                parts = itemsData.items.parts;
            } else if (itemsData?.items && Array.isArray(itemsData.items)) {
                // Old format: flat items array - convert to single part
                parts = [{
                    id: 'default',
                    title: '기본',
                    items: itemsData.items
                }];
            }

            // Export to HTML
            exportCurriculumToHtml({
                title: curriculum.title,
                learningObjectives: itemsData?.learningObjectives || '',
                duration: curriculum.duration,
                parts: parts,
            });

        } catch (error) {
            console.error('HTML 내보내기 실패:', error);
            alert('HTML 파일 생성에 실패했습니다.');
        }
    };



    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-primary text-xl">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl shadow-md border-b border-primary-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">커리큘럼 관리 시스템</h1>
                        <p className="text-sm text-gray-600">AI 교육 과정 관리</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCategoryManagerOpen(true)}
                            className="px-6 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            ⚙️ 카테고리 관리
                        </button>
                        <button
                            onClick={() => setIsContentLibraryManagerOpen(true)}
                            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            📚 콘텐츠 라이브러리
                        </button>
                        <button
                            onClick={() => router.push('/builder')}
                            className="px-6 py-2.5 rounded-xl bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            + 새 커리큘럼
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Category Tabs */}
                <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                    <CategoryTabs
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                </div>

                {/* Curriculum List */}
                <div className="space-y-4">
                    {curriculums.length > 0 ? (
                        curriculums.map((curriculum) => (
                            <CurriculumCard
                                key={curriculum.id}
                                curriculum={curriculum}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onExport={handleExport}
                                onExportPdf={handleExportPdf}
                                onExportHtml={handleExportHtml}
                            />
                        ))
                    ) : (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center shadow-md">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                커리큘럼이 없습니다
                            </h3>
                            <p className="text-gray-500 mb-6">
                                새 커리큘럼을 추가하여 시작하세요
                            </p>
                            <button
                                onClick={() => router.push('/builder')}
                                className="px-6 py-3 rounded-xl bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            >
                                + 커리큘럼 추가하기
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Category Manager Modal */}
            <CategoryManager
                isOpen={isCategoryManagerOpen}
                onClose={() => setIsCategoryManagerOpen(false)}
                onCategoriesChanged={loadCategories}
            />

            {/* Content Library Manager Modal */}
            <ContentLibraryManager
                isOpen={isContentLibraryManagerOpen}
                onClose={() => setIsContentLibraryManagerOpen(false)}
                onContentsChanged={() => { }} // 콘텐츠가 변경되어도 대시보드는 업데이트 불필요
            />
        </div>
    );
}
