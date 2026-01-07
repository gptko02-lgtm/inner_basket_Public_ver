'use client';

import { useState } from 'react';
import { ContentItem } from '@/lib/data';

interface ManualItemFormProps {
    onAddItem: (item: Omit<ContentItem, 'id'>) => void;
}

export default function ManualItemForm({ onAddItem }: ManualItemFormProps) {
    const [details, setDetails] = useState('');
    const [duration, setDuration] = useState(0);

    const handleSubmit = () => {
        if (!details.trim()) {
            alert('상세내용을 입력하세요');
            return;
        }

        onAddItem({
            details: details.trim(),
            duration,
        });

        // Reset form
        setDetails('');
        setDuration(0);
    };

    return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">수기 입력</h3>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        시간(분)
                    </label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        상세내용
                    </label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="상세내용을 입력하세요"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A9BB] focus:border-transparent outline-none transition-all text-gray-900 text-sm resize-none"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 rounded-lg bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                >
                    추가
                </button>
            </div>
        </div>
    );
}
