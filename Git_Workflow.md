 # Git Workflow - Convención de Commits

Este documento define la convención de mensajes de commit que debe seguirse en este repositorio para mantener un historial de cambios claro y consistente.

## 1. Formato del mensaje de commit

Cada mensaje de commit debe seguir este formato:
- `<tipo>`: Describir la categoría del cambio.
- `<área>` (opcional): Módulo o componente afectado.
- `<mensaje breve>`: Descripción concisa en tiempo presente, sin mayúscula inicial ni punto final.

# Git Workflow - Frecuencia de Push/Pull

Este apartado define las buenas prácticas sobre **cuándo hacer `git push` y `git pull`** para asegurar un flujo de trabajo fluido y evitar conflictos innecesarios.

---

## 1. Pull 

###  Buenas prácticas

- Haz `git pull` **antes de crear una nueva rama** para asegurarte de partir de la base más actual.
- Si se trabaja en una rama compartida (como `develop` o `feature/...`), haz `pull` **frecuente** para mantener tu trabajo actualizado y reducir conflictos.

---

## 2. Push 

### Buenas prácticas

- Hacer `git push` **frecuente** mientras trabajas (por ejemplo, al final de cada bloque importante de trabajo), para evitar pérdida de trabajo.
- No acumular cambios durante varios días sin hacer `push`.
- Evitar hacer `push` de código roto: asegúrate de que al menos pase linters/tests si existen.

# Política de Pull Requests - enlistment-layout

Este documento define las reglas y buenas prácticas para la creación, revisión y fusión de Pull Requests (PRs) en el repositorio.
---

##  Objetivo
Asegurar que todo cambio en el código pase por revisión, manteniendo la calidad, consistencia y estabilidad del proyecto.

---

##  Reglas generales
1. **Todo cambio debe ir mediante un Pull Request**.
2. **Prohibido hacer `push` directo a `main` o `develop`**.
3. Los PR deben crearse **desde ramas dedicadas** (`feature/*`, `hotfix/*`, `bugfix/*`).
4. Antes de abrir un PR, la rama debe estar actualizada con `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/mi-funcionalidad
   git merge develop
