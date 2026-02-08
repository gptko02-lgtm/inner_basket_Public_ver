-- ========================================
-- 데이터베이스 스키마 확인 및 재생성
-- ========================================

-- 1단계: 기존 테이블 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 2단계: 테이블이 없다면 아래 스키마를 실행하세요
-- (테이블이 이미 있다면 이 부분은 건너뛰세요)

/*
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculums table
CREATE TABLE IF NOT EXISTS curriculums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculum_items table
CREATE TABLE IF NOT EXISTS curriculum_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    learning_objectives TEXT,
    duration INTEGER NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_library table
CREATE TABLE IF NOT EXISTS content_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    details TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    type TEXT DEFAULT '시연' CHECK (type IN ('실습', '시연', '이론')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_curriculums_category_id ON curriculums(category_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_curriculum_id ON curriculum_items(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_category_id ON curriculum_items(category_id);

-- RLS 비활성화
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculums DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;
*/

-- 3단계: 스키마 캐시 새로고침 (Supabase에서 자동으로 처리되지만 수동으로 할 수도 있음)
-- Supabase 대시보드에서 Settings > API > Reload schema cache 버튼 클릭
