from fastapi import HTTPException
from fastapi_mail import MessageSchema, MessageType
from datetime import datetime, timedelta
from config.email_conf import fastmail
from pydantic import EmailStr
import random
import string

# Almacén temporal de códigos de recuperación (en producción usar Redis o DB)
recovery_codes = {}

def generate_recovery_code():
    """Genera un código de recuperación de 6 dígitos"""
    return ''.join(random.choices(string.digits, k=6))

async def send_recovery_email(email: EmailStr):
    """Envía un correo con el código de recuperación"""
    try:
        code = generate_recovery_code()

        # Guardar el código con tiempo de expiración (15 minutos)
        recovery_codes[email] = {
            'code': code,
            'expires_at': datetime.now() + timedelta(minutes=15)
        }

        # Crear el mensaje HTML
        message = MessageSchema(
            subject="Recuperación de Contraseña",
            recipients=[email],
            body=f"""
            <html>
                <body>
                    <h1>Recuperación de Contraseña</h1>
                    <p>Tu código de recuperación es: <strong>{code}</strong></p>
                    <p>Este código expirará en 15 minutos.</p>
                    <p>Si no solicitaste recuperar tu contraseña, ignora este correo.</p>
                </body>
            </html>
            """,
            subtype=MessageType.html
        )

        await fastmail.send_message(message)
        return True

    except Exception as e:
        print(f"Error enviando email de recuperación: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {str(e)}")

def verify_recovery_code(email: str, code: str):
    """Verifica si el código de recuperación es válido"""
    if email not in recovery_codes:
        raise HTTPException(status_code=400, detail="No hay código de recuperación pendiente para este correo")
    
    stored_data = recovery_codes[email]
    
    if datetime.now() > stored_data['expires_at']:
        del recovery_codes[email]
        raise HTTPException(status_code=400, detail="El código ha expirado")
    
    if stored_data['code'] != code:
        raise HTTPException(status_code=400, detail="Código incorrecto")
    
    # Eliminar el código usado
    del recovery_codes[email]
    return True