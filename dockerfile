# Use the official Navidrome image
FROM deluan/navidrome:latest

# Switch to root to install packages
USER root

# Install rclone and fuse for OneDrive integration
RUN apk add --no-cache rclone fuse bash

# Environment variables for Navidrome
ENV ND_DATA=/data \
    ND_MUSICFOLDER=/music \
    ND_PORT=4533 \
    ND_LOGLEVEL=info

# Create directories
RUN mkdir -p /music /data

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose Navidrome port
EXPOSE 4533

# Override the ENTRYPOINT so Docker runs bash directly
ENTRYPOINT ["/bin/bash", "/start.sh"]
