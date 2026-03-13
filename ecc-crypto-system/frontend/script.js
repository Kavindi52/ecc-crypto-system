let chart;

const API = 'http://localhost:5000';

async function apiCall(endpoint, body) {
  try {
    const res = await fetch(API + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    alert("Backend communication error: " + err.message);
    throw err;
  }
}

async function loadPoints() {
  const a = Number(document.getElementById('a').value);
  const b = Number(document.getElementById('b').value);
  const p = Number(document.getElementById('p').value);

  if (isNaN(a) || isNaN(b) || isNaN(p) || p < 2) {
    alert("Please enter valid numbers for a, b, p (p should be a prime)");
    return;
  }

  // Fetch finite field points
  let data;
  try {
    data = await apiCall('/get_points', { a, b, p });
  } catch {
    return;
  }

  const realPoints = data.points || [];

  // Approximate real curve over ℝ
  const curvePoints = [];
  const step = 0.05;
  const range = Math.max(5, p * 0.7);
  const xMin = -range;
  const xMax = range;

  for (let x = xMin; x <= xMax; x += step) {
    const rhs = x**3 + a * x + b;
    if (rhs >= 0) {
      const y = Math.sqrt(rhs);
      curvePoints.push({ x, y });
      if (y > 1e-6) curvePoints.push({ x, y: -y });
    }
  }

  // Destroy old chart if exists
  if (chart) chart.destroy();

  const ctx = document.getElementById('pointChart').getContext('2d');
  chart = new Chart(ctx, {
    data: {
      datasets: [
        {
          label: 'Elliptic Curve (real)',
          data: curvePoints,
          borderColor: 'rgba(220, 53, 69, 0.85)',
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.1,
          type: 'line',
          showLine: true
        },
        {
          label: `Points on curve (mod ${p})`,
          data: realPoints.map(([x, y]) => ({ x, y })),
          backgroundColor: '#0d6efd',
          pointRadius: 7,
          pointHoverRadius: 11,
          type: 'scatter'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          min: Math.floor(xMin),
          max: Math.ceil(xMax),
          title: { display: true, text: 'x' }
        },
        y: {
          title: { display: true, text: 'y' },
          suggestedMin: -range,
          suggestedMax: range
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (context) => {
              if (context.dataset.type === 'scatter') {
                return `(${context.parsed.x}, ${context.parsed.y}) mod ${p}`;
              }
              return `≈ (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
            }
          }
        }
      }
    }
  });

  alert(`Found ${realPoints.length} points on the curve over GF(${p})`);
}

// Basic operations (using prompt for simplicity)
async function performOperation(type) {
  const a = Number(document.getElementById('a').value);
  const b = Number(document.getElementById('b').value);
  const p = Number(document.getElementById('p').value);

  let payload = { a, b, p };
  let endpoint = '';

  if (type === 'add') {
    endpoint = '/add';
    payload.p1x = Number(prompt('P1 x'));
    payload.p1y = Number(prompt('P1 y'));
    payload.p2x = Number(prompt('P2 x'));
    payload.p2y = Number(prompt('P2 y'));
  } else if (type === 'double') {
    endpoint = '/double';
    payload.px = Number(prompt('Point x'));
    payload.py = Number(prompt('Point y'));
  } else if (type === 'multiply') {
    endpoint = '/multiply';
    payload.px = Number(prompt('Base point x'));
    payload.py = Number(prompt('Base point y'));
    payload.k  = Number(prompt('Scalar k'));
  }

  if (isNaN(payload.k ?? payload.p1x ?? payload.px)) {
    alert("Invalid input");
    return;
  }

  try {
    const res = await apiCall(endpoint, payload);
    const result = res.result;
    alert(`Result: ${result === 'infinity' ? 'Point at infinity (O)' : `(${result[0]}, ${result[1]})`}`);
  } catch {}
}

// ECDH demo (using default base point G = (3,6) on the example curve)
async function runECDH() {
  const a = Number(document.getElementById('a').value);
  const b = Number(document.getElementById('b').value);
  const p = Number(document.getElementById('p').value);
  const privA = Number(document.getElementById('privA').value);
  const privB = Number(document.getElementById('privB').value);

  const G = { x: 3, y: 6 }; // known generator for the default curve

  try {
    const pubAres = await apiCall('/multiply', { a, b, p, px: G.x, py: G.y, k: privA });
    const pubBres = await apiCall('/multiply', { a, b, p, px: G.x, py: G.y, k: privB });

    document.getElementById('pubA').textContent = pubAres.result === 'infinity' ? '∞' : `(${pubAres.result[0]}, ${pubAres.result[1]})`;
    document.getElementById('pubB').textContent = pubBres.result === 'infinity' ? '∞' : `(${pubBres.result[0]}, ${pubBres.result[1]})`;

    // Shared secret = a * (bG) = b * (aG)
    const sharedRes = await apiCall('/multiply', { a, b, p, px: pubBres.result[0], py: pubBres.result[1], k: privA });
    document.getElementById('shared').textContent = sharedRes.result === 'infinity' ? '∞' : `(${sharedRes.result[0]}, ${sharedRes.result[1]})`;
  } catch (err) {
    alert("ECDH calculation failed");
  }
}

// Tab switching
document.querySelectorAll('#tabs a').forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('d-none'));
    document.getElementById(tab.dataset.tab + '-tab').classList.remove('d-none');
    document.querySelectorAll('#tabs a').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});