-- ========================================
-- 샘플 데이터 채우기 SQL 스크립트
-- ========================================
-- 이 스크립트는 Supabase SQL Editor에서 실행하세요
-- 카테고리, 콘텐츠 라이브러리, 커리큘럼 샘플 데이터를 생성합니다

-- ========================================
-- 1. 카테고리 데이터
-- ========================================
INSERT INTO categories (name) VALUES
    ('AI 기초'),
    ('실무 AI 활용'),
    ('데이터 분석'),
    ('프로그래밍'),
    ('마케팅')
ON CONFLICT DO NOTHING;

-- ========================================
-- 2. 콘텐츠 라이브러리 데이터
-- ========================================
INSERT INTO content_library (details, duration, type) VALUES
-- ChatGPT 관련
('영상으로 살펴보는 생성 AI 발전 현황', 15, '이론'),
('생성 AI 이해와 활용사례', 20, '이론'),
('ChatGPT UI 및 사용법 소개', 10, '시연'),
('프롬프트 엔지니어가 추천하는 ChatGPT 기본 세팅', 15, '실습'),
('프롬프트 작성의 기본 3단 구조(메인요청-세부조건-참고자료)', 20, '이론'),
('프롬프트 구체화를 위한 세부 구성요소', 15, '실습'),
('생성 AI 활용 시 주의사항(할루시네이션)', 10, '이론'),
('ChatGPT 고급 기능 소개 및 활용법', 25, '시연'),
('ChatGPT 이외의 대표적인 생성 AI (Claude, Perplexity, MS Copilot, Gemini)', 20, '이론'),

-- 문서 작성
('미팅·회의·통화 내용 요약 및 정리 + STT(음성 텍스트 변환) 활용법', 30, '실습'),
('자사 제품·서비스 소개서 기반 제안서 초안 작성', 25, '실습'),
('월별 매출 데이터 분석 및 프로모션/인사이트 도출', 30, '실습'),
('VOC(Voice of Customer) 데이터 분석 및 FAQ 구성 + 그래프/차트 생성', 35, '실습'),

-- 검색 및 요약
('[Perplexity AI 활용] 전략 수립을 위한 산업 동향 분석 - 검색 특화 모델을 활용한 분야별 최신 이슈 및 정보 수집', 25, '실습'),
('[NotebookLM 활용] 긴 업무 문서를 요약·정리해 바로 쓰는 방법 - 방대한 텍스트 문서를 이해하기 쉬운 콘텐츠로 재구성 및 질의응답 챗봇화', 30, '실습'),
('[SCISPACE AI 활용] 최신 논문 검색과 인용 가능한 구조 요약 - 논문 구조를 기준으로 핵심 내용을 정리해 참고 문헌 인용이 쉬운 형태로 구성', 25, '실습'),

-- 시각화
('[Claude AI 활용] 바이브코딩으로 업무 데이터 대시보드 만들기 - 입력 데이터에 따라 즉시 업데이트 되는 대시보드 생성 자동화', 40, '실습'),
('[Gemini AI 활용] 데이터/수치 기반 시각화 자료 제작 - 마케팅 캠페인 성과 데이터를 활용한 인포그래픽 생성', 35, '실습'),
('[Napkin AI 활용] 보고서, 발표자료에 활용할 수 있는 도식화 이미지 생성 - 문서 내 특정 파트를 다양한 레이아웃의 이미지로 변환', 30, '실습'),

-- 데이터 수집
('파이썬 & 구글 Colab 활용 코드 실행 방법 안내', 15, '시연'),
('네이버 API 소개 및 발급방법 안내', 10, '이론'),
('[네이버 뉴스] 특정 키워드 기반 뉴스기사 300건 수집', 25, '실습'),
('[네이버 블로그] 제품 리뷰, 후기 등 바이럴 포스팅 100건 수집', 20, '실습'),
('[네이버 쇼핑] 제품명, 가격, 판매처 등 쇼핑 데이터 100건 수집', 20, '실습'),
('수집 데이터 결과 인사이트 도출', 25, '실습'),

-- 이미지 생성
('[Gemini AI 활용] 기업 대표 마스코트, 캐릭터 기획 - 기업의 핵심 가치, 서비스 내용 기반 캐릭터 콘셉트 설계', 30, '실습'),
('[ImageFX 활용] 캐릭터 기본 외형 제작 - 기본 외형 설계를 통한 활용 가능한 캐릭터 형태 구축', 35, '실습'),
('[Gemini AI 활용] 실사용을 고려한 다양한 구도의 시안 생성 - 아트소스, 턴어라운드 등 캐릭터 응용컷 생성', 30, '실습'),
('[Gemini AI 활용] 기업 홍보용 배너 이미지 제작 - 홍보 문구 중심으로 시선이 집중되는 배너 이미지 생성', 25, '실습'),
('[Gemini AI 활용] 캐릭터+로고 활용 배너 완성 - 제작된 배너 이미지에 캐릭터와 기업 로고를 합성해 최종 배너 완성', 30, '실습'),

