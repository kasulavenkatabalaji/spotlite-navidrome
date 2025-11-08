#!/bin/bash
set -e

# Point rclone to our config file
export RCLONE_CONFIG=/app/rclone.conf

echo "Syncing OneDrive music to local folder..."
rclone sync onedrive:/Music /music --progress --create-empty-src-dirs

echo "Starting Navidrome..."
/app/navidrome
