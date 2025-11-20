from passlib.context import CryptContext
from passlib.exc import UnknownHashError
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
    """Verify a password against a stored hash.

    - If `hashed_password` is falsy (None/empty) return False.
    - If passlib cannot identify the hash, fall back to a safe plaintext
      comparison only when the stored value doesn't look like a hash
      (no '$' separator). This supports legacy rows that accidentally
      stored plaintext. Return False otherwise.
    """
    if not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        # Stored value isn't a recognizable hash. As a last resort,
        # allow plaintext comparison for legacy rows that contain
        # un-hashed passwords (this is temporary and not recommended).
        # Detect likely hash values by presence of '$'. If absent,
        # compare directly and return the result.
        try:
            if isinstance(hashed_password, str) and "$" not in hashed_password:
                return plain_password == hashed_password
        except Exception:
            pass
        return False

# 🎟️ Crear token JWT
def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
