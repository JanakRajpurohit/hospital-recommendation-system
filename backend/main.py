from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# IMPORT FROM recommendation.py

from recommendation import (
    recommend_hospitals,
    df
)

app = FastAPI()

# ENABLE CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MAIN API

@app.get("/recommend")
def recommend(
    disease: str = "",
    state: str = "",
    city: str = "",
    budget: str = ""
):

    results = recommend_hospitals(
        disease,
        state,
        city,
        budget
    )

    return results.to_dict(
        orient="records"
    )

# DISEASE SUGGESTIONS

@app.get("/diseases")
def get_diseases():

    diseases = []

    for item in df["diseases_treated"]:

        if item:

            split_data = str(item).split("|")

            for disease in split_data:

                disease = disease.strip()

                if disease not in diseases:

                    diseases.append(disease)

    return sorted(diseases)

# STATES

@app.get("/states")
def get_states():

    return sorted(
        df["state"]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )

# CITIES

@app.get("/cities")
def get_cities():

    return sorted(
        df["city"]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )