# Curso_django
Codigo para el curso de Django en Python


#### Comando para construir la app de Django 

`docker compose run --rm backend_core django-admin startproject core .`

#### Comando para construir la app de Frontend.

`docker compose run --rm frontend npm create vite@latest .`

#### Comando que instala librerias: 

``docker compose exec frontend npm install lucide-react @hello-pangea/dnd clsx tailwindcss @tailwindcss/vite tailwind-merge``