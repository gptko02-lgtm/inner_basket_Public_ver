'use client';

interface CurriculumCardProps {
    curriculum: {
        id: string;
        title: string;
        duration: number;
        categoryId: string;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onExport: (id: string) => void;
    onExportPdf: (id: string) => void;
    onExportHtml: (id: string) => void;
}

export default function CurriculumCard({
    curriculum,
    onEdit,
    onDelete,
    onExport,
    onExportPdf,
    onExportHtml,
}: CurriculumCardProps) {
    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {curriculum.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{curriculum.duration}분</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(curriculum.id)}
                        className="p-2.5 rounded-lg bg-[#00A9BB] text-white hover:bg-[#008796] transition-all duration-200 shadow-md hover:shadow-lg"
                        title="수정"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => onExportPdf(curriculum.id)}
                        className="p-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="PDF 다운로드"
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
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => onExportHtml(curriculum.id)}
                        className="p-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="HTML 다운로드"
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
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => onExport(curriculum.id)}
                        className="p-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="엑셀 다운로드"
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => onDelete(curriculum.id)}
                        className="p-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                        title="삭제"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
