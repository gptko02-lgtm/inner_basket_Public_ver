'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.error || '로그인에 실패했습니다');
            }
        } catch (err) {
            setError('서버 오류가 발생했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-primary-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00A9BB] rounded-2xl mb-4 shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            커리큘럼 관리 시스템
                        </h1>
                        <p className="text-gray-600">로그인하여 계속하세요</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                아이디
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 bg-white/50 text-gray-900"
                                placeholder="아이디를 입력하세요"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 bg-white/50 text-gray-900"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 rounded-xl bg-[#00A9BB] hover:bg-[#008796] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>보안 로그인 시스템</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
