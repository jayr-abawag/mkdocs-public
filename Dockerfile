# Builder stage: install the pinned toolchain (mkdocs==1.6.1, mcp==2.3.0 from
# requirements.txt) and run a strict MkDocs build into a predictable path.
FROM python:3.14-slim AS builder

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY 1-mkdocs/ ./1-mkdocs/
RUN python -m mkdocs build --strict --site-dir /site -f 1-mkdocs/mkdocs.yml

# Runtime stage: small non-root nginx image serving the static site.
# nginxinc/nginx-unprivileged listens on 8080 (not 80) and runs as an
# unprivileged user; consumers must target port 8080.
FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY --from=builder /site /usr/share/nginx/html

EXPOSE 8080
