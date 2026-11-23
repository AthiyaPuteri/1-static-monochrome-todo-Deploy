# ==============================================================================
# Dockerfile: Production Static Web Server (Alpine Nginx)
# Task Ledger - Monochromatic Static Edition
# BNI ODP IT 2026
# ==============================================================================

# Gunakan image Alpine Nginx yang sangat ringan (~25MB) dan aman
FROM nginx:1.27-alpine

# Label metadata container
LABEL maintainer="BNI ODP IT 2026" \
      description="Static Todo List Web Application for Production Deployment Demo" \
      version="1.0.0"

# Hapus konfigurasi bawaan Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Salin konfigurasi kustom Nginx yang sudah dioptimasi
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin aset statis aplikasi ke direktori web root Nginx
COPY index.html /usr/share/nginx/html/
COPY styles/ /usr/share/nginx/html/styles/
COPY scripts/ /usr/share/nginx/html/scripts/

# Berikan hak akses baca kepada user bawaan nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Port HTTP standar container
EXPOSE 80

# Jalankan Nginx di foreground (daemon off) agar container tetap hidup
CMD ["nginx", "-g", "daemon off;"]
