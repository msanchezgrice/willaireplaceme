-- AI Capability Tracker table
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

-- Insert the CSV data
INSERT INTO ai_capability_tracker (id, industry, role, sub_role, main_workflow, subroutine, risk_level, ai_coverage, impact_type, tools, tool_urls) VALUES
('f1809d59', 'Product Mgmt', 'Product Manager', 'General', 'Automation', 'Alert noise reduction', 'Moderate', 'PA', 'Complemented', 'LawGeex', 'https://www.lawgeex.com'),
('b1521a2a', 'Product Mgmt', 'Product Manager', 'General', 'Reporting', 'Variance analysis narrative', 'Moderate', 'PA', 'Complemented', 'ChatGPT', 'https://chat.openai.com'),
('dba47cf0', 'Product Mgmt', 'Product Manager', 'General', 'Analysis', 'Sentiment analysis', 'Low', 'AO', 'Complemented', 'GA4 Insight Finder', 'https://support.google.com/analytics/answer/9443595'),
('3fe2bf3c', 'Product Mgmt', 'Product Manager', 'General', 'Analysis', 'Competitive benchmarking', 'Low', 'AO', 'Complemented', 'Adobe Firefly', 'https://www.adobe.com/products/firefly.html'),
('2ae9357d', 'Product Mgmt', 'Product Manager', 'General', 'Analysis', 'Trend forecasting', 'High', 'PA', 'Replaced', 'MindBridge', 'https://www.mindbridge.ai'),
('b57b40ed', 'Product Mgmt', 'Product Manager', 'General', 'Creative', 'Concept art', 'Moderate', 'PA', 'Complemented', 'Adobe Firefly', 'https://www.adobe.com/products/firefly.html'),
('167d07cb', 'Product Mgmt', 'Product Manager', 'General', 'Testing', 'Load test script', 'High', 'PA', 'Replaced', 'MindBridge', 'https://www.mindbridge.ai'),
('8f67485f', 'Product Mgmt', 'Product Manager', 'General', 'Testing', 'User-testing summary', 'Moderate', 'PA', 'Complemented', 'MindBridge', 'https://www.mindbridge.ai'),
('7215672c', 'Product Mgmt', 'Product Owner', 'General', 'Automation', 'Invoice OCR', 'Low', 'AO', 'Complemented', 'Adobe Firefly', 'https://www.adobe.com/products/firefly.html'),
('1cf0ed71', 'Product Mgmt', 'Product Owner', 'General', 'Reporting', 'Variance analysis narrative', 'Moderate', 'PA', 'Complemented', 'Google Performance Max', 'https://ads.google.com/performance-max'),
('dc61c331', 'Product Mgmt', 'Product Owner', 'General', 'Analysis', 'Earnings call summary', 'Low', 'AO', 'Complemented', 'LawGeex', 'https://www.lawgeex.com'),
('c2757a19', 'Product Mgmt', 'Product Owner', 'General', 'Creative', 'Concept art', 'High', 'PA', 'Replaced', 'Jasper', 'https://jasper.ai'),
('8eafdfa4', 'Product Mgmt', 'Product Owner', 'General', 'Testing', 'Load test script', 'Moderate', 'PA', 'Complemented', 'ChatGPT', 'https://chat.openai.com'),
('115f09af', 'Product Mgmt', 'Product Owner', 'General', 'Testing', 'User-testing summary', 'Moderate', 'PA', 'Complemented', 'Google Performance Max', 'https://ads.google.com/performance-max'),
('29b2bbb9', 'Product Mgmt', 'Data PM', 'General', 'Automation', 'Ticket triage', 'Low', 'AO', 'Complemented', 'Adobe Firefly', 'https://www.adobe.com/products/firefly.html'),
('555ae199', 'Product Mgmt', 'Data PM', 'General', 'Automation', 'Alert noise reduction', 'Low', 'AO', 'Complemented', 'Otter.ai', 'https://otter.ai'),
('5b870a29', 'Product Mgmt', 'Data PM', 'General', 'Reporting', 'Monthly KPI deck', 'Low', 'AO', 'Complemented', 'Google Performance Max', 'https://ads.google.com/performance-max'),
('87e66826', 'Product Mgmt', 'Data PM', 'General', 'Reporting', 'Pipeline dashboard', 'Low', 'AO', 'Complemented', 'GA4 Insight Finder', 'https://support.google.com/analytics/answer/9443595'),
('dadf9595', 'Product Mgmt', 'Data PM', 'General', 'Reporting', 'Variance analysis narrative', 'Moderate', 'PA', 'Complemented', 'Tableau Pulse', 'https://www.tableau.com/products/new-features/tableau-pulse'),
('e72d485f', 'Product Mgmt', 'Data PM', 'General', 'Analysis', 'Competitive benchmarking', 'High', 'PA', 'Replaced', 'GitHub Copilot', 'https://github.com/features/copilot'),
('a3783d3a', 'Product Mgmt', 'Data PM', 'General', 'Analysis', 'Trend forecasting', 'Low', 'AO', 'Complemented', 'Tableau Pulse', 'https://www.tableau.com/products/new-features/tableau-pulse'),
('9e6f881e', 'Product Mgmt', 'Data PM', 'General', 'Creative', 'Ad graphic generation', 'Moderate', 'PA', 'Complemented', 'Tableau Pulse', 'https://www.tableau.com/products/new-features/tableau-pulse'),
('8cc2b41b', 'Product Mgmt', 'Data PM', 'General', 'Creative', 'Blog outline', 'Moderate', 'PA', 'Complemented', 'Google Performance Max', 'https://ads.google.com/performance-max'),
('06058c93', 'Product Mgmt', 'Data PM', 'General', 'Creative', 'Lesson plan draft', 'Moderate', 'PA', 'Complemented', 'MindBridge', 'https://www.mindbridge.ai'),
('0e2ea7b1', 'Product Mgmt', 'Data PM', 'General', 'Testing', 'User-testing summary', 'Low', 'AO', 'Complemented', 'ChatGPT', 'https://chat.openai.com'),
('9d378a20', 'Design', 'UX/UI Designer', 'General', 'Automation', 'Invoice OCR', 'Low', 'AO', 'Complemented', 'Jasper', 'https://jasper.ai'),
('d892864d', 'Design', 'UX/UI Designer', 'General', 'Automation', 'Ticket triage', 'Moderate', 'PA', 'Complemented', 'LawGeex', 'https://www.lawgeex.com'),
('c303050d', 'Design', 'UX/UI Designer', 'General', 'Automation', 'Alert noise reduction', 'Low', 'AO', 'Complemented', 'GitHub Copilot', 'https://github.com/features/copilot'),
('b0e9480f', 'Design', 'UX/UI Designer', 'General', 'Reporting', 'Pipeline dashboard', 'High', 'PA', 'Replaced', 'GitHub Copilot', 'https://github.com/features/copilot'),
('b3180dbe', 'Design', 'UX/UI Designer', 'General', 'Analysis', 'Sentiment analysis', 'Moderate', 'PA', 'Complemented', 'Google Performance Max', 'https://ads.google.com/performance-max'),
('0ae2a842', 'Design', 'UX/UI Designer', 'General', 'Analysis', 'Competitive benchmarking', 'Low', 'AO', 'Complemented', 'HashiCorp Ai/Code', 'https://developer.hashicorp.com/terraform/cloud/aicode'),
('9a9f5855', 'Design', 'UX/UI Designer', 'General', 'Testing', 'Unit test generation', 'Low', 'AO', 'Complemented', 'Otter.ai', 'https://otter.ai'),
('00c48402', 'Design', 'UX/UI Designer', 'General', 'Testing', 'User-testing summary', 'Low', 'AO', 'Complemented', 'ChatGPT', 'https://chat.openai.com'),
('651b9cc5', 'Design', 'Graphic Designer', 'General', 'Automation', 'Invoice OCR', 'Low', 'AO', 'Complemented', 'GitHub Copilot', 'https://github.com/features/copilot'),
('04344562', 'Design', 'Graphic Designer', 'General', 'Automation', 'Alert noise reduction', 'Moderate', 'PA', 'Complemented', 'GA4 Insight Finder', 'https://support.google.com/analytics/answer/9443595'),
('c065d787', 'Design', 'Graphic Designer', 'General', 'Reporting', 'Variance analysis narrative', 'Low', 'AO', 'Complemented', 'Tableau Pulse', 'https://www.tableau.com/products/new-features/tableau-pulse'),
('0cba590f', 'Design', 'Graphic Designer', 'General', 'Analysis', 'Sentiment analysis', 'Moderate', 'PA', 'Complemented', 'Otter.ai', 'https://otter.ai'),
('7244a4a0', 'Design', 'Graphic Designer', 'General', 'Analysis', 'Earnings call summary', 'Moderate', 'PA', 'Complemented', 'Adobe Firefly', 'https://www.adobe.com/products/firefly.html'),
('e1cdb345', 'Design', 'Graphic Designer', 'General', 'Creative', 'Ad graphic generation', 'Low', 'AO', 'Complemented', 'Jasper', 'https://jasper.ai'),
('d645a995', 'Design', 'Graphic Designer', 'General', 'Creative', 'Blog outline', 'High', 'PA', 'Replaced', 'Jasper', 'https://jasper.ai'),
('8549e922', 'Design', 'Graphic Designer', 'General', 'Creative', 'Concept art', 'Moderate', 'PA', 'Complemented', 'Adobe Firefly', 'https://www.adobe.com/products/firefly.html'),
('c6962470', 'Design', 'UX Researcher', 'General', 'Automation', 'Data entry', 'High', 'PA', 'Replaced', 'MindBridge', 'https://www.mindbridge.ai'),
('5e8d65f6', 'Design', 'UX Researcher', 'General', 'Automation', 'Alert noise reduction', 'Moderate', 'PA', 'Complemented', 'Otter.ai', 'https://otter.ai'),
('3dcf13ef', 'Design', 'UX Researcher', 'General', 'Reporting', 'Monthly KPI deck', 'High', 'PA', 'Replaced', 'Jasper', 'https://jasper.ai'),
('212b4b7f', 'Design', 'UX Researcher', 'General', 'Reporting', 'Variance analysis narrative', 'High', 'PA', 'Replaced', 'GitHub Copilot', 'https://github.com/features/copilot'),
('d3cb076c', 'Design', 'UX Researcher', 'General', 'Analysis', 'Sentiment analysis', 'High', 'PA', 'Replaced', 'Tableau Pulse', 'https://www.tableau.com/products/new-features/tableau-pulse'),
('16325309', 'Design', 'UX Researcher', 'General', 'Analysis', 'Earnings call summary', 'Moderate', 'PA', 'Complemented', 'Google Performance Max', 'https://ads.google.com/performance-max'),
('057d563a', 'Design', 'UX Researcher', 'General', 'Creative', 'Concept art', 'Moderate', 'PA', 'Complemented', 'LawGeex', 'https://www.lawgeex.com'),
('40372cbe', 'Design', 'UX Researcher', 'General', 'Testing', 'Unit test generation', 'High', 'PA', 'Replaced', 'HashiCorp Ai/Code', 'https://developer.hashicorp.com/terraform/cloud/aicode'),
('7662be6c', 'Design', 'UX Researcher', 'General', 'Testing', 'Load test script', 'Moderate', 'PA', 'Complemented', 'ChatGPT', 'https://chat.openai.com'),
('e6c58ffa', 'Design', 'UX Researcher', 'General', 'Testing', 'User-testing summary', 'High', 'PA', 'Replaced', 'Tableau Pulse', 'https://www.tableau.com/products/new-features/tableau-pulse');

-- I'll continue with a script to import the rest of the data... 