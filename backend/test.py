from scanner import scan_site

r = scan_site("https://books.toscrape.com")
print(f"\nBroken: {r['broken_count']}/{r['total_links']}")