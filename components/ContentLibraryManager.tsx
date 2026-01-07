'use client';

import { useState, useEffect } from 'react';
import { ContentItem } from '@/lib/data';

interface ContentLibraryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onContentsChanged: () => void;
}

export default function ContentLibraryManager({
    isOpen,
    onClose,
    onContentsChanged,
}: ContentLibraryManagerProps) {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<{
        details: string;
        duration: number;
        type: '실습' | '시연' | '이론';
    }>({ details: '', duration: 0, type: '시연' });
    const [newContent, setNewContent] = useState({
        details: '',
        duration: 0,
        type: '시연' as '실습' | '시연' | '이론'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadContents();
        }
    }, [isOpen]);

    const loadContents = async () => {
        try {
            const res = await fetch('/api/content-items');
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('콘텐츠 로드 실패:', error);
        }
    };

    const handleAdd = async () => {
        if (!newContent.details.trim()) {
            setError('상세내용을 입력하세요');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/content-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent),
            });

            if (res.ok) {
                setNewContent({ details: '', duration: 0, type: '시연' });
                await loadContents();
                onContentsChanged();
            } else {
                const data = await res.json();
                setError(data.error || '콘텐츠 추가 실패');
            }
        } catch (error) {
            setError('콘텐츠 추가 중 오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item: ContentItem) => {
        setEditingId(item.id);
        setEditingData({
            details: item.details,
            duration: item.duration || 0,
            type: item.type || '시연'
        });
        setError('');
    };

    const handleSaveEdit = async (id: string) => {
        if (!editingData.details.trim()) {
            setError('상세내용을 입력하세요');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/content-items?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingData),
            });

            if (res.ok) {
                setEditingId(null);
                setEditingData({ details: '', duration: 0, type: '시연' });
                await loadContents();
                onContentsChanged();
            } else {
                const data = await res.json();
                setError(data.error || '콘텐츠 수정 실패');
            }
        } catch (error) {
            setError('콘텐츠 수정 중 오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, details: string) => {
        const preview = details.length > 50 ? details.substring(0, 50) + '...' : details;
        if (!confirm(`"${preview}" 콘텐츠를 삭제하시겠습니까?`)) return;

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/content-items?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await loadContents();
                onContentsChanged();
            } else {
                const data = await res.json();
                setError(data.error || '콘텐츠 삭제 실패');
            }
        } catch (error) {
            setError('콘텐츠 삭제 중 오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingData({ details: '', duration: 0, type: '시연' });
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">콘텐츠 라이브러리 관리</h2>
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
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Add New Content */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            새 콘텐츠 추가
                        </h3>
                        <div className="flex gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    구분
                                </label>
                                <select
                                    value={newContent.type}
                                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value as '실습' | '시연' | '이론' })}
                                    className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900 text-sm"
                                    disabled={isLoading}
                                >
                                    <option value="시연">시연</option>
                                    <option value="실습">실습</option>
                                    <option value="이론">이론</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    시간(분)
                                </label>
                                <input
                                    type="number"
                                    value={newContent.duration}
                                    onChange={(e) => setNewContent({ ...newContent, duration: Number(e.target.value) })}
                                    placeholder="0"
                                    min="0"
                                    className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900 text-sm"
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={isLoading}
                                className="px-6 py-2 rounded-lg bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 self-end"
                            >
                                추가
                            </button>
                        </div>
                        <textarea
                            value={newContent.details}
                            onChange={(e) => setNewContent({ ...newContent, details: e.target.value })}
                            placeholder="상세내용"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900 text-sm resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Contents List */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            콘텐츠 목록 ({items.length})
                        </h3>
                        <div className="space-y-2">
                            {items.map((item: ContentItem) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-[#00A9BB] transition-all"
                                >
                                    {editingId === item.id ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        구분
                                                    </label>
                                                    <select
                                                        value={editingData.type}
                                                        onChange={(e) => setEditingData({ ...editingData, type: e.target.value as '실습' | '시연' | '이론' })}
                                                        className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none text-gray-900 text-sm"
                                                        disabled={isLoading}
                                                    >
                                                        <option value="시연">시연</option>
                                                        <option value="실습">실습</option>
                                                        <option value="이론">이론</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        시간(분)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={editingData.duration}
                                                        onChange={(e) => setEditingData({ ...editingData, duration: Number(e.target.value) })}
                                                        min="0"
                                                        placeholder="0"
                                                        className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none text-gray-900 text-sm"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                value={editingData.details}
                                                onChange={(e) => setEditingData({ ...editingData, details: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none text-gray-900 text-sm resize-none"
                                                disabled={isLoading}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(item.id)}
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
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {item.duration && item.duration > 0 && (
                                                        <span className="text-xs font-semibold text-white bg-[#00A9BB] px-2 py-1 rounded-md">
                                                            {item.duration}분
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-800">
                                                    {item.details}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
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
                                                    onClick={() => handleDelete(item.id, item.details)}
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
                                            </div>
                                        </div>
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
