#!/usr/bin/env python3
import csv
import sys

def escape_sql(text):
    if text is None or text == '':
        return 'NULL'
    return "'" + text.replace("'", "''") + "'"

# Read the CSV and generate SQL inserts
with open('ai_capability_tracker_160.csv', 'r') as f:
    reader = csv.DictReader(f)
    
    print('-- Insert all AI capability tracker data')
    print('INSERT INTO ai_capability_tracker (id, industry, role, sub_role, main_workflow, subroutine, risk_level, ai_coverage, impact_type, tools, tool_urls) VALUES')
    
    rows = []
    for row in reader:
        values = f"({escape_sql(row['id'])}, {escape_sql(row['industry'])}, {escape_sql(row['role'])}, {escape_sql(row['sub_role'])}, {escape_sql(row['main_workflow'])}, {escape_sql(row['subroutine'])}, {escape_sql(row['risk_level'])}, {escape_sql(row['ai_coverage'])}, {escape_sql(row['impact_type'])}, {escape_sql(row['tools'])}, {escape_sql(row['tool_urls'])})"
        rows.append(values)
    
    # Print all rows
    print(',\n'.join(rows) + ';') 