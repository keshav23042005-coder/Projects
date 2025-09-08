import speech_recognition as sr
import os
import pyautogui
import sys
import webbrowser
import datetime
import pyttsx3

def speak(text):
    engine = pyttsx3.init()   # initialize inside function (fixes repeat issue)
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[1].id)  # female voice (change index if needed)
    engine.setProperty('rate', 170)  # speaking speed
    print("Assistant:", text)
    engine.say(text)
    engine.runAndWait()
    engine.stop()

def listen_command():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = r.listen(source)
    try:
        command = r.recognize_google(audio, language="en-US")  # English
        print("You said:", command)
        return command.lower()
    except:
        speak("Sorry, I didn't catch that.")
        return ""

def execute_command(command):
    # Desktop & Windows
    if "desktop" in command:
        pyautogui.hotkey("win", "d")
        speak("Showing desktop")

    elif "close" in command:
        pyautogui.hotkey("alt", "f4")
        speak("Closing window")

    elif "lock" in command:
        os.system("rundll32.exe user32.dll,LockWorkStation")
        speak("Locking your computer")

    # Apps
    elif "notepad" in command:
        os.system("notepad")
        speak("Opening Notepad")

    elif "chrome" in command:
        os.system("start chrome")
        speak("Opening Chrome")

    elif "youtube" in command:
        webbrowser.open("https://www.youtube.com")
        speak("Opening YouTube")

    # Google Search
    elif "search" in command:
        query = command.replace("search", "").strip()
        if query:
            webbrowser.open(f"https://www.google.com/search?q={query}")
            speak(f"Searching Google for {query}")

    # Time & Date
    elif "time" in command:
        now = datetime.datetime.now().strftime("%H:%M:%S")
        speak(f"The current time is {now}")

    elif "date" in command:
        today = datetime.date.today().strftime("%B %d, %Y")
        speak(f"Today's date is {today}")

    # System Control
    elif "shutdown" in command:
        speak("Shutting down your computer")
        os.system("shutdown /s /t 1")

    elif "restart" in command:
        speak("Restarting your computer")
        os.system("shutdown /r /t 1")

    # Exit
    elif "exit" in command or "quit" in command:
        speak("Goodbye!")
        sys.exit()

    else:
        speak("Sorry, I don't recognize that command.")

while True:
    cmd = listen_command()
    if cmd:
        execute_command(cmd)
