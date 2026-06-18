import mysql.connector
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_conn():
    return mysql.connector.connect(
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        ssl_disabled=False
    )
class User(BaseModel):
    nom: str
    prenom: str
    email: str

@app.get("/")
async def home():
    return {"message": "API OK"}

@app.get("/users")
async def get_users():
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateur")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"Utilisateurs": records}

@app.post("/users")
async def add_user(user: User):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO utilisateur (nom, prenom, email, role) VALUES (%s, %s, %s, %s)",
        (user.nom, user.prenom, user.email, "user")
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Utilisateur ajouté"}

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateur WHERE id = %s", (user_id,))
    record = cursor.fetchone()
    cursor.close()
    conn.close()
    return {"Utilisateur": record}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM utilisateur WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Utilisateur supprimé"}