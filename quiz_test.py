from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging
import time
import random

# ---------- LOG CONFIG ----------
logging.basicConfig(
    filename="selenium_test.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

QUIZ_URL = "file:///C:/Users/Dell/Desktop/quiz_frugal/quiz.html"

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

logging.info("=== TEST EXECUTION STARTED ===")

try:
    # ---------- OPEN QUIZ ----------
    driver.get(QUIZ_URL)
    time.sleep(2)

    logging.info("Quiz page opened")
    logging.info(f"Current URL: {driver.current_url}")
    logging.info(f"Page Title: {driver.title}")

    # ---------- VISIBLY SELECT DIFFICULTY (RADIO BUTTON) ----------
    difficulty = random.choice(["easy", "medium", "hard"])
    driver.find_element(By.CSS_SELECTOR, f'input[value="{difficulty}"]').click()
    logging.info(f"Difficulty selected: {difficulty}")
    time.sleep(2)

    # ---------- START QUIZ ----------
    driver.find_element(By.ID, "startBtn").click()
    logging.info("Start Quiz clicked")
    time.sleep(1.5)

    question_number = 1

    # ---------- ANSWER QUESTIONS ----------
    while True:
        if driver.find_elements(By.ID, "result") and driver.find_element(By.ID, "result").is_displayed():
            break

        wait.until(EC.presence_of_element_located((By.ID, "options")))
        labels = driver.find_elements(By.CSS_SELECTOR, "#options label")

        if not labels:
            break

        random.choice(labels).click()
        logging.info(f"Random option selected for Question {question_number}")

        time.sleep(1.5)
        driver.find_element(By.ID, "nextBtn").click()

        question_number += 1
        time.sleep(2)

    # ---------- VERIFY RESULT ----------
    result_text = driver.find_element(By.ID, "result").text
    logging.info("Result page displayed")
    logging.info("Result Text:\n" + result_text)

    time.sleep(3)
    driver.quit()
    logging.info("Browser closed")
    logging.info("=== TEST EXECUTION COMPLETED SUCCESSFULLY ===")

except Exception as e:
    logging.error("Test execution failed", exc_info=True)
    driver.quit()
