# Use official Navidrome image
FROM deluan/navidrome:latest

# Copy your config file into the container
COPY navidrome.toml /app/navidrome.toml

# Copy your music if you want to bundle it (optional)
# COPY data/music /app/data/music

EXPOSE 4533

# Start Navidrome using your config
CMD ["--configfile", "/app/navidrome.toml"]
