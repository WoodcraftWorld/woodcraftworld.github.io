import time
import threading
from pynput.mouse import Button, Controller
from pynput.keyboard import Listener, KeyCode

# --- CONFIGURATION ---
DELAY = 0.05        # Delay between clicks in seconds (lower = faster clicks)
BUTTON = Button.left  # Choose Button.left or Button.right

# Hotkeys (Using character keys)
START_STOP_KEY = KeyCode(char='s')  # Press 's' to start/stop clicking
EXIT_KEY = KeyCode(char='e')        # Press 'e' to quit the program
# ---------------------

class AutoClicker(threading.Thread):
    def __init__(self, delay, button):
        super().__init__()
        self.delay = delay
        self.button = button
        self.running = False
        self.active = True

    def start_clicking(self):
        self.running = True

    def stop_clicking(self):
        self.running = False

    def exit(self):
        self.stop_clicking()
        self.active = False

    def run(self):
        mouse = Controller()
        while self.active:
            while self.running:
                mouse.click(self.button)
                time.sleep(self.delay)
            time.sleep(0.1)

# Initialize and start the background thread
clicker = AutoClicker(DELAY, BUTTON)
clicker.start()

def on_press(key):
    global clicker
    try:
        if key == START_STOP_KEY:
            if clicker.running:
                clicker.stop_clicking()
                print("\n[INFO] Auto-clicker PAUSED.")
            else:
                clicker.start_clicking()
                print("\n[INFO] Auto-clicker STARTED.")
        elif key == EXIT_KEY:
            clicker.exit()
            print("\n[INFO] Exiting Auto-clicker.")
            return False  # Stops the listener
    except AttributeError:
        pass

print("=== Python Mac Auto-Clicker ===")
print(f"Press '{START_STOP_KEY.char}' to Start/Pause clicking.")
print(f"Press '{EXIT_KEY.char}' to Quit.")
print("Running... (Make sure to grant macOS accessibility permissions if prompted)")

# Start listening to global keyboard events
with Listener(on_press=on_press) as listener:
    listener.join()