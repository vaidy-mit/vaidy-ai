#!/usr/bin/env python3
"""
Resume Builder - A simple tool to tailor LaTeX resumes using Claude Code CLI.
"""

import streamlit as st
import subprocess
import os
import base64
import glob as glob_module
from pathlib import Path

# TinyTeX path
TINYTEX_BIN = os.path.expanduser("~/Library/TinyTeX/bin/universal-darwin")

def find_pdflatex():
    """Find pdflatex in common locations."""
    paths_to_check = [
        os.path.join(TINYTEX_BIN, "pdflatex"),
        "/Library/TeX/texbin/pdflatex",
        "/usr/local/bin/pdflatex",
    ]
    for path in paths_to_check:
        if os.path.exists(path):
            return path
    return None

def clean_aux_files(directory, basename):
    """Remove LaTeX auxiliary files."""
    extensions = ['.aux', '.log', '.out', '.bbl', '.blg', '.bcf', '.run.xml']
    for ext in extensions:
        filepath = os.path.join(directory, basename + ext)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except:
                pass

st.set_page_config(
    page_title="Resume Builder",
    page_icon="📄",
    layout="wide"
)

st.title("📄 Resume Builder")
st.markdown("Tailor your LaTeX resume for any job using Claude Code")

# Sidebar for configuration
with st.sidebar:
    st.header("Configuration")

    resume_dir = st.text_input(
        "Resume Directory",
        value=st.session_state.get("resume_dir", "/Users/vaidy/Desktop/resume"),
        help="Path to your LaTeX resume directory"
    )
    st.session_state.resume_dir = resume_dir

    # Check if directory exists and find tex files
    tex_files = []
    if os.path.isdir(resume_dir):
        tex_files = sorted([f for f in os.listdir(resume_dir) if f.endswith('.tex') and not f.startswith('.')])
        st.success(f"Found {len(tex_files)} .tex files")
    else:
        st.error("Directory not found")

    main_tex = st.selectbox(
        "Main TeX file",
        options=tex_files if tex_files else ["No .tex files found"],
        help="The main file to compile"
    )

    files_to_modify = st.multiselect(
        "Files to modify",
        options=tex_files,
        default=[f for f in tex_files if f not in ['altacv.cls']],
        help="Select which files Claude should consider modifying"
    )

    st.divider()

    # Show pdflatex status
    pdflatex = find_pdflatex()
    if pdflatex:
        st.success(f"pdflatex: Ready")
    else:
        st.error("pdflatex: Not found")

# Main content area
col1, col2 = st.columns([1, 1])

with col1:
    st.header("Job Description")
    job_description = st.text_area(
        "Paste the job description here",
        height=400,
        placeholder="Paste the job description or key requirements here..."
    )

    custom_instructions = st.text_area(
        "Custom instructions (optional)",
        height=100,
        placeholder="E.g., 'Focus on ML experience', 'Emphasize leadership roles'..."
    )

