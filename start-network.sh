#!/bin/bash
# ============================================================
#  Adyom Foundation — Local Network Launcher
#  Run this script to share the website on your hotspot/LAN
# ============================================================

set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# Get the Mac's local IP (works for hotspot / LAN)
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || \
           ipconfig getifaddr en1 2>/dev/null || \
           ipconfig getifaddr bridge100 2>/dev/null || \
           echo "IP not found")

clear
echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}${BOLD}║         🌿 ADYOM FOUNDATION — NETWORK MODE 🌿        ║${RESET}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "${GREEN}✅  Your Mac IP Address:  ${BOLD}$LOCAL_IP${RESET}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  Open on any device connected to your hotspot:${RESET}"
echo ""
echo -e "  🌐  ${GREEN}${BOLD}http://$LOCAL_IP:5678${RESET}      ← Main Website"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "${BOLD}  📡 SETUP INSTRUCTIONS (do this first):${RESET}"
echo ""
echo -e "  On THIS Mac:"
echo -e "  1. Open ${CYAN}System Settings → General → Sharing${RESET}"
echo -e "  2. Turn on ${CYAN}Internet Sharing${RESET}"
echo -e "     Share from: Wi-Fi  |  To: Wi-Fi"
echo -e "  3. ${BOLD}OR${RESET} go to Wi-Fi menu bar → ${CYAN}Create My Network…${RESET}"
echo ""
echo -e "  On the OTHER laptop:"
echo -e "  1. Connect to the Wi-Fi hotspot created by this Mac"
echo -e "  2. Open browser and go to: ${GREEN}${BOLD}http://$LOCAL_IP:5678${RESET}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Try to show a QR code if qrencode is available
if command -v qrencode &> /dev/null; then
    echo -e "${BOLD}  📱 Scan QR code on any device:${RESET}"
    echo ""
    qrencode -t ANSIUTF8 "http://$LOCAL_IP:5678"
    echo ""
elif command -v npx &> /dev/null; then
    echo -e "${BOLD}  📱 QR Code for http://$LOCAL_IP:5678${RESET}"
    npx --yes qrcode-terminal "http://$LOCAL_IP:5678" 2>/dev/null || true
    echo ""
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  Starting servers… (Ctrl+C to stop all)${RESET}"
echo ""

# Kill any processes on these ports first
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5678 | xargs kill -9 2>/dev/null || true

sleep 1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Start backend
echo -e "${GREEN}[Backend]${RESET} Starting on port 5001..."
cd "$BACKEND_DIR" && npm run dev &
BACKEND_PID=$!

sleep 3

# Start frontend
echo -e "${GREEN}[Frontend]${RESET} Starting on port 5678..."
cd "$FRONTEND_DIR" && npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅  Both servers running!${RESET}"
echo -e "   Local:    ${BOLD}http://localhost:5678${RESET}"
echo -e "   Network:  ${GREEN}${BOLD}http://$LOCAL_IP:5678${RESET}"
echo ""

# Wait for either to exit
wait $BACKEND_PID $FRONTEND_PID
