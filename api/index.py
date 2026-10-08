import os
import sys

# Ensure backend directory is in Python path for Vercel Serverless
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# If running on Vercel Serverless or Lambda, use /tmp for ChromaDB cache
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    os.environ["CHROMA_PERSIST_DIR"] = "/tmp/chroma_db"

from main import app
