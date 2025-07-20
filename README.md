✅ 1. Core Requirements
Tool	Purpose	Installation Command
Node.js	Runtime for Express server	Download from https://nodejs.org

npm	Package manager (comes with Node.js)	Already included
MongoDB	NoSQL database for storing users, events, attendance, payments, etc.	Download from https://www.mongodb.com/try/download/community or use MongoDB Atlas

Postman	API testing GUI	https://www.postman.com/downloads
________________________________________
✅ 2. Project Setup & Run Commands
bash
CopyEdit
# Step into project directory
cd your-project-directory

# Install all dependencies
npm install

# Start the server
node server.js
Or for auto-reload during development:
bash
CopyEdit
npm install -g nodemon
nodemon server.js
________________________________________
✅ 3. Dependencies Used (Install via npm)
Package	Command to Install	Used For
express	npm install express	Backend routing
mongoose	npm install mongoose	MongoDB ODM
multer	npm install multer	File uploads (payment proof)
pdfkit	npm install pdfkit	PDF certificate generation
qrcode	npm install qrcode	QR code generation for attendance
morgan	npm install morgan	Request logging
cors	npm install cors	Enable CORS for frontend-backend communication
dotenv	npm install dotenv	Environment variable management
jsonwebtoken	npm install jsonwebtoken	JWT auth (if used)
stripe	npm install stripe	Stripe payment API (for online payment simulation)

✅ 4. Testing With Postman
•	Method: GET, POST as per routes
•	Auth: Bearer Token
•	Headers: Content-Type: application/json (or form-data for file uploads)
•	Body: raw JSON or form-data based on endpoint

