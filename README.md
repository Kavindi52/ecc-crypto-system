# Elliptic Curve Cryptography Demo

Educational web application demonstrating basic **Elliptic Curve Cryptography (ECC)** concepts with visual feedback and a simple key-exchange example.

### What this project shows

- Points that satisfy an elliptic curve equation over a small finite field GF(p)
- Smooth real-number approximation of the curve + discrete finite-field points
- Fundamental group operations: point addition, point doubling, scalar multiplication
- Practical **ECDH** (Elliptic Curve Diffie–Hellman) key exchange simulation

Ideal for:
- Cryptography beginners
- University / college assignments & presentations
- Self-study of elliptic-curve-based cryptography

## Features

- Customizable curve parameters (a, b, p)
- Lists every point on the curve in GF(p)
- Interactive scatter/line chart (Chart.js):
  - red curve → real-number approximation
  - blue dots → actual points modulo p
- Basic operations via buttons (addition, doubling, scalar multiplication)
- Live ECDH demo showing public-key calculation and shared secret agreement
- Responsive, clean interface (Bootstrap 5 + custom CSS)
- Pure-Python ECC implementation (no external crypto libraries)

## Project structure

```bash
ecc-crypto-system/
│
├── backend/
│   ├── app.py
│   ├── ecc.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
└── README.md

```

### Requirements

### Backend
- Python 3.8+
- Flask
- flask-cors

### Frontend
- Modern browser (Chrome, Edge, Firefox, Safari…)
- Internet connection (CDNs for Bootstrap & Chart.js)

## Installation & Running Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Kavindi52/ecc-crypto-system.git
# Adjust the name if you chose a different repository name
cd ecc-crypto-system
```
### 2. Start the backend (Flask server)

```bash
 cd backend
```

### (Recommended) Create & activate virtual environment
```bash
python -m venv venv
```

### Windows
```bash
venv\Scripts\activate
```

### macOS / Linux
```bash
 source venv/bin/activate
```
### Install dependencies
```bash
pip install -r requirements.txt
```
### Start server
```bash
python app.py
```

Expected output:
textECC Crypto Demo running on http://localhost:5000
 * Running on http://127.0.0.1:5000
→ Keep this terminal open.

3. Open the frontend
Quickest method
Double-click or drag into browser:
textfrontend/index.html
Recommended method (better caching & reloading)

Open a second terminal:
```bash
cd frontend
python -m http.server 8000
# or python3 -m http.server 8000
```
Then visit:
http://localhost:8000
VS Code users
Install Live Server extension → right-click index.html → Open with Live Server

### 4. Quick start in the browser

## Use default values (a=1, b=6, p=17)
Click List All Points & Draw Curve → see graph
Switch to ECDH Key Exchange tab
Change Alice / Bob private keys
Click Compute Shared Secret → observe that both sides reach the same point

## Default toy curve
Equation: y² = x³ + x + 6 (mod 17)
Common base point used in the ECDH demo: G = (3, 6)
Possible next steps / improvements

## Add point-on-curve validation
Visualize the secant/tangent line during point addition
Store calculation history (SQLite)
Support standard NIST / SECG curves (secp256r1, secp256k1, …)
Add basic ElGamal encryption example
Theme switch (light/dark mode)
Better mobile experience & touch support

License
MIT License
Free to use, modify and share for educational and personal purposes.

### Built with
```bash
Python + Flask
HTML + Bootstrap 5
JavaScript + Chart.js 4
Pure mathematics (no OpenSSL, cryptography.io, etc.)
```
Happy exploring elliptic curves!
