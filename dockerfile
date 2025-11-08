# --- Build Navidrome with rclone support ---
FROM deluan/navidrome:latest

# Install rclone
RUN apt-get update && apt-get install -y rclone fuse && rm -rf /var/lib/apt/lists/*

# Expose Navidrome default port
EXPOSE 4533

# Copy rclone config (we’ll set this up in Render secrets)
VOLUME /config

# Start command: mount OneDrive + launch Navidrome
CMD rclone mount onedrive:/Music /music --vfs-cache-mode full & \
    ./navidrome --datafolder /data --musicfolder /music
