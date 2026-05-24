import pandas as pd
from sqlalchemy import create_engine

# Read CSV file
df = pd.read_csv(
    r"C:\Users\rajpu\OneDrive\Desktop\hosptalsystem\hospital-recommendation-system\dataset\india_hospital_database_cleaned.csv"
)

print(df.head())

# PostgreSQL connection
engine = create_engine(
    "postgresql://postgres:root%40123@localhost:5432/hospital_db"
)

# Upload data
df.to_sql(
    "hospitals",
    engine,
    if_exists="replace",
    index=False
)

print("Data imported successfully!")