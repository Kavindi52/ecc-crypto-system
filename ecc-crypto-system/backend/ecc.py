class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"({self.x}, {self.y})"

    def __eq__(self, other):
        if other is None:
            return False
        return self.x == other.x and self.y == other.y


class EllipticCurve:
    def __init__(self, a, b, p):
        self.a = a
        self.b = b
        self.p = p

    def modinv(self, k):
        if k % self.p == 0:
            raise ValueError("Division by zero (point at infinity)")
        return pow(k, -1, self.p)

    def add(self, P, Q):
        if P is None:
            return Q
        if Q is None:
            return P
        if P.x == Q.x and (P.y + Q.y) % self.p == 0:
            return None

        if P == Q:
            # Point doubling
            if (2 * P.y) % self.p == 0:
                return None
            lam = (3 * P.x**2 + self.a) * self.modinv(2 * P.y) % self.p
        else:
            # Point addition
            dx = (Q.x - P.x) % self.p
            if dx == 0:
                return None
            lam = (Q.y - P.y) * self.modinv(dx) % self.p

        x3 = (lam**2 - P.x - Q.x) % self.p
        y3 = (lam * (P.x - x3) - P.y) % self.p
        return Point(x3, y3)

    def scalar_multiply(self, P, k):
        if k == 0 or P is None:
            return None
        result = None
        addend = P
        while k > 0:
            if k & 1:
                result = self.add(result, addend)
            addend = self.add(addend, addend)
            k >>= 1
        return result

    def get_all_points(self):
        points = []
        for x in range(self.p):
            rhs = (pow(x, 3, self.p) + (self.a * x % self.p) + self.b) % self.p
            for y in range(self.p):
                if pow(y, 2, self.p) == rhs:
                    points.append(Point(x, y))
        return points