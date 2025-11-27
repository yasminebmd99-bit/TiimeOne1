-- Schéma de base de données Supabase pour TimeOne Staffy

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des codes NAF
CREATE TABLE IF NOT EXISTS naf_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  query TEXT NOT NULL,
  departments TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'non injecté',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_naf_codes_project_id ON naf_codes(project_id);
CREATE INDEX IF NOT EXISTS idx_naf_codes_status ON naf_codes(status);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_naf_codes_updated_at ON naf_codes;
CREATE TRIGGER update_naf_codes_updated_at
  BEFORE UPDATE ON naf_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insérer les projets par défaut
INSERT INTO projects (id, name) VALUES
  ('6xpos', '6xpos'),
  ('ayvens', 'Ayvens'),
  ('canal', 'Canal+'),
  ('danone', 'Danone'),
  ('ebp', 'EBP'),
  ('herschenbach', 'Herschenbach'),
  ('hyundai', 'Hyundai Pro'),
  ('quadra', 'Quadra'),
  ('sage', 'Sage'),
  ('staffy', 'Staffy')
ON CONFLICT (id) DO NOTHING;

-- Activer Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE naf_codes ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (permettre toutes les opérations pour l'instant)
-- Vous pouvez les ajuster selon vos besoins de sécurité
CREATE POLICY "Enable all operations for projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for naf_codes" ON naf_codes
  FOR ALL USING (true) WITH CHECK (true);
