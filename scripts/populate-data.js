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

async function populateData() {
    console.log('🚀 Starting to populate sample data...\n');

    try {
        // Read the SQL file
        const sqlPath = path.resolve(__dirname, '../supabase/populate-sample-data.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 SQL file loaded successfully');
        console.log('⚠️  Note: This script uses the Supabase client which has limitations.');
        console.log('⚠️  For best results, copy the SQL content and run it directly in Supabase SQL Editor.\n');
        console.log('📋 SQL File Path:', sqlPath);
        console.log('\n' + '='.repeat(60));
        console.log('INSTRUCTIONS:');
        console.log('='.repeat(60));
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Create a new query');
        console.log('4. Copy and paste the contents of:');
        console.log('   ' + sqlPath);
        console.log('5. Click "Run" to execute the SQL');
        console.log('='.repeat(60) + '\n');

        // Alternative: Try to insert data using Supabase client (limited functionality)
        console.log('Attempting to insert basic data using Supabase client...\n');

        // Insert categories
        const categories = [
            { name: 'AI 기초' },
            { name: '실무 AI 활용' },
            { name: '데이터 분석' },
            { name: '프로그래밍' },
            { name: '마케팅' }
        ];

        console.log('📁 Inserting categories...');
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .upsert(categories, { onConflict: 'name', ignoreDuplicates: true })
            .select();

        if (categoryError) {
            console.error('❌ Category insertion error:', categoryError.message);
        } else {
            console.log(`✅ Categories inserted: ${categoryData?.length || 0} items`);
        }

        // Insert sample content library items
        const contentItems = [
            { details: '영상으로 살펴보는 생성 AI 발전 현황', duration: 15, type: '이론' },
            { details: '생성 AI 이해와 활용사례', duration: 20, type: '이론' },
            { details: 'ChatGPT UI 및 사용법 소개', duration: 10, type: '시연' },
            { details: '프롬프트 엔지니어가 추천하는 ChatGPT 기본 세팅', duration: 15, type: '실습' },
            { details: '프롬프트 작성의 기본 3단 구조(메인요청-세부조건-참고자료)', duration: 20, type: '이론' }
        ];

        console.log('📚 Inserting content library items...');
        const { data: contentData, error: contentError } = await supabase
            .from('content_library')
            .insert(contentItems)
            .select();

        if (contentError) {
            console.error('❌ Content library insertion error:', contentError.message);
        } else {
            console.log(`✅ Content library items inserted: ${contentData?.length || 0} items`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('⚠️  IMPORTANT: For complete data population including the');
        console.log('   full curriculum, please run the SQL file directly in');
        console.log('   Supabase SQL Editor as instructed above.');
        console.log('='.repeat(60));

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        process.exit(1);
    }
}

populateData();
