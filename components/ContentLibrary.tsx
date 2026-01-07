'use client';

import { useState, useEffect } from 'react';
import { ContentItem } from '@/lib/data';

interface ContentLibraryProps {
    onAddItem: (item: ContentItem) => void;
    compact?: boolean;
    usedItemDetails?: string[]; // Array of details strings that are already used
}

export default function ContentLibrary({ onAddItem, compact = false, usedItemDetails = [] }: ContentLibraryProps) {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = items.filter(item =>
                item.details.toLowerCase().includes(query) &&
                !usedItemDetails.includes(item.details) // Exclude already used items
            );
            setFilteredItems(filtered);
        } else {
            // Filter out used items even when no search query
            setFilteredItems(items.filter(item => !usedItemDetails.includes(item.details)));
        }
    }, [searchQuery, items, usedItemDetails]);

    const loadItems = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/content-items');
            const data = await res.json();
            setItems(data);
            setFilteredItems(data);
        } catch (error) {
            console.error('콘텐츠 라이브러리 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return compact ? (
        // Compact mode: just a dropdown selector
        <details className="mt-2">
            <summary className="text-xs text-[#00A9BB] cursor-pointer font-semibold hover:text-[#008796]">
                + 콘텐츠 라이브러리에서 추가
            </summary>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                {isLoading ? (
                    <div className="text-center py-4 text-xs text-gray-500">로딩 중...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-4 text-xs text-gray-500">항목이 없습니다.</div>
                ) : (
                    filteredItems.slice(0, 10).map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onAddItem(item)}
                            className="p-2 bg-gray-50 rounded hover:bg-[#00A9BB]/10 cursor-pointer transition-all flex items-start justify-between gap-2"
                        >
                            <div className="flex-1 min-w-0">
                                {item.duration && item.duration > 0 && (
                                    <span className="text-xs font-semibold text-white bg-[#00A9BB] px-1.5 py-0.5 rounded mr-1">
                                        {item.duration}분
                                    </span>
                                )}
                                <span className="text-xs text-gray-700">{item.details}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </details>
    ) : (
        // Full mode: complete library interface
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">콘텐츠 라이브러리</h2>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력하세요..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900"
                />
            </div>

            {/* Content List - Scrollable */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery ? '검색 결과가 없습니다.' : '항목이 없습니다.'}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#00A9BB] transition-all">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        {item.duration && item.duration > 0 && (
                                            <span className="text-xs font-semibold text-white bg-[#00A9BB] px-2 py-1 rounded-md">
                                                {item.duration}분
                                            </span>
                                        )}
                                        {/* Type Badge */}
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
                                    <p className="text-sm text-gray-800">{item.details}</p>
                                </div>
                                <button
                                    onClick={() => onAddItem(item)}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#00A9BB] text-white hover:bg-[#008796] transition-all duration-200 shadow-md hover:shadow-lg"
                                    title="추가"
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
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