-- 보안 및 마무리
('생성 AI와 보안 : 자사 데이터를 ChatGPT에서 안전하게 활용하는 방법', 20, '이론'),
('생성 AI 제작물의 저작권 이슈와 사용 가이드라인', 15, '이론'),
('프롬프트 공유 및 관리의 중요성', 10, '이론'),
('질의응답 및 마무리', 15, '이론')
ON CONFLICT DO NOTHING;

-- ========================================
-- 3. ChatGPT 활용 커리큘럼 생성
-- ========================================
DO $$
DECLARE
    v_category_id UUID;
    v_curriculum_id UUID;
BEGIN
    -- '실무 AI 활용' 카테고리 ID 가져오기
    SELECT id INTO v_category_id FROM categories WHERE name = '실무 AI 활용' LIMIT 1;
    
    IF v_category_id IS NULL THEN
        INSERT INTO categories (name) VALUES ('실무 AI 활용') RETURNING id INTO v_category_id;
    END IF;

    -- 커리큘럼 생성
    INSERT INTO curriculums (title, duration, category_id)
    VALUES ('업무 생산성을 높이는 ChatGPT 활용 Skill-up', 360, v_category_id)
    RETURNING id INTO v_curriculum_id;

    -- 커리큘럼 아이템 생성 (상세 정보 포함)
    INSERT INTO curriculum_items (
        curriculum_id,
        title,
        learning_objectives,
        duration,
        category_id,
        items
    ) VALUES (
        v_curriculum_id,
        '업무 생산성을 높이는 ChatGPT 활용 Skill-up',
        'ChatGPT를 포함한 생성 AI를 효과적으로 활용하는 방법을 배우고, 실제 업무 사례를 통해 이를 적용하는 실습 진행',
        360,
        v_category_id,
        jsonb_build_object(
            'parts', jsonb_build_array(
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'Phase 01 - ChatGPT 활용 노하우 및 주의점',
                    'items', jsonb_build_array(
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '영상으로 살펴보는 생성 AI 발전 현황',
                            'duration', 15,
                            'type', '이론'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '생성 AI 이해와 활용사례',
                            'duration', 20,
                            'type', '이론'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', 'ChatGPT UI 및 사용법 소개',
                            'duration', 10,
                            'type', '시연'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '프롬프트 엔지니어가 추천하는 ChatGPT 기본 세팅',
                            'duration', 15,
                            'type', '실습'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', 'ChatGPT 고급 기능 소개 및 활용법',
                            'duration', 25,
                            'type', '시연'
                        )
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'Phase 02 - ChatGPT 활용 다양한 문서작성',
                    'items', jsonb_build_array(
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '미팅·회의·통화 내용 요약 및 정리 + STT(음성 텍스트 변환) 활용법',
                            'duration', 30,
                            'type', '실습'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '자사 제품·서비스 소개서 기반 제안서 초안 작성',
                            'duration', 25,
                            'type', '실습'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '월별 매출 데이터 분석 및 프로모션/인사이트 도출',
                            'duration', 30,
                            'type', '실습'
                        )
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'Phase 03 - 다양한 생성 AI Part.1 : 검색·요약',
                    'items', jsonb_build_array(
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '[Perplexity AI 활용] 전략 수립을 위한 산업 동향 분석',
                            'duration', 25,
                            'type', '실습'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '[NotebookLM 활용] 긴 업무 문서를 요약·정리해 바로 쓰는 방법',
                            'duration', 30,
                            'type', '실습'
                        )
                    )
                ),
                jsonb_build_object(
                    'id', gen_random_uuid()::text,
                    'title', 'Phase 04 - 다양한 생성 AI Part.2 : 시각화',
                    'items', jsonb_build_array(
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '[Claude AI 활용] 바이브코딩으로 업무 데이터 대시보드 만들기',
                            'duration', 40,
                            'type', '실습'
                        ),
                        jsonb_build_object(
                            'id', gen_random_uuid()::text,
                            'details', '[Gemini AI 활용] 데이터/수치 기반 시각화 자료 제작',
                            'duration', 35,
                            'type', '실습'
                        )
                    )
                )
            )
        )
    );
    
    RAISE NOTICE '커리큘럼이 성공적으로 추가되었습니다! Curriculum ID: %', v_curriculum_id;
END $$;

-- ========================================
-- 완료 메시지
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '샘플 데이터 생성 완료!';
    RAISE NOTICE '- 카테고리: 5개';
    RAISE NOTICE '- 콘텐츠 라이브러리: 33개';
    RAISE NOTICE '- 커리큘럼: 1개 (ChatGPT 활용 과정)';
    RAISE NOTICE '========================================';
END $$;
