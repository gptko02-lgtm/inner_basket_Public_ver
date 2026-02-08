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
    console.error('❌ Error: Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('🔍 Supabase 스키마 확인 중...\n');

    try {
        // Get all tables using RPC or direct query
        console.log('📋 데이터베이스 테이블 목록:\n');

        // Try to query each expected table
        const tables = ['categories', 'curriculums', 'curriculum_items', 'content_library'];

        for (const tableName of tables) {
            console.log(`\n📊 테이블: ${tableName}`);
            console.log('='.repeat(50));

            const { data, error, count } = await supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`   ❌ 에러: ${error.message}`);
                console.log(`   코드: ${error.code}`);
                console.log(`   상세: ${error.details || 'N/A'}`);
            } else {
                console.log(`   ✅ 존재함 (${count || 0}개 행)`);

                // Get first row to see structure
                const { data: sample } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);

                if (sample && sample.length > 0) {
                    console.log(`   컬럼: ${Object.keys(sample[0]).join(', ')}`);
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('스키마 확인 완료!');

    } catch (err) {
        console.error('❌ 예상치 못한 에러:', err);
    }
}

checkSchema();
