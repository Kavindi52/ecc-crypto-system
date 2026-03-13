from flask import Flask, request, jsonify
from flask_cors import CORS
from ecc import EllipticCurve, Point

app = Flask(__name__)
CORS(app)   # Allows frontend to call the API

@app.route('/get_points', methods=['POST'])
def get_points():
    data = request.get_json()
    curve = EllipticCurve(data['a'], data['b'], data['p'])
    pts = curve.get_all_points()
    return jsonify({'points': [[p.x, p.y] for p in pts]})

@app.route('/add', methods=['POST'])
def add_point():
    data = request.get_json()
    curve = EllipticCurve(data['a'], data['b'], data['p'])
    P = Point(data['p1x'], data['p1y']) if data.get('p1x') is not None else None
    Q = Point(data['p2x'], data['p2y']) if data.get('p2x') is not None else None
    result = curve.add(P, Q)
    return jsonify({'result': 'infinity' if result is None else [result.x, result.y]})

@app.route('/double', methods=['POST'])
def double_point():
    data = request.get_json()
    curve = EllipticCurve(data['a'], data['b'], data['p'])
    P = Point(data['px'], data['py'])
    result = curve.add(P, P)   # doubling = P + P
    return jsonify({'result': 'infinity' if result is None else [result.x, result.y]})

@app.route('/multiply', methods=['POST'])
def multiply_point():
    data = request.get_json()
    curve = EllipticCurve(data['a'], data['b'], data['p'])
    P = Point(data['px'], data['py'])
    result = curve.scalar_multiply(P, data['k'])
    return jsonify({'result': 'infinity' if result is None else [result.x, result.y]})

if __name__ == '__main__':
    print("ECC Crypto Demo running on http://localhost:5000")
    app.run(debug=True)