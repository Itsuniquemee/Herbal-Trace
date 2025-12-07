#!/bin/bash

# Script to set Railway environment variables
# Make sure you're linked to the backend service first

echo "Setting environment variables for Railway backend service..."

# Get DATABASE_URL from Postgres service
POSTGRES_URL=$(railway variables --service Postgres | grep DATABASE_URL | cut -d'=' -f2-)

# Get REDIS_URL from Redis service  
REDIS_URL=$(railway variables --service Redis | grep REDIS_URL | cut -d'=' -f2-)

# Set all environment variables for the backend service
railway variables set \
  NODE_ENV=production \
  PORT=3001 \
  FABRIC_NETWORK_ENABLED=false \
  JWT_SECRET=kHJ9S24kKOcS4/MxMNQ/Ed+mv6YKlOyNlKeDbveauNM= \
  JWT_REFRESH_SECRET=c3L868siIaQfR7M6ZMkeOzh12GulAFOk0BkMDkg4qpQ= \
  FIREBASE_API_KEY=AIzaSyDT2Uer4YSK_EN09hsOQFHKABARmjAEKvA \
  FIREBASE_PROJECT_ID=herbal-trace \
  FIREBASE_AUTH_DOMAIN=herbal-trace.firebaseapp.com \
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@herbal-trace.iam.gserviceaccount.com \
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWEiZZnhOcH2jl\nZJExPcgerokF787h6hzXD5nN3gYOScp9GxRqP67qCkDUPOKfcuJy2KmWACm4OTCI\nmzGG7QpF8at+SdwkDk4b00zMi+W4ck192ZmaHWquaOivdBX1AkoDX0+/XeGbUIbU\nl6W2CTZIz14WpMBKgKFU4os+kue+yKO/yr59Y4KLQceuLZ6lvz4axjnwtvEBl+qx\nGHAE6WFHm7cZvN4xCNIw3+QJ+YVLit5ekhnwn4W/RaSsRLnODdGt/Y4+GtGEZQxw\nbnf4Lo8kxB+fOAYIK6mssGuG75iVgKGcc720CefmRZollOOhZbf8xDSJxo+LrQcp\nLp7RgizjAgMBAAECggEAPFNKcD7vohQsPf4psVIlBlRhx22pS74o3riqOou0An1e\nNOE0WSuFXBZIDij1bmQnrEP1E9O38ZKntFoyVAsoVIp7xhXZtPK9KklLt3PLIdRs\n2xikOsP1dOu+EX2IMAe+CdIABCywepcpw/67wcu9MxKMv2x10d0YPT+d+sbh+poe\nQK4j6dAgor6ap5ktLZSm02Izp079EPeEX31HDHGz3EwjlCttaKeylfdT9rAW0jbh\nA6uWILlwjkrOpeVWaNTL8ZdzSsprprC5h/B+BKB8PfjynIR+RbNihvv54fDPGxWP\nEegQuKktZLHjTmkkXf5yMo3tZidJChCf3qNe7m+1jQKBgQDHvd9Duwzh03tQaWTj\nTXm8xdF87FP/7G7cqBahqlaFLQcbPk4e4qv9sMMmWf3b+Qfm148Li8b2FmNRv9B2\nzwEkoCNhwW+dwi0CUA2HI6hxMw3U9c09et7TwE25Q6YwNNR6vYTOL3UnSt/4XFfw\nH5ARsi+2HEew5Mlw100VFgMsBwKBgQDAVtOfVfvw0JTZjuZ9GPbc+y08JRgIEdEY\nMJbj2LZ4mQD8+EdVL7t65Qw3m0tQmXnOWDZDlrwCPDw0oLAPQlwkZ38LjqdSFelE\npxw0g/swSAUpfyP8Byoc9/L/Avwf8zWQZvEMQ74iJYqqO4Klg5XkUUYtS98g32En\n8nQtgGh5RQKBgG98x3WinhoeVKIZcbp9sAlx0PANaQVcDrUTDS7HSOukqmbGbAxJ\nMP60/vgVGuEBKyvp/WnQZwlMjbs/eTgXaufqilUyBv7jNwQncqWPfaFRgdLwL9K1\nFlLS748M92HI2yB3T/1V9+oqnMCfqmXY+C0obAEV394YlWdqhRfT5YlZAoGAaFy0\nZvhYw8npekK3fZlWGYGQgdn+uCIyulVjCi5ElBsxFhIBYo+LwpsVjfaNXyZnmTbz\n+qiHSw8z+7pUzXLMXFRr8vFsiHWrJL0n6LbUTNZHNsTt2Yppp15CU2xjMVLd9YRl\ntqnrOMv1+Xhg4z4Kzt/qnBlW8JdEOFCuCSJrjaECgYEAnmq+u2e8oj/v9FspTvRF\nhIgXQlHmtvFxToW7Hy68L32kIxq+F4yU9sq7lpeiEOHBjrQCv9chTr3YNV3KQX0r\nVApT6l537h3n/j+GyGwADFA54oxmoHh5gIFqcxlQOcl3sPdI0MwOo304P0y/qnVX\nIpmJtpT6SxwF4k2tYXo9K2E=\n-----END PRIVATE KEY-----\n"

echo "Environment variables set successfully!"
echo "Redeploying backend service..."

# Trigger a redeploy
railway up --detach
