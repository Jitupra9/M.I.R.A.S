"""
OS Tools — Launch applications, run terminal commands, system info.
Uses subprocess for commands, psutil for system info, os for app launching.
"""

import subprocess
import psutil
import platform
import os
import asyncio
from typing import Optional


async def run_command(
    command: str, timeout: int = 30, cwd: Optional[str] = None
) -> dict:
    """Run a shell command asynchronously and return stdout/stderr."""
    try:
        proc = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=cwd,
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        return {
            "command": command,
            "returncode": proc.returncode,
            "stdout": stdout.decode("utf-8", errors="replace").strip(),
            "stderr": stderr.decode("utf-8", errors="replace").strip(),
            "success": proc.returncode == 0,
        }
    except asyncio.TimeoutError:
        return {
            "command": command,
            "error": f"Timed out after {timeout}s",
            "success": False,
        }
    except Exception as e:
        return {"command": command, "error": str(e), "success": False}


def open_application(app_name: str) -> str:
    """Open an application by name (cross-platform)."""
    system = platform.system()
    try:
        if system == "Windows":
            os.startfile(app_name)
        elif system == "Darwin":
            subprocess.Popen(["open", "-a", app_name])
        else:
            subprocess.Popen([app_name])
        return f"Opened: {app_name}"
    except Exception as e:
        return f"Error opening {app_name}: {e}"


def open_file(path: str) -> str:
    """Open any file with its default application."""
    try:
        system = platform.system()
        if system == "Windows":
            os.startfile(path)
        elif system == "Darwin":
            subprocess.Popen(["open", path])
        else:
            subprocess.Popen(["xdg-open", path])
        return f"Opened file: {path}"
    except Exception as e:
        return f"Error opening file: {e}"


def open_url(url: str) -> str:
    """Open a URL in the default browser."""
    import webbrowser

    try:
        clean_url = url.strip()
        if "youtube" in clean_url.lower() and not clean_url.startswith("http"):
            clean_url = "https://www.youtube.com"
        elif "google" in clean_url.lower() and not clean_url.startswith("http"):
            clean_url = "https://www.google.com"
        elif not clean_url.startswith("http://") and not clean_url.startswith(
            "https://"
        ):
            if "." in clean_url:
                clean_url = f"https://{clean_url}"
            else:
                clean_url = f"https://www.google.com/search?q={clean_url}"

        webbrowser.open(clean_url)
        return f"Opened {clean_url} in your default browser."
    except Exception as e:
        return f"Error opening URL: {e}"


def get_system_info() -> dict:
    """Return current system information."""
    return {
        "platform": platform.system(),
        "platform_version": platform.version(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": {
            "total_gb": round(psutil.virtual_memory().total / 1e9, 2),
            "used_gb": round(psutil.virtual_memory().used / 1e9, 2),
            "percent": psutil.virtual_memory().percent,
        },
        "disk": {
            "total_gb": round(psutil.disk_usage("/").total / 1e9, 2),
            "free_gb": round(psutil.disk_usage("/").free / 1e9, 2),
        },
    }


def list_running_processes() -> list:
    """List all running processes."""
    processes = []
    for proc in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent"]):
        try:
            processes.append(proc.info)
        except psutil.NoSuchProcess:
            pass
    return sorted(processes, key=lambda x: x.get("cpu_percent", 0), reverse=True)[:20]


def kill_process(pid: int) -> str:
    """Kill a process by PID."""
    try:
        p = psutil.Process(pid)
        p.terminate()
        return f"[OK] Terminated process {pid} ({p.name()})"
    except Exception as e:
        return f"Error killing process {pid}: {e}"
