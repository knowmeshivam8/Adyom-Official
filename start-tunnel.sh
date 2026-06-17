#!/bin/bash
# ============================================================
#  Adyom Foundation — Public Tunnel Launcher
#  Creates a public URL using Pinggy (no install required)
#  Works on ANY internet: WiFi, Mobile Data, Hotspot
# ============================================================

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'
BLUE='\033[0;34m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

TUNNEL_LOG="/tmp/adyom_tunnel.log"
BACKEND_LOG="/tmp/adyom_backend.log"
FRONTEND_LOG="/tmp/adyom_frontend.log"

cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down all servers and tunnel...${RESET}"
    kill $TUNNEL_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    lsof -ti:5678 | xargs kill -9 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

clear
echo ""
echo -e "${CYAN}${BOLD}╔═══════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}${BOLD}║      🌿 ADYOM FOUNDATION — PUBLIC TUNNEL MODE 🌿      ║${RESET}"
echo -e "${CYAN}${BOLD}╚═══════════════════════════════════════════════════════╝${RESET}"
echo ""

# Kill existing processes on required ports
echo -e "${YELLOW}Clearing ports 5001 and 5678...${RESET}"
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5678 | xargs kill -9 2>/dev/null || true
sleep 1

# ── 1. Start Backend ──────────────────────────────────────
echo -e "${GREEN}[1/3]${RESET} Starting backend on port 5001..."
cd "$BACKEND_DIR" && npm run dev > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
for i in {1..20}; do
    if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
        echo -e "      ${GREEN}✅ Backend ready${RESET}"
        break
    fi
    sleep 1
done

# ── 2. Start Frontend ─────────────────────────────────────
echo -e "${GREEN}[2/3]${RESET} Starting frontend on port 5678..."
cd "$FRONTEND_DIR" && npm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready
for i in {1..25}; do
    if curl -s http://localhost:5678 > /dev/null 2>&1; then
        echo -e "      ${GREEN}✅ Frontend ready${RESET}"
        break
    fi
    sleep 1
done

# ── 3. Start Pinggy Tunnel ────────────────────────────────
echo -e "${GREEN}[3/3]${RESET} Creating public tunnel via Pinggy..."
echo -e "      ${YELLOW}(Connecting... this takes 5-10 seconds)${RESET}"

# Start Pinggy SSH tunnel and capture output
rm -f "$TUNNEL_LOG"
ssh -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -p 443 \
    -R 0:localhost:5678 \
    a.pinggy.io 2>&1 | tee "$TUNNEL_LOG" &
TUNNEL_PID=$!

# Wait and extract the public URL from Pinggy output
PUBLIC_URL=""
for i in {1..30}; do
    sleep 1
    if [ -f "$TUNNEL_LOG" ]; then
        # Match real tunnel URLs like *.free.pinggy.net or *.pinggy-free.link or *.pinggy.io (not dashboard)
        URL=$(grep -oE 'https://[a-zA-Z0-9\-]+-[a-zA-Z0-9\-]+\.(free\.pinggy\.(net|io)|pinggy-free\.link|run\.pinggy[^"[:space:]]*)' "$TUNNEL_LOG" | grep -v dashboard | head -1)
        if [ -n "$URL" ]; then
            PUBLIC_URL="$URL"
            break
        fi
        # Broader fallback: any line with a long subdomain on pinggy domain
        URL=$(grep -oE 'https://[a-zA-Z0-9]{4,}\-[a-zA-Z0-9\:\-]+\.[a-zA-Z0-9\.\-]*(pinggy|pinggy-free)[a-zA-Z0-9\.\-]*' "$TUNNEL_LOG" | grep -v dashboard | head -1)
        if [ -n "$URL" ]; then
            PUBLIC_URL="$URL"
            break
        fi
    fi
done

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

if [ -n "$PUBLIC_URL" ]; then
    echo ""
    echo -e "  ${GREEN}${BOLD}✅ YOUR PUBLIC URL IS READY!${RESET}"
    echo ""
    echo -e "  🌐  ${CYAN}${BOLD}$PUBLIC_URL${RESET}"
    echo ""
    echo -e "  ${BOLD}Share this URL with anyone — works from any device,${RESET}"
    echo -e "  ${BOLD}anywhere in the world, over any internet connection.${RESET}"
    echo ""

    # Save URL to a file for reference
    echo "$PUBLIC_URL" > "$SCRIPT_DIR/.tunnel_url"
    echo "Last URL: $PUBLIC_URL" >> "$SCRIPT_DIR/.tunnel_url"

    # Update .env with new tunnel URL
    ENV_FILE="$BACKEND_DIR/.env"
    if [ -f "$ENV_FILE" ]; then
        sed -i '' "s|CLIENT_URL=.*|CLIENT_URL=$PUBLIC_URL|g" "$ENV_FILE"
        echo -e "  ${GREEN}✅ .env updated with new tunnel URL${RESET}"
    fi

    # Show QR code if available
    if command -v qrencode &> /dev/null; then
        echo -e "  ${BOLD}📱 Scan to open on phone:${RESET}"
        qrencode -t ANSIUTF8 "$PUBLIC_URL"
    else
        echo -e "  ${BLUE}💡 Tip: Install qrencode for QR code: brew install qrencode${RESET}"
    fi
else
    echo ""
    echo -e "  ${RED}⚠️  Could not auto-detect URL from Pinggy output.${RESET}"
    echo -e "  ${YELLOW}Check the tunnel output above for your URL.${RESET}"
    echo ""
    echo -e "  ${BOLD}Or run manually in a new terminal:${RESET}"
    echo -e "  ${CYAN}ssh -p 443 -R0:localhost:5678 a.pinggy.io${RESET}"
    echo ""
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  Local access:   ${BOLD}http://localhost:5678${RESET}"
echo -e "  Backend:        ${BOLD}http://localhost:5001${RESET}"
echo ""
echo -e "  ${YELLOW}Press Ctrl+C to stop all servers and the tunnel${RESET}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Keep running
wait $TUNNEL_PID
