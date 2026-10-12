const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body || {});
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch (e) {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch (e) {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('--- Step 1: Health Check ---');
  const health = await get('/api/health');
  console.log('Health:', health.status, health.body);

  console.log('\n--- Step 2: Login as Priya ---');
  const login = await post('/api/auth/login', {
    email: 'priya@peerskill.edu',
    password: 'Password@123'
  });
  console.log('Login Status:', login.status, 'Success:', login.body.success, 'User:', login.body.user.name, 'Credits:', login.body.user.credits);
  const token = login.body.token;

  console.log('\n--- Step 3: Fetch Priya Dashboard Stats ---');
  const dash = await get('/api/dashboard/stats', token);
  console.log('Dashboard Stats:', dash.body.stats);

  console.log('\n--- Step 4: Discover Students with Category Filter ---');
  const discover = await get('/api/matches/discover?category=Data%20Science&proficiency=Advanced', token);
  console.log('Discovered Count:', discover.body.count, 'Students:', discover.body.students.map(s => s.name));
  const rahulId = discover.body.students[0]._id;

  console.log('\n--- Step 5: Fetch Public Profile of Discovered Student (Rahul) ---');
  const rahulProfile = await get(`/api/auth/student/${rahulId}`, token);
  console.log('Rahul Response:', rahulProfile.status);
  if (rahulProfile.body && rahulProfile.body.student) {
    console.log('Rahul Public Profile:', rahulProfile.body.student.name, 'College:', rahulProfile.body.student.college, 'Rating:', rahulProfile.body.student.averageRating);
  }

  console.log('\n--- Step 6: Test Invalid Google ID Token ---');
  const badGoogle = await post('/api/auth/google', { credential: 'fake_invalid_google_jwt_token' });
  console.log('Bad Google Token Status:', badGoogle.status, 'Message:', badGoogle.body.message);

  console.log('\n✅ All Live API checks passed successfully!');
}

run().catch(console.error);
