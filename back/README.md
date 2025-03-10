<h1>How to setup this project?</h1>

<h2>Step 1: Create ".env" file in the root of the rust project</h2>
<p>The ".env" file must have values for:</p>
<ul>
  <li><b>BIND_URL</b>: the URL where the server is going to run</li>
  <li><b>PORT</b>: port where the server is going to run</li>
  <li><b>ALLOWED_ORIGIN</b>: the URL <b>INCLUDING PORT</b> where the client is running</li>
  <li><b>ADMIN_KEY</b>: key given for administrator users to create an account</li>
  <li><b>DB_NAME</b>: name for the database</li>
</ul>

<h2>Step 2: Execute the DB initialization script</h2>
<p>Inside the root of the rust project run: 'cargo run --bin setup_db'</p>

<h3>Step 3: Run the server</h3>
<p>Inside the root of the rust project run: 'cargo run'</p>
