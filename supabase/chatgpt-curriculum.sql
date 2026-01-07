-- ChatGPT 활용 Skill-up 과정 데이터 추가
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. 카테고리가 있는지 확인하고, 없으면 AI 기초 카테고리 ID를 사용
-- 또는 새로운 "실무 AI 활용" 카테고리 생성 (선택사항)

-- 카테고리 ID를 변수에 저장 (AI 기초 카테고리 사용)
DO $$
DECLARE
    v_category_id UUID;
    v_curriculum_id UUID;
BEGIN
    -- 메인 카테고리 ID 가져오기 (없으면 새로 생성)
    SELECT id INTO v_category_id FROM categories WHERE name = '메인' LIMIT 1;
    
    IF v_category_id IS NULL THEN
        INSERT INTO categories (name) VALUES ('메인') RETURNING id INTO v_category_id;
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
        jsonb_build_array(
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '1',
                'title', '[Phase 01] ChatGPT 활용 노하우 및 주의점',
                'details', E'영상으로 살펴보는 생성 AI 발전 현황\n생성 AI 이해와 활용사례\nChatGPT UI 및 사용법 소개\n프롬프트 엔지니어가 추천하는 ChatGPT 기본 세팅\n프롬프트 작성의 기본 3단 구조(메인요청-세부조건-참고자료)\n프롬프트 구체화를 위한 세부 구성요소\n생성 AI 활용 시 주의사항(할루시네이션)\nChatGPT 고급 기능 소개 및 활용법\nChatGPT 이외의 대표적인 생성 AI (Claude, Perplexity, MS Copilot, Gemini)'
            ),
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '2',
                'title', '[Phase 02] ChatGPT 활용 다양한 문서작성',
                'details', E'미팅·회의·통화 내용 요약 및 정리 + STT(음성 텍스트 변환) 활용법\n자사 제품·서비스 소개서 기반 제안서 초안 작성\n월별 매출 데이터 분석 및 프로모션/인사이트 도출\nVOC(Voice of Customer) 데이터 분석 및 FAQ 구성 + 그래프/차트 생성'
            ),
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '3',
                'title', '[Phase 03] 다양한 생성 AI Part.1 : 검색·요약',
                'details', E'[Perplexity AI 활용] 전략 수립을 위한 산업 동향 분석 - 검색 특화 모델을 활용한 분야별 최신 이슈 및 정보 수집\n[NotebookLM 활용] 긴 업무 문서를 요약·정리해 바로 쓰는 방법 - 방대한 텍스트 문서를 이해하기 쉬운 콘텐츠로 재구성 및 질의응답 챗봇화\n[SCISPACE AI 활용] 최신 논문 검색과 인용 가능한 구조 요약 - 논문 구조를 기준으로 핵심 내용을 정리해 참고 문헌 인용이 쉬운 형태로 구성'
            ),
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '4',
                'title', '[Phase 04] 다양한 생성 AI Part.2 : 시각화',
                'details', E'[Claude AI 활용] 바이브코딩으로 업무 데이터 대시보드 만들기 - 입력 데이터에 따라 즉시 업데이트 되는 대시보드 생성 자동화\n[Gemini AI 활용] 데이터/수치 기반 시각화 자료 제작 - 마케팅 캠페인 성과 데이터를 활용한 인포그래픽 생성\n[Napkin AI 활용] 보고서, 발표자료에 활용할 수 있는 도식화 이미지 생성 - 문서 내 특정 파트를 다양한 레이아웃의 이미지로 변환'
            ),
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '5',
                'title', '[Phase 05] 네이버 뉴스·블로그·쇼핑 데이터 수집 자동화',
                'details', E'파이썬 & 구글 Colab 활용 코드 실행 방법 안내\n네이버 API 소개 및 발급방법 안내\n[네이버 뉴스] 특정 키워드 기반 뉴스기사 300건 수집\n[네이버 블로그] 제품 리뷰, 후기 등 바이럴 포스팅 100건 수집\n[네이버 쇼핑] 제품명, 가격, 판매처 등 쇼핑 데이터 100건 수집\n수집 데이터 결과 인사이트 도출'
            ),
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '6',
                'title', '[Phase 06] 이미지 생성 AI를 활용한 브랜드 마스코트 및 홍보 배너 제작',
                'details', E'[Gemini AI 활용] 기업 대표 마스코트, 캐릭터 기획 - 기업의 핵심 가치, 서비스 내용 기반 캐릭터 콘셉트 설계\n[ImageFX 활용] 캐릭터 기본 외형 제작 - 기본 외형 설계를 통한 활용 가능한 캐릭터 형태 구축\n[Gemini AI 활용] 실사용을 고려한 다양한 구도의 시안 생성 - 아트소스, 턴어라운드 등 캐릭터 응용컷 생성\n[Gemini AI 활용] 기업 홍보용 배너 이미지 제작 - 홍보 문구 중심으로 시선이 집중되는 배너 이미지 생성\n[Gemini AI 활용] 캐릭터+로고 활용 배너 완성 - 제작된 배너 이미지에 캐릭터와 기업 로고를 합성해 최종 배너 완성'
            ),
            jsonb_build_object(
                'id', gen_random_uuid()::text,
                'number', '7',
                'title', '[Phase 07] 지속가능한 생성 AI 활용 방안',
                'details', E'생성 AI와 보안 : 자사 데이터를 ChatGPT에서 안전하게 활용하는 방법\n생성 AI 제작물의 저작권 이슈와 사용 가이드라인\n프롬프트 공유 및 관리의 중요성\n질의응답 및 마무리'
            )
        )
    );
    
    RAISE NOTICE '커리큘럼이 성공적으로 추가되었습니다! Curriculum ID: %', v_curriculum_id;
END $$;
