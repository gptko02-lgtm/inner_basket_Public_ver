'use client';

import { useState } from 'react';
import { ContentItem, CurriculumPart } from '@/lib/data';
import ManualItemForm from './ManualItemForm';
import ContentLibrary from './ContentLibrary';

interface CurriculumEditorProps {
    title: string;
    learningObjectives: string;
    duration: number;
    categoryId: string;
    parts: CurriculumPart[];
    onTitleChange: (title: string) => void;
    onObjectivesChange: (objectives: string) => void;
    onDurationChange: (duration: number) => void;
    onCategoryChange: (categoryId: string) => void;
    onAddPart: () => void;
    onUpdatePartTitle: (partId: string, newTitle: string) => void;
    onDeletePart: (partId: string) => void;
    onAddItemToPart: (partId: string, item: ContentItem) => void;
    onRemoveItemFromPart: (partId: string, itemId: string) => void;
    onEditingPartChange: (partId: string | null) => void;
    onSave: () => void;
    onCancel: () => void;
    categories: { id: string; name: string }[];
}

export default function CurriculumEditor({
    title,
    learningObjectives,
    duration,
    categoryId,
    parts,
    onTitleChange,
    onObjectivesChange,
    onDurationChange,
    onCategoryChange,
    onAddPart,
    onUpdatePartTitle,
    onDeletePart,
    onAddItemToPart,
    onRemoveItemFromPart,
    onEditingPartChange,
    onSave,
    onCancel,
    categories,
}: CurriculumEditorProps) {
    const [editingPartId, setEditingPartId] = useState<string | null>(null);
    const [editingPartTitle, setEditingPartTitle] = useState('');

    // Calculate total used time across all parts
    const usedTime = parts.reduce((total, part) =>
        total + part.items.reduce((sum, item) => sum + (item.duration || 0), 0), 0
    );
    const remainingTime = Math.max(duration - usedTime, 0);
    const progressPercent = duration > 0 ? Math.min((usedTime / duration) * 100, 100) : 0;

    const handleStartEditPart = (partId: string, currentTitle: string) => {
        setEditingPartId(partId);
        setEditingPartTitle(currentTitle);
        onEditingPartChange(partId);
    };

    const handleSavePartTitle = (partId: string) => {
        if (editingPartTitle.trim()) {
            onUpdatePartTitle(partId, editingPartTitle.trim());
        }
        setEditingPartId(null);
        setEditingPartTitle('');
        onEditingPartChange(null);
    };

    const handleCancelEditPart = () => {
        setEditingPartId(null);
        setEditingPartTitle('');
        onEditingPartChange(null);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">커리큘럼 편집</h2>

            {/* Form Fields */}
            <div className="space-y-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        강의명 *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="강의 제목을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        학습 목표
                    </label>
                    <textarea
                        value={learningObjectives}
                        onChange={(e) => onObjectivesChange(e.target.value)}
                        placeholder="학습 목표를 입력하세요"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all resize-none text-gray-900"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            시간 (분) *
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => onDurationChange(Number(e.target.value))}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            카테고리 *
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900"
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Time Progress */}
            {duration > 0 && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">시간 사용 현황</span>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-[#00A9BB]">{usedTime}분</span>
                            <span className="text-gray-400">/</span>
                            <span className="font-bold text-gray-700">{duration}분</span>
                        </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-[#00A9BB] to-[#00D4AA] transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>진행률: {progressPercent.toFixed(1)}%</span>
                        <span className={remainingTime === 0 ? 'text-red-600 font-semibold' : ''}>
                            남은 시간: {remainingTime}분
                        </span>
                    </div>
                </div>
            )}

            {/* Parts Section */}
            <div className="flex-1 overflow-y-auto mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                        파트 구성 ({parts.length})
                    </h3>
                    <button
                        onClick={onAddPart}
                        className="px-4 py-2 rounded-lg bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        파트 추가
                    </button>
                </div>

                {parts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        파트를 추가해주세요.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {parts.map((part, index) => (
                            <div key={part.id} className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                                {/* Part Header */}
                                <div className="flex items-center justify-between mb-3">
                                    {editingPartId === part.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editingPartTitle}
                                                onChange={(e) => setEditingPartTitle(e.target.value)}
                                                className="flex-1 px-3 py-1 border border-[#00A9BB] rounded-lg focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none text-gray-900 font-semibold"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSavePartTitle(part.id);
                                                    if (e.key === 'Escape') handleCancelEditPart();
                                                }}
                                            />
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={() => handleSavePartTitle(part.id)}
                                                    className="px-3 py-1 rounded-lg bg-[#00A9BB] text-white text-sm font-semibold hover:bg-[#008796] transition-all"
                                                >
                                                    완료
                                                </button>
                                                <button
                                                    onClick={handleCancelEditPart}
                                                    className="px-3 py-1 rounded-lg bg-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-400 transition-all"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-white bg-[#00A9BB] px-2 py-1 rounded-md">
                                                    파트 {index + 1}
                                                </span>
                                                <h4 className="text-sm font-bold text-gray-800">{part.title}</h4>
                                                <span className="text-xs text-gray-500">
                                                    ({part.items.reduce((sum, item) => sum + (item.duration || 0), 0)}분)
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStartEditPart(part.id, part.title)}
                                                    className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-all"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => onDeletePart(part.id)}
                                                    className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 transition-all"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Part Items */}
                                <div className="space-y-2">
                                    {part.items.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            콘텐츠 라이브러리에서 항목을 추가하거나 수기 입력하세요.
                                        </p>
                                    ) : (
                                        part.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3 bg-white border border-gray-200 rounded-lg flex items-start justify-between gap-2"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {item.duration && item.duration > 0 && (
                                                            <span className="text-xs font-semibold text-white bg-[#00A9BB] px-2 py-1 rounded-md">
                                                                {item.duration}분
                                                            </span>
                                                        )}
                                                        {/* Type Badge - Same size as duration */}
                                                        <span
                                                            className="text-xs font-semibold px-2 py-1 rounded-md"
                                                            style={{
                                                                backgroundColor:
                                                                    item.type === '실습' ? '#E8F5E9' :
                                                                        item.type === '이론' ? '#E3F2FD' :
                                                                            '#F5F5F5',
                                                                color:
                                                                    item.type === '실습' ? '#2E7D32' :
                                                                        item.type === '이론' ? '#1565C0' :
                                                                            '#616161'
                                                            }}
                                                        >
                                                            {item.type || '시연'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-700">{item.details}</p>
                                                </div>
                                                <button
                                                    onClick={() => onRemoveItemFromPart(part.id, item.id)}
                                                    className="flex-shrink-0 p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                                                    title="삭제"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Add to This Part - Manual Input Only */}
                                <div className="mt-3 pt-3 border-t border-gray-300">
                                    <ManualItemForm onAddItem={(item) => {
                                        const newItem: ContentItem = {
                                            id: crypto.randomUUID(),
                                            type: '시연', // Default to demo
                                            ...item,
                                        };
                                        onAddItemToPart(part.id, newItem);
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-all duration-200"
                >
                    취소
                </button>
                <button
                    onClick={onSave}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    저장
                </button>
            </div>
        </div>
    );
}
