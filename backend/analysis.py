import pandas as pd
import numpy as np

def detect_columns(df):
    """
    Intelligently identifies key columns (amount, date, category) 
    using keyword matching (exact and substring).
    """
    mapping = {'amount': None, 'date': None, 'category': None}
    
    keywords = {
        'amount': ['amount', 'sales', 'revenue', 'price', 'value', 'total', 'cost'],
        'date': ['date', 'time', 'day', 'created_at', 'timestamp'],
        'category': ['category', 'type', 'product', 'item', 'segment', 'market']
    }
    
    # 1. Exact Matches (Case-insensitive)
    cols_lower = {c.lower(): c for c in df.columns}
    for key, words in keywords.items():
        for word in words:
            if word in cols_lower:
                mapping[key] = cols_lower[word]
                break
                
    # 2. Substring Matches (if no exact match found)
    for key, words in keywords.items():
        if mapping[key]: continue
        for col in df.columns:
            for word in words:
                if word in col.lower():
                    mapping[key] = col
                    break
            if mapping[key]: break
            
    return mapping

def process_data(file_content):
    """
    Reads a CSV file, cleans it, and returns the dataframe and a quality score.
    """
    try:
        # Read CSV
        df = pd.read_csv(file_content)
        
        # Initial stats
        initial_rows = len(df)
        total_cells = df.size
        missing_cells = df.isnull().sum().sum()
        
        # SMART CLEANING
        # 1. Drop completely empty rows
        df.dropna(how='all', inplace=True)
        dropped_rows = initial_rows - len(df)
        
        # 2. Fill missing numeric values with median
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if not numeric_cols.empty:
            df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        
        # 3. Fill missing text values with "Unknown"
        text_cols = df.select_dtypes(include=['object']).columns
        if not text_cols.empty:
            df[text_cols] = df[text_cols].fillna("Unknown")
        
        # Calculate Data Quality Score
        quality_score = 0
        if total_cells > 0:
            quality_score = max(0, min(100, (1 - (missing_cells / total_cells)) * 100))
        
        return df, round(quality_score, 1)
        
    except Exception as e:
        print(f"Error processing data: {e}")
        return pd.DataFrame(), 0

def calculate_kpis(df):
    """
    Calculates key performance indicators.
    """
    mapping = detect_columns(df)
    amount_col = mapping['amount']
    # category_col is not strictly needed for these basic KPIs but useful for robustness check
    
    kpis = {
        "total_sales": 0,
        "avg_order_value": 0,
        "total_orders": 0,
        "top_category": "N/A"
    }
    
    if not df.empty:
        kpis["total_orders"] = int(len(df))
        
        if amount_col:
            try:
                # Ensure it's numeric
                df[amount_col] = pd.to_numeric(df[amount_col], errors='coerce').fillna(0)
                kpis["total_sales"] = float(df[amount_col].sum())
                kpis["avg_order_value"] = float(df[amount_col].mean())
            except:
                pass

        category_col = mapping['category']
        if category_col:
            try:
                kpis["top_category"] = str(df[category_col].mode()[0]) if not df[category_col].empty else "N/A"
            except:
                pass
        
    return kpis

def generate_insights(df, kpis):
    """
    Generates text-based insights based on the data.
    """
    insights = []
    
    mapping = detect_columns(df)
    amount_col = mapping['amount']
    category_col = mapping['category']
    
    # 1. High Value Orders
    if kpis['total_orders'] > 0:
        if kpis['avg_order_value'] > 100:
            insights.append("🌟 High Order Value: Your customers are spending significantly per transaction.")
        else:
            insights.append("💡 Opportunity: Try bundling products to increase Average Order Value.")
            
    # 2. Pareto Principle (80/20 Rule) Check
    if amount_col and category_col:
        try:
            # Group by category
            cat_sales = df.groupby(category_col)[amount_col].sum().sort_values(ascending=False)
            
            if not cat_sales.empty:
                top_20_percent_count = max(1, int(len(cat_sales) * 0.2))
                top_sales = cat_sales.head(top_20_percent_count).sum()
                total_sales = cat_sales.sum()
                
                if total_sales > 0:
                    if top_sales > (total_sales * 0.5):
                        insights.append(f"⚠️ Risk Alert: {(top_sales/total_sales)*100:.0f}% of your revenue comes from just the top {top_20_percent_count} categories.")
                    else:
                        insights.append("✅ Balanced Revenue: Your sales are well-distributed across categories.")
        except Exception:
            pass
        
    return insights

def generate_trends(df):
    mapping = detect_columns(df)
    date_col = mapping['date']
    amount_col = mapping['amount']
    
    if date_col and amount_col:
        try:
            # Create a copy to avoid SettingWithCopy warnings on the main df if used elsewhere
            # though here it's fine as we are inside a function
            df_trend = df.copy()
            
            df_trend[date_col] = pd.to_datetime(df_trend[date_col], errors='coerce')
            df_trend = df_trend.dropna(subset=[date_col])
            
            if df_trend.empty:
                return []

            # Aggregate by month
            # We use 'M' for month end frequency
            monthly_sales = df_trend.groupby(df_trend[date_col].dt.to_period("M"))[amount_col].sum()
            
            # Convert to list of dicts for frontend
            trend_data = [{"date": str(period), "sales": float(val)} for period, val in monthly_sales.items()]
            
            # Sort by date string (YYYY-MM)
            trend_data.sort(key=lambda x: x['date'])
            return trend_data
        except Exception as e:
            print(f"Error generating trends: {e}")
            return []
            
    return []
