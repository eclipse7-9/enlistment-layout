from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

USER = "root"
PASSWORD = ""
HOST = "localhost"
PORT = "3306"
DB_NAME = "phs_db"

DATABASE_URL = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()



























