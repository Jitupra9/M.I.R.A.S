"""
Browser Tool — Playwright automation for web tasks.
Used for: job applications, form filling, web scraping, navigation.
"""
from playwright.async_api import async_playwright, Browser, Page
from typing import Optional, Dict
import asyncio

_browser: Optional[Browser] = None


async def get_browser() -> Browser:
    global _browser
    if _browser is None or not _browser.is_connected():
        playwright = await async_playwright().start()
        _browser = await playwright.chromium.launch(headless=False)  # headless=False so user can see
    return _browser


async def navigate_to(url: str) -> str:
    """Open a URL in the browser and return page title."""
    browser = await get_browser()
    page = await browser.new_page()
    await page.goto(url, wait_until="domcontentloaded")
    title = await page.title()
    return f"✅ Navigated to {url} — Title: {title}"


async def get_page_text(url: str) -> str:
    """Get the text content of a web page."""
    browser = await get_browser()
    page = await browser.new_page()
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        content = await page.inner_text("body")
        return content[:5000]  # Limit to 5000 chars
    finally:
        await page.close()


async def click_element(page: Page, selector: str) -> str:
    """Click an element by CSS selector."""
    try:
        await page.click(selector, timeout=10000)
        return f"✅ Clicked: {selector}"
    except Exception as e:
        return f"Error clicking {selector}: {e}"


async def fill_form(page: Page, fields: Dict[str, str]) -> str:
    """Fill multiple form fields. fields = {selector: value}"""
    results = []
    for selector, value in fields.items():
        try:
            await page.fill(selector, value)
            results.append(f"✅ Filled {selector}")
        except Exception as e:
            results.append(f"❌ Failed {selector}: {e}")
    return "\n".join(results)


async def screenshot(path: str = "screenshot.png") -> str:
    """Take a screenshot of the current page."""
    browser = await get_browser()
    pages = browser.contexts[0].pages if browser.contexts else []
    if not pages:
        return "No active pages found"
    page = pages[-1]
    await page.screenshot(path=path)
    return f"✅ Screenshot saved: {path}"


async def search_and_apply_job(job_title: str, location: str, user_data: dict) -> str:
    """
    Search LinkedIn/Naukri for jobs and prepare application.
    Triggers HITL interrupt before submitting.
    """
    browser = await get_browser()
    page = await browser.new_page()
    
    # Search LinkedIn Jobs
    search_url = f"https://www.linkedin.com/jobs/search/?keywords={job_title.replace(' ', '%20')}&location={location.replace(' ', '%20')}"
    await page.goto(search_url, wait_until="domcontentloaded")
    
    title = await page.title()
    return f"🔍 Opened job search: {title}\nURL: {search_url}\n⚠️ HITL_REQUIRED: Ready to start applying. Please confirm."

