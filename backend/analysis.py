import pandas as pd
import numpy as np
import io
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def detect_columns(df):
    """
    Intelligently identifies key columns (amount, date, category) 
    using keyword matching (exact and substring).
    """
    mapping = {'amount': None, 'date': None, 'category': None, 'name': None, 'email': None}
    
    keywords = {
        'amount': ['amount', 'sales', 'revenue', 'price', 'value', 'total', 'cost', 'temp', 'heart', 'bpm', 'pressure', 'rainfall', 'humidity'],
        'date': ['date', 'time', 'day', 'created_at', 'timestamp', 'observed_at'],
        'category': ['category', 'type', 'product', 'item', 'segment', 'market', 'city', 'condition', 'exercise', 'symptom'],
        'name': ['name', 'customer', 'client', 'user', 'account', 'patient', 'subject'],
        'email': ['email', 'contact', 'mail', 'e-mail', 'provider']
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

def detect_domain(df):
    """
    Classifies the dataset into a domain based on header keywords.
    """
    domain_keywords = {
        'finance': ['sales', 'revenue', 'price', 'cost', 'profit', 'tax', 'bill', 'payment'],
        'health': ['heart', 'bpm', 'pressure', 'symptom', 'patient', 'medical', 'age', 'weight', 'dosage'],
        'weather': ['temp', 'humidity', 'rainfall', 'pressure', 'wind', 'forecast', 'precipitation', 'uv'],
        'business': ['customer', 'client', 'lead', 'churn', 'deal', 'opportunity', 'onboarding']
    }
    
    scores = {domain: 0 for domain in domain_keywords}
    cols_lower = [c.lower() for c in df.columns]
    
    for domain, keywords in domain_keywords.items():
        for word in keywords:
            for col in cols_lower:
                if word in col:
                    scores[domain] += 1
                    
    # The domain with the highest score wins, fallback to 'business'
    max_score = max(scores.values())
    if max_score == 0:
        return 'business'
        
    return max(scores, key=scores.get)

def extract_customers(df):
    """
    Extracts unique customer information from the dataframe.
    Calculates LTV if amount column is present.
    """
    mapping = detect_columns(df)
    name_col = mapping.get('name')
    email_col = mapping.get('email')
    amount_col = mapping.get('amount')
    
    if not name_col and not email_col:
        return []
        
    # Group by customer to calculate LTV
    unique_keys = []
    if email_col: unique_keys.append(email_col)
    if name_col: unique_keys.append(name_col)
    
    temp_df = df.copy()
    if amount_col:
        temp_df[amount_col] = pd.to_numeric(temp_df[amount_col], errors='coerce').fillna(0)
    
    # Aggregate data per customer
    if amount_col:
        customer_stats = temp_df.groupby(unique_keys)[amount_col].agg(['sum', 'count']).reset_index()
    else:
        customer_stats = temp_df.groupby(unique_keys).size().reset_index(name='count')
        customer_stats['sum'] = 0

    # Format for frontend
    final_customers = []
    # Sort by LTV descending or count if no amount
    customer_stats = customer_stats.sort_values('sum', ascending=False).head(10)
    
    for _, row in customer_stats.iterrows():
        name = str(row[name_col]) if name_col else ""
        email = str(row[email_col]) if email_col else ""
        
        initials = "".join([n[0] for n in name.split() if n])[:2].upper() if name else "??"
        if not initials and email:
            initials = email[0].upper()
            
        final_customers.append({
            "name": name,
            "email": email,
            "initials": initials,
            "ltv": float(row['sum']),
            "status": "Active" if row['count'] > 1 else "New",
            "lastSeen": "Recently",
            "segment": "General"
        })
        
    return final_customers

def process_data(file_content):
    """
    Reads a CSV file, cleans it, and returns the dataframe and a quality score.
    Now more robust to different separators and encodings.
    """
    try:
        # Try multiple encodings and separators
        encodings = ['utf-8', 'latin1', 'cp1252']
        separators = [',', ';', '\t']
        
        df = None
        current_error = ""

        # Use a temporary seekable buffer if it's not already
        if not hasattr(file_content, 'seek'):
            file_content = io.BytesIO(file_content.read() if hasattr(file_content, 'read') else file_content)

        for enc in encodings:
            if df is not None: break
            for sep in separators:
                try:
                    file_content.seek(0)
                    temp_df = pd.read_csv(file_content, sep=sep, encoding=enc)
                    # If it only found one column, it might be the wrong separator
                    if len(temp_df.columns) > 1 or len(separators) == 1:
                        df = temp_df
                        break
                except Exception as e:
                    current_error = str(e)
                    continue
        
        if df is None:
            # Final fallback: try default read_csv one last time
            file_content.seek(0)
            df = pd.read_csv(file_content)

        # Initial stats
        initial_rows = len(df)
        total_cells = df.size
        missing_cells = df.isnull().sum().sum()
        
        # SMART CLEANING
        # 1. Drop completely empty rows
        df.dropna(how='all', inplace=True)
        # Also drop rows with no data in the detected key columns
        # (This helps if there's trailing junk in the CSV)
        
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
        print(f"Error processing data: {current_error if 'current_error' in locals() else e}")
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

def generate_segments(df):
    """
    Performs K-Means clustering to segment data into groups.
    Returns segment labels, counts, and average values.
    """
    mapping = detect_columns(df)
    amount_col = mapping['amount']
    category_col = mapping['category']
    
    if not amount_col:
        return {"segments": [], "summary": "No numeric amount column found for segmentation."}
    
    try:
        df_seg = df.copy()
        df_seg[amount_col] = pd.to_numeric(df_seg[amount_col], errors='coerce').fillna(0)
        
        # Build feature matrix
        features = pd.DataFrame()
        features['amount'] = df_seg[amount_col]
        
        # Add category frequency as a feature if available
        if category_col:
            cat_counts = df_seg[category_col].value_counts()
            features['category_frequency'] = df_seg[category_col].map(cat_counts)
        
        # Need at least 3 rows for 3 clusters
        n_clusters = min(3, len(features))
        if n_clusters < 2:
            return {"segments": [], "summary": "Not enough data points for segmentation."}
        
        # Scale features
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)
        
        # Run K-Means
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df_seg['cluster'] = kmeans.fit_predict(scaled_features)
        
        # Assign meaningful labels based on average amount per cluster
        cluster_stats = df_seg.groupby('cluster')[amount_col].agg(['mean', 'count', 'sum']).reset_index()
        cluster_stats = cluster_stats.sort_values('mean', ascending=False)
        
        labels = ['High Value', 'Medium Value', 'Low Value']
        colors = ['#3B82F6', '#8B5CF6', '#F59E0B']
        
        segments = []
        for i, (_, row) in enumerate(cluster_stats.iterrows()):
            label = labels[i] if i < len(labels) else f"Segment {i+1}"
            color = colors[i] if i < len(colors) else '#6B7280'
            segments.append({
                "name": label,
                "count": int(row['count']),
                "avg_value": round(float(row['mean']), 2),
                "total_value": round(float(row['sum']), 2),
                "color": color
            })
        
        # Generate summary text
        top_segment = segments[0] if segments else None
        summary = ""
        if top_segment:
            pct = round((top_segment['count'] / len(df_seg)) * 100, 1)
            summary = f"{top_segment['name']} customers make up {pct}% of your base with avg. spend of ${top_segment['avg_value']:,.2f}."
        
        return {"segments": segments, "summary": summary}
        
    except Exception as e:
        print(f"Error in segmentation: {e}")
        return {"segments": [], "summary": "Could not perform segmentation on this dataset."}

