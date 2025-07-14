# Nginx Proxy Dockerfile
FROM nginx:alpine

# Kopiere deine angepasste Nginx-Konfigurationsdatei
# Diese Datei wird die zentrale Routing-Logik für Frontend und Backend enthalten
COPY nginx.conf /etc/nginx/nginx.conf

# Expose die Standard-HTTP- und HTTPS-Ports
EXPOSE 80
EXPOSE 443

# Nginx wird standardmäßig gestartet
CMD ["nginx", "-g", "daemon off;"]