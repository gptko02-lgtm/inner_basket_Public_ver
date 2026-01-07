-- content_library 테이블에서 number와 title 컬럼 제거
ALTER TABLE content_library 
DROP COLUMN IF EXISTS number,
DROP COLUMN IF EXISTS title;

-- duration이 NULL이면 안되므로 NOT NULL 설정
ALTER TABLE content_library 
ALTER COLUMN duration SET NOT NULL,
ALTER COLUMN duration SET DEFAULT 0;
