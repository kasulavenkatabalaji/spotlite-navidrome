#!/bin/bash
set -e

# Mount OneDrive Music folder using rclone
echo "Mounting OneDrive music folder..."
rclone mount onedrive:/Music /music --vfs-cache-mode full &

# Wait a few seconds to let mount stabilize
sleep 10

# Start Navidrome
echo "Starting Navidrome..."
/app/navidrome
