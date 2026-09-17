#!/usr/bin/env python3
"""Launch the dual-stack Node preview server (HTTP/1.1 + Content-Length)."""
import os
import shutil
import sys

root = os.path.dirname(os.path.abspath(__file__))
script = os.path.join(root, ".preview-server.js")
node = shutil.which("node") or "/exec-daemon/node"
if not os.path.exists(node):
    sys.stderr.write("node is required to serve the preview\n")
    sys.exit(1)
os.chdir(root)
os.execv(node, [node, script])
