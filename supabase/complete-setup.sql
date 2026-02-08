-- ========================================
-- 완전한 데이터베이스 설정 및 샘플 데이터
-- ========================================
-- 1. 누락된 테이블 생성
-- 2. 기존 데이터 정리
-- 3. 샘플 데이터 입력

-- ========================================
-- STEP 1: 누락된 테이블 생성
-- ========================================

-- curriculum_items 테이블 생성
CREATE TABLE IF NOT EXISTS curriculum_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    learning_objectives TEXT,
    duration INTEGER NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- content_library 테이블 생성
CREATE TABLE IF NOT EXISTS content_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_curriculum_items_curriculum_id ON curriculum_items(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_category_id ON curriculum_items(category_id);

-- RLS 비활성화
ALTER TABLE curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: 기존 데이터 정리
-- ========================================
DELETE FROM curriculum_items;
DELETE FROM curriculums;
DELETE FROM content_library;
DELETE FROM categories WHERE parent_id IS NOT NULL OR id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
);

-- ========================================
-- STEP 3: 5개 카테고리 생성
-- ========================================
INSERT INTO categories (id, name, parent_id) VALUES
    ('11111111-1111-1111-1111-111111111111', 'AI 기초', NULL),
    ('22222222-2222-2222-2222-222222222222', '데이터 분석', NULL),
    ('33333333-3333-3333-3333-333333333333', '프로그래밍', NULL),
    ('44444444-4444-4444-4444-444444444444', '디지털 마케팅', NULL),
    ('55555555-5555-5555-5555-555555555555', '비즈니스 전략', NULL)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STEP 4: 콘텐츠 라이브러리 항목 생성
-- ========================================
INSERT INTO content_library (title, content, duration_minutes) VALUES
-- AI 관련
('인공지능의 개념과 역사', '인공지능의 기본 개념과 발전 과정을 학습합니다', 30),
('머신러닝 기초 이해하기', '머신러닝의 기초 원리와 주요 알고리즘을 배웁니다', 45),
('딥러닝과 신경망 소개', '딥러닝과 신경망의 구조와 작동 원리를 이해합니다', 40),
('ChatGPT 활용 실습', 'ChatGPT를 활용한 실무 적용 사례를 실습합니다', 60),
('이미지 인식 AI 체험', 'AI 이미지 인식 기술을 직접 체험해봅니다', 50),

-- 데이터 분석 관련
('데이터 분석 프로세스 이해', '데이터 분석의 전체 프로세스와 방법론을 학습합니다', 35),
('Excel을 활용한 데이터 정리', 'Excel을 사용한 데이터 정제 및 가공 기법을 배웁니다', 50),
('Python 데이터 분석 기초', 'Python을 활용한 데이터 분석 기초를 실습합니다', 60),
('데이터 시각화 기법', '효과적인 데이터 시각화 방법과 도구를 학습합니다', 45),
('통계 기초와 활용', '데이터 분석에 필요한 기초 통계를 배웁니다', 40),

-- 프로그래밍 관련
('프로그래밍 기초 개념', '프로그래밍의 기본 개념과 사고방식을 이해합니다', 30),
('Python 문법 기초', 'Python 기본 문법과 자료구조를 학습합니다', 60),
('웹 개발 입문', 'HTML, CSS, JavaScript 기초를 배웁니다', 50),
('Git과 버전 관리', 'Git을 활용한 버전 관리 방법을 실습합니다', 40),
('알고리즘 기초', '기본 알고리즘과 문제 해결 방법을 학습합니다', 45),

-- 마케팅 관련
('디지털 마케팅 개요', '디지털 마케팅의 전반적인 개념과 트렌드를 이해합니다', 30),
('SNS 마케팅 전략', 'SNS를 활용한 마케팅 전략 수립 방법을 배웁니다', 45),
('구글 애널리틱스 활용', '구글 애널리틱스를 통한 데이터 분석 방법을 실습합니다', 50),
('콘텐츠 마케팅 기획', '효과적인 콘텐츠 마케팅 기획 방법을 학습합니다', 40),
('SEO 최적화 기법', '검색 엔진 최적화 전략과 실무 기법을 배웁니다', 35),

-- 비즈니스 관련
('비즈니스 모델 캔버스', '비즈니스 모델 캔버스를 활용한 사업 기획을 학습합니다', 40),
('린 스타트업 방법론', '린 스타트업 방법론과 실전 적용 사례를 배웁니다', 45),
('재무제표 읽기', '기업 재무제표 분석 방법을 이해합니다', 50),
('프레젠테이션 스킬', '효과적인 프레젠테이션 기법을 실습합니다', 35),
('협상 전략과 기법', '비즈니스 협상의 전략과 실무 기법을 학습합니다', 40);

