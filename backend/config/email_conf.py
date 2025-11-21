from fastapi_mail import ConnectionConfig, FastMail
import os

email_conf = ConnectionConfig(
    MAIL_USERNAME = "kurco911@gmail.com",
    MAIL_PASSWORD = "sqcvadyruoceojld",  # app password without spaces
    MAIL_FROM = "kurco911@gmail.com",  # removed os.getenv to ensure direct value
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,   # ✅ este es requerido
    MAIL_SSL_TLS = False,   # ✅ este también es requerido
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

fastmail = FastMail(email_conf)
 