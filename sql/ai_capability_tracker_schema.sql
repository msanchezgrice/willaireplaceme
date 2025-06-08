-- AI Capability Tracker table schema
CREATE TABLE IF NOT EXISTS ai_capability_tracker (
  id VARCHAR(8) PRIMARY KEY,
  industry VARCHAR(50) NOT NULL,
  role VARCHAR(100) NOT NULL,
  sub_role VARCHAR(50),
  main_workflow VARCHAR(50) NOT NULL,
  subroutine VARCHAR(200) NOT NULL,
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High')),
  ai_coverage VARCHAR(10) NOT NULL CHECK (ai_coverage IN ('PA', 'AO')),
  impact_type VARCHAR(20) NOT NULL CHECK (impact_type IN ('Replaced', 'Complemented')),
  tools VARCHAR(100) NOT NULL,
  tool_urls TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_tracker_industry ON ai_capability_tracker(industry);
CREATE INDEX IF NOT EXISTS idx_ai_tracker_role ON ai_capability_tracker(role);
CREATE INDEX IF NOT EXISTS idx_ai_tracker_risk_level ON ai_capability_tracker(risk_level);
CREATE INDEX IF NOT EXISTS idx_ai_tracker_impact_type ON ai_capability_tracker(impact_type);
CREATE INDEX IF NOT EXISTS idx_ai_tracker_main_workflow ON ai_capability_tracker(main_workflow);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_capability_tracker ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is for signed-out users)
CREATE POLICY "Public read access" ON ai_capability_tracker
  FOR SELECT
  USING (true); 