import requests
from django.conf import settings

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

def verify_turnstile(token: str | None, remote_ip: str | None = None, debug: bool = False):
    if not token:
        if debug: print("Turnstile: missing token")
        return False, "missing_token"

    secret = getattr(settings, "TURNSTILE_SECRET_KEY", "")
    if not secret:
        if debug: print("Turnstile: missing secret key in settings")
        return False, "missing_secret"

    data = {"secret": secret, "response": token}
    if remote_ip:
        data["remoteip"] = remote_ip

    try:
        resp = requests.post(TURNSTILE_VERIFY_URL, data=data, timeout=5)
        payload = resp.json()
        success = bool(payload.get("success"))
        if debug: print("Turnstile response:", payload)
        if success:
            return True, "ok"
        # e.g. ['invalid-input-secret','timeout-or-duplicate','hostname-mismatch']
        return False, ",".join(payload.get("error-codes", [])) or "not_success"
    except Exception as e:
        if debug: print("Turnstile request error:", e)
        return False, "request_error"