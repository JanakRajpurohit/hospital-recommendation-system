import pandas as pd

df = pd.read_csv(
    "india_hospital_database_cleaned.csv"
)
# CLEAN NULLS

df = df.fillna("")

print("Dataset Loaded")
print("Total Rows:", len(df))


def recommend_hospitals(
    disease="",
    state="",
    city="",
    budget=""
):

    filtered = df.copy()

    # STATE

    if state:

        filtered = filtered[
            filtered["state"]
            .astype(str)
            .str.lower()
            .str.contains(state.lower(), na=False)
        ]

    # CITY

    if city:

        filtered = filtered[
            filtered["city"]
            .astype(str)
            .str.lower()
            .str.contains(city.lower(), na=False)
        ]

    # BUDGET

    if budget:

        filtered = filtered[
            filtered["budget_category"]
            .astype(str)
            .str.lower()
            .str.contains(budget.lower(), na=False)
        ]

    # DISEASE

    if disease:

        filtered = filtered[
            (
                filtered["diseases_treated"]
                .astype(str)
                .str.lower()
                .str.contains(disease.lower(), na=False)
            )
            |
            (
                filtered["specialties"]
                .astype(str)
                .str.lower()
                .str.contains(disease.lower(), na=False)
            )
        ]

    # SORT

    if "patient_rating" in filtered.columns:

        filtered = filtered.sort_values(
            by="patient_rating",
            ascending=False
        )

    return filtered.head(20)