-- ========================================
-- STEP 5: 5개 커리큘럼 생성
-- ========================================

-- 커리큘럼 1: AI 기초 과정
DO $$
DECLARE
    v_curriculum_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO curriculums (id, title, duration_minutes, category_id)
    VALUES (v_curriculum_id, '비전공자를 위한 AI 기초 완성', 185, '11111111-1111-1111-1111-111111111111');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '비전공자를 위한 AI 기초 완성',
        'AI의 기본 개념부터 실제 활용까지, 비전공자도 쉽게 이해할 수 있는 AI 입문 과정',
        185,
        '11111111-1111-1111-1111-111111111111',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'AI 이해하기',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '인공지능의 개념과 역사', 'duration', 30),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '머신러닝 기초 이해하기', 'duration', 45),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '딥러닝과 신경망 소개', 'duration', 40)
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'AI 실습',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'ChatGPT 활용 실습', 'duration', 60)
                    )
                )
            )
        )
    );
END $$;

-- 커리큘럼 2: 데이터 분석 과정
DO $$
DECLARE
    v_curriculum_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO curriculums (id, title, duration_minutes, category_id)
    VALUES (v_curriculum_id, '실무 데이터 분석 마스터', 190, '22222222-2222-2222-2222-222222222222');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '실무 데이터 분석 마스터',
        'Excel부터 Python까지, 실무에서 바로 활용 가능한 데이터 분석 스킬 완성',
        190,
        '22222222-2222-2222-2222-222222222222',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '데이터 분석 기초',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '데이터 분석 프로세스 이해', 'duration', 35),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Excel을 활용한 데이터 정리', 'duration', 50)
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'Python 데이터 분석',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Python 데이터 분석 기초', 'duration', 60),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '데이터 시각화 기법', 'duration', 45)
                    )
                )
            )
        )
    );
END $$;

-- 커리큘럼 3: 프로그래밍 입문
DO $$
DECLARE
    v_curriculum_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO curriculums (id, title, duration_minutes, category_id)
    VALUES (v_curriculum_id, 'Python으로 시작하는 프로그래밍', 180, '33333333-3333-3333-3333-333333333333');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        'Python으로 시작하는 프로그래밍',
        '프로그래밍 기초부터 웹 개발까지, 초보자를 위한 완벽 가이드',
        180,
        '33333333-3333-3333-3333-333333333333',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '프로그래밍 기초',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '프로그래밍 기초 개념', 'duration', 30),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Python 문법 기초', 'duration', 60)
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '실전 프로젝트',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '웹 개발 입문', 'duration', 50),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Git과 버전 관리', 'duration', 40)
                    )
                )
            )
        )
    );
END $$;

-- 커리큘럼 4: 디지털 마케팅
DO $$
DECLARE
    v_curriculum_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO curriculums (id, title, duration_minutes, category_id)
    VALUES (v_curriculum_id, '성과를 만드는 디지털 마케팅', 165, '44444444-4444-4444-4444-444444444444');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '성과를 만드는 디지털 마케팅',
        'SNS부터 SEO까지, 실제 성과를 내는 디지털 마케팅 전략 수립',
        165,
        '44444444-4444-4444-4444-444444444444',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '마케팅 전략',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '디지털 마케팅 개요', 'duration', 30),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'SNS 마케팅 전략', 'duration', 45)
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '데이터 기반 마케팅',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '구글 애널리틱스 활용', 'duration', 50),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'SEO 최적화 기법', 'duration', 40)
                    )
                )
            )
        )
    );
END $$;

-- 커리큘럼 5: 비즈니스 전략
DO $$
DECLARE
    v_curriculum_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO curriculums (id, title, duration_minutes, category_id)
    VALUES (v_curriculum_id, '스타트업 창업 실전 가이드', 170, '55555555-5555-5555-5555-555555555555');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '스타트업 창업 실전 가이드',
        '아이디어부터 투자 유치까지, 스타트업 창업의 모든 것',
        170,
        '55555555-5555-5555-5555-555555555555',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '비즈니스 기획',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '비즈니스 모델 캔버스', 'duration', 40),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '린 스타트업 방법론', 'duration', 45)
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '실전 스킬',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '재무제표 읽기', 'duration', 50),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '프레젠테이션 스킬', 'duration', 35)
                    )
                )
            )
        )
    );
END $$;

-- ========================================
-- 완료 메시지
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '데이터베이스 설정 완료!';
    RAISE NOTICE '- 테이블 생성: curriculum_items, content_library';
    RAISE NOTICE '- 카테고리: 5개';
    RAISE NOTICE '- 커리큘럼: 5개';
    RAISE NOTICE '- 콘텐츠 라이브러리: 25개';
    RAISE NOTICE '========================================';
END $$;
