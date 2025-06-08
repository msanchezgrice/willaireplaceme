-- Industry Risk Dashboard table schema (CORRECTED)
CREATE TABLE IF NOT EXISTS industry_risk_dashboard (
  id SERIAL PRIMARY KEY,
  industry VARCHAR(100) NOT NULL,
  roles TEXT NOT NULL, -- semicolon-separated list
  timeline VARCHAR(20) NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  impact_type TEXT NOT NULL,
  tools TEXT NOT NULL, -- semicolon-separated list
  workforce_millions DECIMAL(5,2) NOT NULL, -- Changed from 3,2 to 5,2 to handle larger values
  source_name VARCHAR(100) NOT NULL,
  source_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_industry_risk_industry ON industry_risk_dashboard(industry);
CREATE INDEX idx_industry_risk_level ON industry_risk_dashboard(risk_level);
CREATE INDEX idx_industry_risk_timeline ON industry_risk_dashboard(timeline); 