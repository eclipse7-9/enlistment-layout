from fastapi import HTTPException
import random
import string
from datetime import datetime, timedelta
from fastapi_mail import MessageSchema, MessageType
from config.email_conf import fastmail
from pydantic import EmailStr

# Almacén temporal de códigos (en producción usar Redis o DB)
verification_codes = {}

def generate_verification_code():
    """Genera un código de verificación de 6 dígitos"""
    return ''.join(random.choices(string.digits, k=6))

async def send_verification_email(email: EmailStr):
    """Envía un correo con el código de verificación

    Dev notes: la función devuelve el código generado. El endpoint puede
    incluirlo en la respuesta si la variable de entorno
    `DEV_EMAIL_SIMULATE` está activada (útil para desarrollo sin SMTP).
    """
    try:
        code = generate_verification_code()

        # Guardar el código con tiempo de expiración (15 minutos)
        verification_codes[email] = {
            'code': code,
            'expires_at': datetime.now() + timedelta(minutes=15)
        }
        print(f"Código generado y almacenado para {email}: {code}")
        print(f"Estado actual de códigos: {verification_codes}")

        # Crear el mensaje HTML
        message = MessageSchema(
            subject="Verificación de correo electrónico",
            recipients=[email],
            body=f"""
            <html>
                <body>
                    <h1>Verificación de correo electrónico</h1>
                    <p>Tu código de verificación es: <strong>{code}</strong></p>
                    <p>Este código expirará en 15 minutos.</p>
                </body>
            </html>
            """,
            subtype=MessageType.html
        )

        # Intentar enviar el correo (si falla se lanza excepción)
        await fastmail.send_message(message)

        # En producción no devolvemos el código; devolvemos True para indicar éxito
        return True

    except Exception as e:
        print(f"Error enviando email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {str(e)}")


def verify_code(email: str, code: str):
    """Verifica si el código es válido"""
    print(f"Verificando código para {email}. Código recibido: {code}")
    print(f"Códigos almacenados: {verification_codes}")
    
    if email not in verification_codes:
        raise HTTPException(status_code=400, detail="No hay código pendiente para este correo")
    
    stored_data = verification_codes[email]
    
    if datetime.now() > stored_data['expires_at']:
        del verification_codes[email]
        raise HTTPException(status_code=400, detail="El código ha expirado")
    
    if stored_data['code'] != code:
        raise HTTPException(status_code=400, detail="Código incorrecto")
    
    # Eliminar el código usado
    del verification_codes[email]
    return True
