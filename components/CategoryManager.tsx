'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/data';

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoriesChanged: () => void;
}

export default function CategoryManager({
    isOpen,
    onClose,
    onCategoriesChanged,
}: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        }
    };

    const handleAdd = async () => {
        if (!newCategoryName.trim()) {
            setError('카테고리 이름을 입력하세요');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (res.ok) {
                setNewCategoryName('');
                await loadCategories();
                onCategoriesChanged();
            } else {
                const data = await res.json();
                setError(data.error || '카테고리 추가 실패');
            }
        } catch (error) {
            setError('카테고리 추가 중 오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setEditingName(category.name);
        setError('');
    };

    const handleSaveEdit = async (id: string) => {
        if (!editingName.trim()) {
            setError('카테고리 이름을 입력하세요');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/categories?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingName }),
            });

            if (res.ok) {
                setEditingId(null);
                setEditingName('');
                await loadCategories();
                onCategoriesChanged();
            } else {
                const data = await res.json();
                setError(data.error || '카테고리 수정 실패');
            }
        } catch (error) {
            setError('카테고리 수정 중 오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?\n\n⚠️ 이 카테고리에 속한 모든 커리큘럼도 함께 삭제됩니다.`)) return;

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/categories?id=${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                await loadCategories();
                onCategoriesChanged();
            } else {
                setError(data.error || '카테고리 삭제 실패');
            }
        } catch (error) {
            setError('카테고리 삭제 중 오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">카테고리 관리</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="닫기"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Add New Category */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            새 카테고리 추가
                        </h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isLoading) {
                                        handleAdd();
                                    }
                                }}
                                placeholder="카테고리 이름 입력"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAdd}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                추가
                            </button>
                        </div>
                    </div>

                    {/* Categories List */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            카테고리 목록 ({categories.length})
                        </h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#00A9BB] transition-all"
                                >
                                    {editingId === category.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && !isLoading) {
                                                        handleSaveEdit(category.id);
                                                    } else if (e.key === 'Escape') {
                                                        handleCancelEdit();
                                                    }
                                                }}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none text-gray-900"
                                                disabled={isLoading}
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSaveEdit(category.id)}
                                                disabled={isLoading}
                                                className="px-4 py-2 rounded-lg bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold text-sm transition-all disabled:opacity-50"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                disabled={isLoading}
                                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm transition-all disabled:opacity-50"
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1 text-gray-800 font-medium">
                                                {category.name}
                                            </div>
                                            <button
                                                onClick={() => handleEdit(category)}
                                                disabled={isLoading}
                                                className="p-2 rounded-lg bg-[#00A9BB] text-white hover:bg-[#008796] transition-all duration-200 disabled:opacity-50"
                                                title="수정"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                disabled={isLoading}
                                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                                                title="삭제"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-all duration-200"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
