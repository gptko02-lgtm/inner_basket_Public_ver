-- ========================================
-- 기존 데이터 정리 및 샘플 데이터 생성
-- ========================================
-- 5개 카테고리와 5개 가상 커리큘럼 생성

-- ========================================
-- 1단계: 기존 데이터 모두 삭제
-- ========================================
TRUNCATE TABLE curriculum_items CASCADE;
TRUNCATE TABLE curriculums CASCADE;
TRUNCATE TABLE content_library CASCADE;
TRUNCATE TABLE categories CASCADE;

-- ========================================
-- 2단계: 5개 카테고리 생성
-- ========================================
INSERT INTO categories (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'AI 기초'),
    ('22222222-2222-2222-2222-222222222222', '데이터 분석'),
    ('33333333-3333-3333-3333-333333333333', '프로그래밍'),
    ('44444444-4444-4444-4444-444444444444', '디지털 마케팅'),
    ('55555555-5555-5555-5555-555555555555', '비즈니스 전략');

-- ========================================
-- 3단계: 콘텐츠 라이브러리 항목 생성
-- ========================================
INSERT INTO content_library (details, duration, type) VALUES
-- AI 관련
('인공지능의 개념과 역사', 30, '이론'),
('머신러닝 기초 이해하기', 45, '이론'),
('딥러닝과 신경망 소개', 40, '이론'),
('ChatGPT 활용 실습', 60, '실습'),
('이미지 인식 AI 체험', 50, '시연'),

-- 데이터 분석 관련
('데이터 분석 프로세스 이해', 35, '이론'),
('Excel을 활용한 데이터 정리', 50, '실습'),
('Python 데이터 분석 기초', 60, '실습'),
('데이터 시각화 기법', 45, '시연'),
('통계 기초와 활용', 40, '이론'),

-- 프로그래밍 관련
('프로그래밍 기초 개념', 30, '이론'),
('Python 문법 기초', 60, '실습'),
('웹 개발 입문', 50, '실습'),
('Git과 버전 관리', 40, '시연'),
('알고리즘 기초', 45, '이론'),

-- 마케팅 관련
('디지털 마케팅 개요', 30, '이론'),
('SNS 마케팅 전략', 45, '실습'),
('구글 애널리틱스 활용', 50, '실습'),
('콘텐츠 마케팅 기획', 40, '시연'),
('SEO 최적화 기법', 35, '이론'),

-- 비즈니스 관련
('비즈니스 모델 캔버스', 40, '이론'),
('린 스타트업 방법론', 45, '실습'),
('재무제표 읽기', 50, '이론'),
('프레젠테이션 스킬', 35, '시연'),
('협상 전략과 기법', 40, '실습');

-- ========================================
-- 4단계: 5개 커리큘럼 생성
-- ========================================

-- 커리큘럼 1: AI 기초 과정
DO $$
DECLARE
    v_curriculum_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO curriculums (id, title, duration, category_id)
    VALUES (v_curriculum_id, '비전공자를 위한 AI 기초 완성', 240, '11111111-1111-1111-1111-111111111111');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '비전공자를 위한 AI 기초 완성',
        'AI의 기본 개념부터 실제 활용까지, 비전공자도 쉽게 이해할 수 있는 AI 입문 과정',
        240,
        '11111111-1111-1111-1111-111111111111',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'AI 이해하기',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '인공지능의 개념과 역사', 'duration', 30, 'type', '이론'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '머신러닝 기초 이해하기', 'duration', 45, 'type', '이론')
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'AI 실습',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'ChatGPT 활용 실습', 'duration', 60, 'type', '실습'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '이미지 인식 AI 체험', 'duration', 50, 'type', '시연')
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
    INSERT INTO curriculums (id, title, duration, category_id)
    VALUES (v_curriculum_id, '실무 데이터 분석 마스터', 300, '22222222-2222-2222-2222-222222222222');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '실무 데이터 분석 마스터',
        'Excel부터 Python까지, 실무에서 바로 활용 가능한 데이터 분석 스킬 완성',
        300,
        '22222222-2222-2222-2222-222222222222',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '데이터 분석 기초',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '데이터 분석 프로세스 이해', 'duration', 35, 'type', '이론'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Excel을 활용한 데이터 정리', 'duration', 50, 'type', '실습')
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'Python 데이터 분석',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Python 데이터 분석 기초', 'duration', 60, 'type', '실습'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '데이터 시각화 기법', 'duration', 45, 'type', '시연')
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
    INSERT INTO curriculums (id, title, duration, category_id)
    VALUES (v_curriculum_id, 'Python으로 시작하는 프로그래밍', 270, '33333333-3333-3333-3333-333333333333');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        'Python으로 시작하는 프로그래밍',
        '프로그래밍 기초부터 웹 개발까지, 초보자를 위한 완벽 가이드',
        270,
        '33333333-3333-3333-3333-333333333333',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '프로그래밍 기초',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '프로그래밍 기초 개념', 'duration', 30, 'type', '이론'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Python 문법 기초', 'duration', 60, 'type', '실습')
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '실전 프로젝트',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '웹 개발 입문', 'duration', 50, 'type', '실습'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'Git과 버전 관리', 'duration', 40, 'type', '시연')
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
    INSERT INTO curriculums (id, title, duration, category_id)
    VALUES (v_curriculum_id, '성과를 만드는 디지털 마케팅', 260, '44444444-4444-4444-4444-444444444444');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '성과를 만드는 디지털 마케팅',
        'SNS부터 SEO까지, 실제 성과를 내는 디지털 마케팅 전략 수립',
        260,
        '44444444-4444-4444-4444-444444444444',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '마케팅 전략',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '디지털 마케팅 개요', 'duration', 30, 'type', '이론'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'SNS 마케팅 전략', 'duration', 45, 'type', '실습')
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '데이터 기반 마케팅',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '구글 애널리틱스 활용', 'duration', 50, 'type', '실습'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', 'SEO 최적화 기법', 'duration', 35, 'type', '이론')
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
    INSERT INTO curriculums (id, title, duration, category_id)
    VALUES (v_curriculum_id, '스타트업 창업 실전 가이드', 250, '55555555-5555-5555-5555-555555555555');

    INSERT INTO curriculum_items (curriculum_id, title, learning_objectives, duration, category_id, items)
    VALUES (
        v_curriculum_id,
        '스타트업 창업 실전 가이드',
        '아이디어부터 투자 유치까지, 스타트업 창업의 모든 것',
        250,
        '55555555-5555-5555-5555-555555555555',
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '비즈니스 기획',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '비즈니스 모델 캔버스', 'duration', 40, 'type', '이론'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '린 스타트업 방법론', 'duration', 45, 'type', '실습')
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', '실전 스킬',
                    'items', jsonb_build_array(
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '재무제표 읽기', 'duration', 50, 'type', '이론'),
                        jsonb_build_object('id', gen_random_uuid()::text, 'details', '프레젠테이션 스킬', 'duration', 35, 'type', '시연')
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
    RAISE NOTICE '샘플 데이터 생성 완료!';
    RAISE NOTICE '- 카테고리: 5개';
    RAISE NOTICE '- 커리큘럼: 5개';
    RAISE NOTICE '- 콘텐츠 라이브러리: 25개';
    RAISE NOTICE '========================================';
END $$;
