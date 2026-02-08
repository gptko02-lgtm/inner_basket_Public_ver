const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('🔍 Supabase 진단 시작...\n');
    console.log('📋 연결 정보:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');

    try {
        // Check categories
        console.log('1️⃣ 카테고리 확인...');
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*');

        if (catError) {
            console.error('   ❌ 에러:', catError.message);
            console.error('   코드:', catError.code);
        } else {
            console.log(`   ✅ 카테고리 ${categories?.length || 0}개 발견`);
            if (categories && categories.length > 0) {
                categories.forEach(cat => {
                    console.log(`      - ${cat.name} (${cat.id})`);
                });
            }
        }
        console.log('');

        // Check curriculums
        console.log('2️⃣ 커리큘럼 확인...');
        const { data: curriculums, error: currError } = await supabase
            .from('curriculums')
            .select('*');

        if (currError) {
            console.error('   ❌ 에러:', currError.message);
            console.error('   코드:', currError.code);
        } else {
            console.log(`   ✅ 커리큘럼 ${curriculums?.length || 0}개 발견`);
            if (curriculums && curriculums.length > 0) {
                curriculums.forEach(curr => {
                    console.log(`      - ${curr.title} (${curr.duration}분)`);
                });
            }
        }
        console.log('');

        // Check content library
        console.log('3️⃣ 콘텐츠 라이브러리 확인...');
        const { data: contents, error: contError } = await supabase
            .from('content_library')
            .select('*')
            .limit(5);

        if (contError) {
            console.error('   ❌ 에러:', contError.message);
            console.error('   코드:', contError.code);
        } else {
            console.log(`   ✅ 콘텐츠 ${contents?.length || 0}개 발견 (최대 5개만 표시)`);
            if (contents && contents.length > 0) {
                contents.forEach(cont => {
                    console.log(`      - ${cont.details.substring(0, 50)}... (${cont.duration}분, ${cont.type || 'N/A'})`);
                });
            }
        }
        console.log('');

        // Check curriculum items
        console.log('4️⃣ 커리큘럼 아이템 확인...');
        const { data: items, error: itemError } = await supabase
            .from('curriculum_items')
            .select('*');

        if (itemError) {
            console.error('   ❌ 에러:', itemError.message);
            console.error('   코드:', itemError.code);
        } else {
            console.log(`   ✅ 커리큘럼 아이템 ${items?.length || 0}개 발견`);
            if (items && items.length > 0) {
                items.forEach(item => {
                    console.log(`      - ${item.title}`);
                });
            }
        }
        console.log('');

        console.log('='.repeat(60));
        console.log('진단 완료!');
        console.log('='.repeat(60));

    } catch (err) {
        console.error('❌ 예상치 못한 에러:', err);
    }
}

diagnose();
