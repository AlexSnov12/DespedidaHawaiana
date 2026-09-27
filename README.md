# Página de la despedida de soltero(a)

> Requisitos ya instalados en este equipo: Git y Node.js (LTS). Si abres una terminal nueva y `git`/`node`/`npm` no se reconocen, cierra y vuelve a abrir la terminal para que recoja el PATH actualizado.

Sitio estático (HTML/CSS/JS puro, sin build step) con:
- Portada con cuenta atrás
- Info del lugar, hora y código de vestimenta (temática hawaiana)
- Confirmación de asistencia guardada en Supabase (Postgres)
- Galería de fotos con subida desde el móvil (Supabase Storage)

> Este proyecto es una copia de `PaginaBoda`, reutilizando el **mismo proyecto de Supabase** (misma cuenta, mismo `SUPABASE_URL`/clave), pero con una tabla y un bucket propios para no mezclar datos con la boda. Se despliega en un sitio de Netlify distinto.

## 1. Crear la tabla de asistencia (en el mismo proyecto Supabase de la boda)

1. Entra a tu proyecto de Supabase (el mismo que ya usas para `PaginaBoda`) > **SQL Editor** > "New query".
2. Pega y ejecuta:

```sql
create table rsvps_despedida (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  asistencia text not null,
  acompanantes int default 1,
  restricciones text,
  mensaje text,
  creado timestamptz default now()
);

alter table rsvps_despedida enable row level security;

create policy "Cualquiera puede enviar RSVP despedida"
  on rsvps_despedida for insert
  to anon
  with check (true);
```

Verás las respuestas en **Table Editor > rsvps_despedida**.

## 2. Crear el bucket de fotos

1. **Storage** > "New bucket" > nómbralo `fotos-despedida` > márcalo **Public bucket**.
2. **SQL Editor** > "New query" y ejecuta:

```sql
create policy "Lectura publica fotos despedida"
  on storage.objects for select
  to anon
  using (bucket_id = 'fotos-despedida');

create policy "Subida publica fotos despedida"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'fotos-despedida');
```

## 3. Panel de administración (`admin.html`)

Hay una página aparte, `admin.html`, protegida con la contraseña `249881` (definida en `js/supabase-config.js` como `ADMIN_PASSWORD`), donde puedes:
- Ver la lista de quién confirmó asistencia (con acompañantes, restricciones y mensaje).
- Ver todas las fotos subidas y eliminar las que no quieras (subidas por error, repetidas, etc.).

No está enlazada desde el menú del sitio — solo entra quien tenga el link directo (`tu-sitio.netlify.app/admin.html`).

Para que funcione necesitas ejecutar este SQL adicional (**SQL Editor** > "New query"):

```sql
create policy "Lectura publica rsvps despedida"
  on rsvps_despedida for select
  to anon
  using (true);

create policy "Borrado publico fotos despedida"
  on storage.objects for delete
  to anon
  using (bucket_id = 'fotos-despedida');
```

**Importante sobre seguridad:** igual que con el código de la galería de novios en `PaginaBoda`, esta contraseña es solo una barrera visual en el navegador — las políticas de arriba dejan que **cualquiera** con la clave pública del sitio (que está en el propio código fuente, visible para cualquiera) pueda leer las respuestas de asistencia o borrar fotos directamente, sin pasar por `admin.html` ni conocer la contraseña. Para esta boda/despedida entre conocidos es un riesgo bajo y razonable, pero si en algún momento quieren protección real (que solo tú puedas hacer estas acciones, sin importar quién tenga el código), avísame y lo cambiamos a autenticación de verdad (Supabase Auth) en vez de este password compartido.

## 4. Configuración ya lista

`js/supabase-config.js` ya tiene el mismo `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` que `PaginaBoda` (es el mismo proyecto Supabase), así que no hace falta tocarlo salvo que decidan crear un proyecto Supabase distinto más adelante.

## 5. Personalizar el contenido

- `js/countdown.js`: cambia `PARTY_DATE` por la fecha y hora reales.
- `index.html`: cambia lugar y hora (busca "Lugar de la fiesta").
- `css/style.css`: cambia `--color-accent` y demás variables si quieren otra paleta.

## 6. Probar en local

```
npx serve . -l <puerto distinto al de PaginaBoda, ej. 5174>
```

Y abre la URL que te indique.

## 7. Desplegar en Netlify

1. Sube esta carpeta a un repositorio de GitHub distinto al de la boda.
2. En https://app.netlify.com > "Add new site" > "Import an existing project", conecta el repo.
3. Build command: (vacío). Publish directory: `.`
4. Despliega — te dará una URL tipo `despedida-xxx.netlify.app`, distinta a la de la boda.

## 8. Generar el QR para la fiesta

Una vez tengas la URL final, genera un QR (por ejemplo con https://www.qr-code-generator.com) apuntando a `https://tu-sitio.netlify.app/#galeria`, imprímelo y colócalo donde se vea en la fiesta.

## Nota sobre límites gratuitos de Supabase

Este proyecto comparte cuota con `PaginaBoda` (mismo proyecto Supabase): 1GB de storage y 500MB de base de datos en el plan gratuito, y el proyecto se pausa tras ~7 días sin actividad. Si más adelante hace falta más espacio para las dos páginas, evalúen el plan Pro (~$25/mes) juntas.
