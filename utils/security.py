from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt  # asegúrate de que sea python-jose instalado: pip install "python-jose[cryptography]"

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = "tu_clave_secreta_aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# 🔒 Hashear contraseña
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# 🔑 Verificar contraseña
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 🎟️ Crear token JWT
def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
