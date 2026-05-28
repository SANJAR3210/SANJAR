-- ============================================
-- Миграция: База данных ПО Движения Первых ТТИТ
-- ============================================

-- Таблица участников
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  phone TEXT,
  vk_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица мероприятий
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  vk_post_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Связующая таблица: участники и мероприятия
CREATE TABLE IF NOT EXISTS member_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, event_id)
);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Включаем RLS на всех таблицах
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_events ENABLE ROW LEVEL SECURITY;

-- Политика: Все могут читать участников
CREATE POLICY "Allow public read members"
  ON members FOR SELECT
  TO anon, authenticated
  USING (true);

-- Политика: Все могут читать мероприятия
CREATE POLICY "Allow public read events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Политика: Все могут читать связи
CREATE POLICY "Allow public read member_events"
  ON member_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Политика: Только authenticated могут изменять данные
-- (Админ-проверка делается на фронтенде через SHA256)
CREATE POLICY "Allow authenticated insert members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update members"
  ON members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete members"
  ON members FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert member_events"
  ON member_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete member_events"
  ON member_events FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Индексы для производительности
-- ============================================
CREATE INDEX IF NOT EXISTS idx_members_full_name ON members(full_name);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_member_events_member_id ON member_events(member_id);
CREATE INDEX IF NOT EXISTS idx_member_events_event_id ON member_events(event_id);
