-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculums table
CREATE TABLE curriculums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculum_items table
CREATE TABLE curriculum_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    learning_objectives TEXT,
    duration INTEGER NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_library table
CREATE TABLE content_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    details TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_curriculums_category_id ON curriculums(category_id);
CREATE INDEX idx_curriculum_items_curriculum_id ON curriculum_items(curriculum_id);
CREATE INDEX idx_curriculum_items_category_id ON curriculum_items(category_id);
