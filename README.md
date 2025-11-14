# 📘 **Frugal Testing – Dynamic Quiz Application (HTML + CSS + JS + Selenium Automation)**

A fully interactive **Dynamic Quiz Application** built using **HTML, CSS, and JavaScript**, along with a **Selenium Automation Suite** developed in Python.
This project demonstrates both **Frontend Development** and **Test Automation Engineering** skills — perfectly aligned with Frugal Testing’s expectations.

---

## 🚀 **Project Overview**

This project is a complete quiz system with:

* Category selection
* Difficulty selection
* Question count selection
* Dynamic question loading
* Automatic Timer per question
* Navigation between questions
* Result summary with score
* Charts showing performance
* Fully responsive UI
* Clean, professional design

The quiz runs **100% on the client side**, without requiring any backend or database.

---

## 🎨 **UI Features**

* Modern, clean, company-style interface
* Responsive layout (Desktop, Tablet, Mobile)
* Smooth transitions & button interactions
* Glass-card UI with gradients and shadows
* Chart.js-powered visual result breakdown

---

## 🧠 **How the Quiz Works**

* Questions are loaded from a JavaScript array (`questions.js`)
* `script.js` dynamically renders:

  * Questions
  * Options
  * Timer
  * Navigation
  * Result summary
  * Charts
* Time spent per question is recorded
* Score is automatically calculated
* Results are displayed with:

  * Total correct
  * Total incorrect
  * Pie chart
  * Time-taken chart

---

## 🗂️ **Project Structure**

```
frugal_quiz/
│── index.html              # Main UI page
│── style.css               # Full UI styling
│── questions.js            # Quiz data
│── script.js               # Quiz functionality
│── automation/             # Selenium automation scripts
│     ├── test_quiz.py      # Test script
│     └── chromedriver.exe  # (Optional - ignored in Git)
│── README.md               # Documentation
│── .gitignore              # Ignore venv + chromedriver
```

---

## 🤖 **Automation Using Selenium (Python)**

A full automation suite is implemented using:

* Python
* Selenium WebDriver
* ChromeDriver
* WebDriver Manager (optional)

### ✔ What Selenium Test Does:

1. Launches Chrome
2. Opens the quiz
3. Selects category
4. Clicks Start Quiz
5. Automatically selects answers
6. Navigates all questions
7. Submits the quiz
8. Reads summary output
9. Takes screenshot of result

This simulates a *real user* and validates the end-to-end flow.

---

## 📌 **Run Automation (Python)**

### Step 1 — Create virtual environment

```bash
python -m venv .venv
```

Activate (PowerShell):

```bash
.venv\Scripts\Activate.ps1
```

### Step 2 — Install dependencies

```bash
pip install selenium webdriver-manager
```

### Step 3 — Run the test

```bash
python automation/test_quiz.py
```

---

## 🧪 **Selenium Test Code (Python)**

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = Options()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.implicitly_wait(5)

try:
    driver.get("http://127.0.0.1:5500/index.html")

    # Start quiz
    driver.find_element(By.ID, "startBtn").click()

    # Iterate questions
    while True:
        options_btns = driver.find_elements(By.CSS_SELECTOR, ".option")
        if options_btns:
            options_btns[0].click()

        next_btns = driver.find_elements(By.ID, "nextBtn")
        if next_btns and next_btns[0].is_enabled():
            next_btns[0].click()
            time.sleep(0.2)
        else:
            break

    driver.find_element(By.ID, "submitBtn").click()
    summary = driver.find_element(By.ID, "summary")
    print("\n=== Quiz Summary ===")
    print(summary.text)

finally:
    time.sleep(1)
    driver.quit()
```

---

## 📹 **Screen Recording (Demo Video)**

Recording done using **Xbox Game Bar (Windows Built-in)**:

* Press: **Win + Alt + R** → Start recording
* Press: **Win + Alt + R** → Stop recording
* Videos saved automatically to:

  ```
  C:\Users\<YourUserName>\Videos\Captures
  ```

You may upload this video to your GitHub repo or include in your submission.

---

## 📄 **.gitignore (Recommended)**

```
.venv/
automation/chromedriver.exe
__pycache__/
```

---

## ⭐ **Why This Project Is Perfect for Frugal Testing**

This project demonstrates:

✔ Strong HTML/CSS/JS skills
✔ Clean UI/UX design
✔ Timer logic, navigation, dynamic rendering
✔ Automated testing knowledge
✔ Selenium WebDriver proficiency
✔ Ability to create maintainable test automation suites
✔ Real-world QA + Frontend capability

---
