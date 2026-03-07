-- ─── ROA Finance — Phase 3 Schema ───────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. page_components: 홈 페이지 CMS 컴포넌트 레이아웃
CREATE TABLE IF NOT EXISTS page_components (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page         TEXT        NOT NULL    DEFAULT 'home',
  component_key TEXT       NOT NULL,
  enabled      BOOLEAN     NOT NULL    DEFAULT true,
  "order"      INTEGER     NOT NULL    DEFAULT 0,
  config       JSONB       NOT NULL    DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_components_page_order
  ON page_components(page, "order");

-- RLS: 공개 읽기, 쓰기는 service_role 전용
ALTER TABLE page_components ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read" ON page_components;
CREATE POLICY "public_read" ON page_components
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_write" ON page_components;
CREATE POLICY "service_write" ON page_components
  FOR ALL USING (auth.role() = 'service_role');

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS page_components_updated_at ON page_components;
CREATE TRIGGER page_components_updated_at
  BEFORE UPDATE ON page_components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE page_components;

-- ─────────────────────────────────────────────────────────────────────────────

-- 2. members: 이메일 무료 멤버십
CREATE TABLE IF NOT EXISTS members (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        UNIQUE NOT NULL,
  active     BOOLEAN     NOT NULL    DEFAULT true,
  source     TEXT                    DEFAULT 'web',  -- 'web' | 'ios'
  created_at TIMESTAMPTZ NOT NULL    DEFAULT NOW()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_only" ON members;
CREATE POLICY "service_only" ON members
  FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────────────────────

-- 3. 초기 홈 레이아웃 데이터 삽입
INSERT INTO page_components (page, component_key, enabled, "order", config) VALUES
  ('home', 'promo-banner',      false, 0, '{"text":"오늘 가입하면 전체 아카이브를 무료로 열람할 수 있어요","ctaText":"무료 가입","ctaLink":"/membership","bgColor":"#E8D5B0","textColor":"#0A0A0A","enabled":true}'),
  ('home', 'hero-today',        true,  1, '{"badgeText":"오늘의 노트","showCountdown":true,"ctaText":"전문 읽기"}'),
  ('home', 'series-carousel',   true,  2, '{"title":"시리즈로 읽기","seriesIds":[],"showAll":true}'),
  ('home', 'article-grid',      true,  3, '{"title":"아카이브","limit":9}'),
  ('home', 'membership-banner', true,  4, '{"headline":"지나간 글은 멤버만 읽을 수 있어요","subtext":"이메일 하나로 무료 가입. 모든 아카이브 글과 시리즈를 열람하세요.","ctaText":"무료로 멤버 가입하기","showBenefits":true}')
ON CONFLICT DO NOTHING;
