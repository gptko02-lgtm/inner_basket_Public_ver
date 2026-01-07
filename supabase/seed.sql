-- Insert default category
INSERT INTO categories (name) VALUES
    ('메인');

-- Insert sample curriculums (using the actual UUIDs that will be generated)
-- Note: You may need to adjust the category_id values after running schema.sql
-- For demo purposes, we'll use placeholders that you should replace with actual UUIDs

-- Insert content library items
INSERT INTO content_library (number, title, details) VALUES
    ('1', 'AI의 정의', '인공지능의 개념과 범위를 설명합니다'),
    ('2', 'AI의 역사', '튜링 테스트부터 현대 AI까지의 발전 과정'),
    ('3', 'AI의 응용 분야', '산업별 AI 활용 사례와 전망'),
    ('4', '머신러닝 개요', '지도학습, 비지도학습, 강화학습 소개'),
    ('5', '데이터 전처리', '결측치 처리, 정규화, 스케일링 기법'),
    ('6', '모델 평가', '정확도, 정밀도, 재현율, F1 스코어'),
    ('7', '과적합과 과소적합', '모델의 일반화 능력 향상 방법'),
    ('8', '신경망 구조', '입력층, 은닉층, 출력층의 역할');
