from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, os

CHROME_DRIVER = os.path.join(os.getcwd(), "automation", "chromedriver.exe")
APP_URL = "http://127.0.0.1:5500/index.html"  

options = Options()
options.add_argument("--start-maximized")

service = Service(CHROME_DRIVER)
driver = webdriver.Chrome(service=service, options=options)
driver.implicitly_wait(5)

try:
    driver.get(APP_URL)
    print("Opened:", driver.current_url)

    # click start after selecting category
    WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.ID, "startBtn"))).click()
    print("Clicked Start Quiz")

    # loop questions
    while True:
        # select first option
        opts = driver.find_elements(By.CSS_SELECTOR, ".option")
        if opts:
            opts[0].click()
            time.sleep(0.2)

        # next or break
        next_btns = driver.find_elements(By.ID, "nextBtn")
        if next_btns and next_btns[0].is_enabled():
            next_btns[0].click()
            time.sleep(0.2)
        else:
            break

    # submit
    driver.find_element(By.ID, "submitBtn").click()
    print("Submitted")

    # wait for summary
    summary = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "summary")))
    print("Summary:\n", summary.text)

finally:
    time.sleep(1)
    driver.quit()
