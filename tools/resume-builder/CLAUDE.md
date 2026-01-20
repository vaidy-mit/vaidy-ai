# Resume Builder Tool

A local Streamlit app that uses Claude Code CLI to tailor LaTeX resumes for job applications.

## Overview

This tool allows non-technical users to:
1. Paste a job description
2. Have Claude automatically tailor their LaTeX resume
3. Compile to PDF locally
4. Download the tailored resume

## Architecture

```
┌─────────────────────────────────────┐
│  Browser (localhost:8501)           │
│  - Paste job description            │
│  - Click "Tailor Resume"            │
│  - Preview/Download PDF             │
└─────────────────────────────────────┘
              │
              ▼
    Claude Code CLI (`claude -p`)
              │
              ▼
    TinyTeX (pdflatex)
              │
              ▼
    PDF Output
```

## Dependencies

### System Dependencies
- **Python 3.x** - Already installed on macOS
- **TinyTeX** - Lightweight LaTeX distribution installed at `~/Library/TinyTeX/`
- **Claude Code CLI** - Must be installed and authenticated (`claude` command in PATH)

### Python Dependencies
- `streamlit` - Web UI framework

### LaTeX Packages Installed
The following packages were installed via `tlmgr` for the AltaCV template:
- extsizes, fontawesome, fontawesome5, academicons
- ragged2e, everysel, koma-script, xcolor, etoolbox
- pgf, tikzfill, dashrule, multirow, changepage
- tcolorbox, enumitem, parskip, fancyhdr, marginfix
- paracol, environ, trimspaces, lato, fontaxes, mweights
- biblatex, biber, csquotes, logreq, ifmtarg

## File Structure

```
tools/resume-builder/
├── app.py                    # Main Streamlit application
├── start.sh                  # Launch script (terminal)
├── Resume Builder.command    # Double-click launcher (macOS Finder)
├── requirements.txt          # Python dependencies
└── CLAUDE.md                 # This file
```

## How to Run

### Option 1: Terminal
```bash
cd /Users/vaidy/PersonalWebsite/vaidy-ai/tools/resume-builder
./start.sh
```

### Option 2: Double-click (for non-technical users)
Double-click `Resume Builder.command` in Finder

### Option 3: Direct Python
```bash
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
python3 -m streamlit run app.py --server.headless true
```

## Configuration

The app defaults to `/Users/vaidy/Desktop/resume` but users can change the directory in the sidebar.

### Expected Resume Directory Structure
```
resume/
├── main.tex          # Main resume file (or any .tex file)
├── page1sidebar.tex  # Optional sidebar content
├── altacv.cls        # Document class (excluded from modifications)
└── *.bib             # Optional bibliography
```

## Troubleshooting

### "pdflatex not found"
TinyTeX needs to be installed. Run:
```bash
curl -sL "https://yihui.org/tinytex/install-bin-unix.sh" | sh
```
Then install required packages:
```bash
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
tlmgr install extsizes fontawesome fontawesome5 academicons ragged2e everysel \
  koma-script pgf tikzfill dashrule multirow changepage tcolorbox enumitem \
  parskip fancyhdr marginfix paracol environ trimspaces lato fontaxes mweights \
  biblatex biber csquotes logreq ifmtarg
```

### "Claude CLI not found"
Ensure Claude Code is installed and `claude` is in your PATH:
```bash
which claude
```

### LaTeX compilation errors
Check the resume compiles manually:
```bash
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
cd /path/to/resume
pdflatex -interaction=nonstopmode main.tex
```

### Missing LaTeX packages
If compilation fails with "File 'xxx.sty' not found":
```bash
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
tlmgr install <package-name>
```

## Development Notes

### Key Files

- **app.py:16-26** - `find_pdflatex()` function locates pdflatex
- **app.py:109-162** - Claude Code integration via subprocess
- **app.py:168-210** - PDF compilation logic
- **start.sh:8** - PATH setup for TinyTeX

### Claude Code Integration

The app calls Claude Code CLI with:
```bash
claude -p "<prompt>" --allowedTools "Read,Edit,Write,Bash"
```

The prompt instructs Claude to:
1. Read the specified .tex files
2. Modify content to match the job description
3. Reorder bullet points for relevance
4. Keep formatting and personal info intact

### Adding Support for Different Resume Templates

1. Identify required LaTeX packages by compiling manually
2. Install missing packages via `tlmgr install <package>`
3. Test compilation works
4. The app should work with any LaTeX resume template
