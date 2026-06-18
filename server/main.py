import mysql.connector
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = mysql.connector.connect(
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    ssl_disabled=False
)

@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    sql_select_Query = "SELECT * from utilisateur"
    cursor.execute(sql_select_Query)
    records = cursor.fetchall()
    print("Total number of rows in table: ", cursor.rowcount)
    return {"Utilisateurs": records}

class User(BaseModel):
    nom: str
    prenom: str
    email: str

@app.post("/users")
async def add_user(user: User):
    cursor = conn.cursor()
    sql = "INSERT INTO utilisateur (nom, prenom, email) VALUES (%s, %s, %s)"
    cursor.execute(
        sql,
        (user.nom, user.prenom, user.email)
    )
    conn.commit()
    return {"message": "Utilisateur ajouté"}

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM utilisateur WHERE id = %s", (user_id,))
    record = cursor.fetchone()
    return {"Utilisateur": record}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM utilisateur WHERE id = %s", (user_id,))
    conn.commit()
    return {"message": "Utilisateur supprimé"}