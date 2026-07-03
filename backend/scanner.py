import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_all_links(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        links = []

        for tag in soup.find_all("a", href=True):
            full_url = urljoin(url, tag["href"])
            if urlparse(full_url).scheme in ("http", "https"):
                links.append(full_url)

        for tag in soup.find_all("img", src=True):
            full_url = urljoin(url, tag["src"])
            if urlparse(full_url).scheme in ("http", "https"):
                links.append(full_url)

        return list(set(links))

    except Exception as e:
        return []


def check_link(url):
    try:
        response = requests.head(url, timeout=8, allow_redirects=True)
        if response.status_code == 405:
            response = requests.get(url, timeout=8)
        return {
            "url": url,
            "status": response.status_code,
            "broken": response.status_code >= 400
        }
    except Exception as e:
        return {
            "url": url,
            "status": None,
            "broken": True
        }


def scan_site(site_url):
    print(f"Scanning: {site_url}")
    links = get_all_links(site_url)
    print(f"Found {len(links)} links — checking concurrently...")

    results = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(check_link, link): link for link in links}
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
            status = result["status"] or "TIMEOUT"
            print(f"  [{status}] {result['url']}")

    broken = [r for r in results if r["broken"]]
    return {
        "site": site_url,
        "total_links": len(results),
        "broken_count": len(broken),
        "broken_links": broken
    }