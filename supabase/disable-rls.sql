-- ========================================
-- RLS (Row Level Security) 비활성화
-- ========================================
-- 로그인 시스템을 제거했으므로 모든 사용자가 데이터에 접근할 수 있도록 RLS를 비활성화합니다.

-- 모든 테이블에 대해 RLS 비활성화
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculums DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;

-- 확인 메시지
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS가 모든 테이블에서 비활성화되었습니다.';
    RAISE NOTICE '이제 익명 사용자도 데이터를 읽고 쓸 수 있습니다.';
    RAISE NOTICE '========================================';
END $$;
