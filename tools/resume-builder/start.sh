#!/bin/bash
# Resume Builder Launcher
# Double-click this file or run ./start.sh to launch

cd "$(dirname "$0")"

# Add TinyTeX to PATH
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"

# Check if streamlit is available
if ! python3 -c "import streamlit" 2>/dev/null; then
    echo "Streamlit not found. Installing..."
    pip3 install streamlit
fi

# Check if pdflatex is available
if [ ! -f "$HOME/Library/TinyTeX/bin/universal-darwin/pdflatex" ]; then
    echo ""
    echo "WARNING: TinyTeX/pdflatex not found."
    echo "PDF compilation won't work."
    echo ""
fi

echo "================================"
echo "   Resume Builder"
echo "================================"
echo ""
echo "Starting server at http://localhost:8501"
echo "Press Ctrl+C to stop"
echo ""

# Open browser after a short delay
(sleep 2 && open http://localhost:8501) &

# Start streamlit using python module (more reliable)
python3 -m streamlit run app.py --server.headless true
