# Use the official Navidrome Docker image
FROM deluan/navidrome:latest

# Expose the default Navidrome port
EXPOSE 4533

# Set up environment variables for data and music folders
ENV ND_DATAFOLDER=/data
ENV ND_MUSICFOLDER=/music
ENV ND_LOGLEVEL=info

# Run Navidrome
ENTRYPOINT ["/app/navidrome"]
CMD ["--configfile", "/data/navidrome.toml"]
