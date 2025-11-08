# Use the official Navidrome image
FROM deluan/navidrome:latest

# Install rclone and fuse (for OneDrive mount)
RUN apk add --no-cache rclone fuse bash

# Environment variables for Navidrome
ENV ND_DATA=/data \
    ND_MUSICFOLDER=/music \
    ND_PORT=4533 \
    ND_LOGLEVEL=info

# Create directories
RUN mkdir -p /music /data

# Copy a startup script into the container
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose Navidrome port
EXPOSE 4533

# Run the startup script
CMD ["/start.sh"]
