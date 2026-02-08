const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
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
    console.error('❌ Error: Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
    console.log('🔍 데이터 확인 중...\n');

    try {
        // Check categories
        console.log('📂 카테고리:');
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (catError) {
            console.log(`   ❌ 에러: ${catError.message}`);
        } else {
            console.log(`   ✅ ${categories.length}개 카테고리 발견`);
            categories.forEach(cat => {
                console.log(`      - ${cat.name} (ID: ${cat.id})`);
            });
        }

        // Check curriculums
        console.log('\n📚 커리큘럼:');
        const { data: curriculums, error: currError } = await supabase
            .from('curriculums')
            .select('*')
            .order('title');

        if (currError) {
            console.log(`   ❌ 에러: ${currError.message}`);
        } else {
            console.log(`   ✅ ${curriculums.length}개 커리큘럼 발견`);
            curriculums.forEach(curr => {
                console.log(`      - ${curr.title} (${curr.duration_minutes}분, Category: ${curr.category_id})`);
            });
        }

        // Check curriculum_items
        console.log('\n📝 커리큘럼 아이템:');
        const { data: items, error: itemsError } = await supabase
            .from('curriculum_items')
            .select('*');

        if (itemsError) {
            console.log(`   ❌ 에러: ${itemsError.message}`);
        } else {
            console.log(`   ✅ ${items.length}개 커리큘럼 아이템 발견`);
        }

        // Check content_library
        console.log('\n📖 콘텐츠 라이브러리:');
        const { data: content, error: contentError } = await supabase
            .from('content_library')
            .select('*');

        if (contentError) {
            console.log(`   ❌ 에러: ${contentError.message}`);
        } else {
            console.log(`   ✅ ${content.length}개 콘텐츠 발견`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('확인 완료!');

    } catch (err) {
        console.error('❌ 예상치 못한 에러:', err);
    }
}

verifyData();
