-- ========================================
-- Supabase 테이블 구조 완전 분석
-- ========================================

-- 1. 현재 search_path 확인
SHOW search_path;

-- 2. curriculum_items 테이블 찾기 (대소문자 무관)
SELECT 
    table_schema, 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name ILIKE '%curriculum%'
ORDER BY table_schema, table_name;

-- 3. 모든 public 스키마 테이블 목록
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 4. 각 테이블의 컬럼 정보
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
