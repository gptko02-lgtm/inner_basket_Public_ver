-- ========================================
-- RLS 설정 - 두 가지 옵션
-- ========================================
-- 아래 두 가지 방법 중 하나를 선택하세요

-- ========================================
-- 옵션 1: RLS 완전 비활성화 (간단함, 추천)
-- ========================================
-- 모든 사용자가 모든 데이터를 읽고 쓸 수 있습니다

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculums DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;


-- ========================================
-- 옵션 2: RLS 활성화 + 모든 권한 허용 정책
-- ========================================
-- RLS는 켜져있지만 모든 사용자에게 모든 권한을 줍니다
-- (아래 코드는 옵션 1을 선택했다면 실행하지 마세요)

/*
-- RLS 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Allow all access to categories" ON categories;
DROP POLICY IF EXISTS "Allow all access to curriculums" ON curriculums;
DROP POLICY IF EXISTS "Allow all access to curriculum_items" ON curriculum_items;
DROP POLICY IF EXISTS "Allow all access to content_library" ON content_library;

-- 모든 작업 허용 정책 생성
CREATE POLICY "Allow all access to categories"
ON categories FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to curriculums"
ON curriculums FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to curriculum_items"
ON curriculum_items FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to content_library"
ON content_library FOR ALL
USING (true)
WITH CHECK (true);
*/

-- 확인 메시지
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS 설정이 완료되었습니다.';
    RAISE NOTICE '이제 모든 사용자가 데이터에 접근할 수 있습니다.';
    RAISE NOTICE '========================================';
END $$;
