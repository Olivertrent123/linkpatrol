from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scanner import scan_site
from supabase import create_client
from dotenv import load_dotenv
import os
import json
import resend

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
resend.api_key = os.getenv("RESEND_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    url: str
    email: str

class RegisterRequest(BaseModel):
    email: str
    site_url: str

def send_report_email(email: str, site: str, total: int, broken_count: int, broken_links: list):
    if broken_count == 0:
        body = f"<h2>✅ LinkPatrol Weekly Report</h2><p>Great news! We scanned <b>{site}</b> and found <b>no broken links</b> across {total} links checked.</p>"
    else:
        items = "".join([f"<li>{b['url']} (status: {b['status'] or 'TIMEOUT'})</li>" for b in broken_links])
        body = f"""
        <h2>⚠️ LinkPatrol Weekly Report</h2>
        <p>We scanned <b>{site}</b> and found <b>{broken_count} broken link(s)</b> out of {total} total links.</p>
        <h3>Broken Links:</h3>
        <ul>{items}</ul>
        <p>Fix these links to protect your SEO and user experience.</p>
        """
    resend.Emails.send({
        "from": "LinkPatrol <onboarding@resend.dev>",
        "to": email,
        "subject": f"LinkPatrol Report: {broken_count} broken link(s) found on {site}",
        "html": body
    })

@app.get("/")
def root():
    return {"status": "LinkPatrol API is running"}

@app.post("/register")
def register(request: RegisterRequest):
    existing = supabase.table("users").select("*").eq("email", request.email).execute()
    if existing.data:
        return {"message": "User already exists", "user": existing.data[0]}
    result = supabase.table("users").insert({
        "email": request.email,
        "site_url": request.site_url
    }).execute()
    return {"message": "Registered successfully", "user": result.data[0]}

@app.post("/scan")
def scan(request: ScanRequest):
    result = scan_site(request.url)
    user = supabase.table("users").select("*").eq("email", request.email).execute()
    if user.data:
        supabase.table("scan_results").insert({
            "user_id": user.data[0]["id"],
            "site_url": request.url,
            "total_links": result["total_links"],
            "broken_count": result["broken_count"],
            "broken_links": json.dumps(result["broken_links"])
        }).execute()
        send_report_email(
            request.email,
            request.url,
            result["total_links"],
            result["broken_count"],
            result["broken_links"]
        )
    return result