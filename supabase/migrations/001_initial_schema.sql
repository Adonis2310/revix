-- ============================================================
-- Revix — Initial Database Schema
-- Honda XR150L 2025 Maintenance Tracker
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_km      INTEGER NOT NULL DEFAULT 0,
  last_service_km INTEGER NOT NULL DEFAULT 0,
  bike_model      TEXT    NOT NULL DEFAULT 'Honda XR150L 2025',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Maintenance sessions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.maintenance_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_km    INTEGER NOT NULL,
  completed_km    INTEGER NOT NULL,
  service_type    TEXT    NOT NULL CHECK (service_type IN ('regular','intermediate','major','comprehensive')),
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Pending tasks (in-progress for current card) ────────────
CREATE TABLE IF NOT EXISTS public.pending_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_km    INTEGER NOT NULL,
  task_id         TEXT    NOT NULL,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, milestone_km, task_id)
);

-- ── Km logs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.km_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  km              INTEGER NOT NULL,
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_maintenance_sessions_user_id
  ON public.maintenance_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_sessions_milestone
  ON public.maintenance_sessions(user_id, milestone_km);

CREATE INDEX IF NOT EXISTS idx_pending_tasks_user_milestone
  ON public.pending_tasks(user_id, milestone_km);

CREATE INDEX IF NOT EXISTS idx_km_logs_user_id
  ON public.km_logs(user_id, logged_at DESC);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.km_logs              ENABLE ROW LEVEL SECURITY;

-- Profiles: users access only their own
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Maintenance sessions
CREATE POLICY "Users can view own sessions"
  ON public.maintenance_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.maintenance_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pending tasks
CREATE POLICY "Users can view own pending tasks"
  ON public.pending_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pending tasks"
  ON public.pending_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending tasks"
  ON public.pending_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Km logs
CREATE POLICY "Users can view own km logs"
  ON public.km_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own km logs"
  ON public.km_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── Auto-update trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Auto-create profile on signup ─────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Profile is created manually during onboarding
  -- This function is a placeholder for future use
  RETURN NEW;
END;
$$;
