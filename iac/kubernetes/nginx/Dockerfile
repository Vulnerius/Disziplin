# Nginx Proxy Dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Expose standard-HTTP- & HTTPS-Ports
EXPOSE 80
EXPOSE 443

# Nginx wird standardmäßig gestartet
CMD ["nginx", "-g", "daemon off;"]