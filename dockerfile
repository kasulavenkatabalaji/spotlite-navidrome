# --- Build Navidrome with rclone support ---
FROM deluan/navidrome:latest

# Install rclone
RUN apk add --no-cache rclone fuse

# Expose Navidrome default port
EXPOSE 4533

# Copy rclone config (we’ll set this up in Render secrets)
VOLUME /config

# Start command: mount OneDrive + launch Navidrome
CMD rclone mount onedrive:/Music /music --vfs-cache-mode full & \
    ./navidrome --datafolder /data --musicfolder /music
