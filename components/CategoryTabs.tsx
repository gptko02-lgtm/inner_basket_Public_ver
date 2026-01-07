'use client';

import { useRef, useState, useEffect } from 'react';
import { Category } from '@/lib/data';

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
}: CategoryTabsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 1
        );
    };

    useEffect(() => {
        checkScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollButtons);
            }
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 200;
        const newScrollLeft =
            direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative">
            {/* Left Arrow */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-full shadow-lg hover:bg-[#00A9BB] transition-all duration-200"
                    aria-label="이전"
                >
                    <svg
                        className="w-5 h-5"
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
            )}

            {/* Tabs Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-10"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`
              flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
              ${activeCategory === category.id
                                ? 'bg-[#00A9BB] text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-[#00A9BB] shadow-md hover:shadow-lg'
                            }
            `}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-full shadow-lg hover:bg-[#00A9BB] transition-all duration-200"
                    aria-label="다음"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
