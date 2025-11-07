FROM deluan/navidrome:latest

# Set up folders
VOLUME ["/data", "/music"]

# Copy Navidrome config and data
COPY data /data

# Expose Navidrome port
EXPOSE 4533

# Environment variables
ENV ND_MUSICFOLDER="/music"
ENV ND_DATAFOLDER="/data"
ENV ND_PORT=4533

# Start Navidrome
CMD ["navidrome"]
