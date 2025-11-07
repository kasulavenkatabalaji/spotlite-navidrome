# Use the official Navidrome image
FROM deluan/navidrome:latest

# Copy config file into container
COPY navidrome.toml /app/navidrome.toml

# Create music and data directories
RUN mkdir -p /app/data/music

EXPOSE 4533

# Run Navidrome with our custom config
CMD ["--configfile", "/app/navidrome.toml"]