with col2:
    st.header("Actions")

    if st.button("🔄 Tailor Resume", type="primary", use_container_width=True):
        if not job_description.strip():
            st.error("Please paste a job description first")
        elif not os.path.isdir(resume_dir):
            st.error("Resume directory not found")
        elif not files_to_modify:
            st.error("Please select at least one file to modify")
        else:
            with st.spinner("Claude is tailoring your resume..."):
                # Build the prompt
                files_list = ", ".join(files_to_modify)
                prompt = f"""I need you to tailor my LaTeX resume for a specific job.

Resume directory: {resume_dir}
Files to consider: {files_list}

JOB DESCRIPTION:
{job_description}

{f"ADDITIONAL INSTRUCTIONS: {custom_instructions}" if custom_instructions.strip() else ""}

Please:
1. Read the resume files
2. Modify the content to better match this job description
3. Reorder bullet points to highlight relevant experience first
4. Adjust wording to include relevant keywords from the job description
5. Keep the LaTeX formatting intact
6. Do NOT change personal info, education dates, or job titles/dates
7. Focus on making the experience descriptions more relevant

Make the edits directly to the files."""

                try:
                    result = subprocess.run(
                        ["claude", "-p", prompt, "--allowedTools", "Read,Edit,Write,Bash"],
                        cwd=resume_dir,
                        capture_output=True,
                        text=True,
                        timeout=180
                    )

                    if result.returncode == 0:
                        st.success("Resume tailored successfully!")
                        with st.expander("Claude's response", expanded=True):
                            st.text(result.stdout)
                    else:
                        st.error(f"Error: {result.stderr or result.stdout}")

                except subprocess.TimeoutExpired:
                    st.error("Claude took too long. Try again or simplify the request.")
                except FileNotFoundError:
                    st.error("Claude CLI not found. Make sure 'claude' is in your PATH.")
                except Exception as e:
                    st.error(f"Error: {str(e)}")

    st.divider()

    col_compile, col_view = st.columns(2)

    with col_compile:
        if st.button("📝 Compile PDF", use_container_width=True):
            if not os.path.isdir(resume_dir) or main_tex == "No .tex files found":
                st.error("Invalid resume directory or no tex files")
            else:
                pdflatex_path = find_pdflatex()

                if not pdflatex_path:
                    st.error("pdflatex not found. Run the setup script first.")
                else:
                    with st.spinner("Compiling LaTeX..."):
                        try:
                            # Set up environment with TinyTeX in PATH
                            env = os.environ.copy()
                            env["PATH"] = f"{TINYTEX_BIN}:{env.get('PATH', '')}"

                            # Run pdflatex twice for references
                            for _ in range(2):
                                result = subprocess.run(
                                    [pdflatex_path, "-interaction=nonstopmode", main_tex],
                                    cwd=resume_dir,
                                    capture_output=True,
                                    text=True,
                                    timeout=60,
                                    env=env
                                )

                            pdf_name = main_tex.replace('.tex', '.pdf')
                            pdf_path = os.path.join(resume_dir, pdf_name)

                            if os.path.exists(pdf_path):
                                st.success(f"Compiled: {pdf_name}")
                                st.session_state.pdf_path = pdf_path
                                # Clean up aux files
                                clean_aux_files(resume_dir, main_tex.replace('.tex', ''))
                            else:
                                st.error("PDF not generated. Check LaTeX errors:")
                                st.code(result.stdout[-2000:] if len(result.stdout) > 2000 else result.stdout)

                        except subprocess.TimeoutExpired:
                            st.error("Compilation timed out")
                        except Exception as e:
                            st.error(f"Error: {str(e)}")

    with col_view:
        if st.button("📂 Open Folder", use_container_width=True):
            if os.path.isdir(resume_dir):
                subprocess.run(["open", resume_dir])

    # PDF Display
    st.divider()

    pdf_path = st.session_state.get("pdf_path") or os.path.join(
        resume_dir, main_tex.replace('.tex', '.pdf') if main_tex != "No .tex files found" else ""
    )

    if os.path.exists(pdf_path):
        st.subheader("PDF Preview")
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()
            base64_pdf = base64.b64encode(pdf_bytes).decode('utf-8')
            pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="500" type="application/pdf"></iframe>'
            st.markdown(pdf_display, unsafe_allow_html=True)

        # Download button
        st.download_button(
            label="⬇️ Download PDF",
            data=pdf_bytes,
            file_name=os.path.basename(pdf_path),
            mime="application/pdf",
            use_container_width=True
        )
    else:
        st.info("Compile the resume to see PDF preview here.")

# Show current resume content (collapsible)
with st.expander("📋 View Current Resume Content"):
    if os.path.isdir(resume_dir) and files_to_modify:
        for tex_file in files_to_modify:
            tex_path = os.path.join(resume_dir, tex_file)
            if os.path.exists(tex_path):
                st.subheader(tex_file)
                with open(tex_path, 'r') as f:
                    st.code(f.read(), language='latex')
