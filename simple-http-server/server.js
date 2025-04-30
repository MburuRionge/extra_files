const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create the hhtp server
const server = http.createServer((req, res) => {
	// Handle different HTTPmethods
	switch (req.method) {
		case 'GET':
			handleGetRequest(req, res);
			break;
		case 'POST':
			handlePostRequest(req, res);
			break;
		default:
			sendResponse(res, 405, { message: 'Method not allowed' });
	}
});

// Start the server
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

// Helper function to send responses
function sendResponse(res, statusCode, data) {
	res.writeHead(statusCode, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(data));
}

// Handle Get requests
function handleGetRequest(req, res) {
	const { url } = req;

	if (url === '/') {
		sendResponse(res, 200, { message: 'Welcome to our server!'});
	} else if (url === '/about') {
		sendResponse(res, 200, { message: 'About us page' });
	} else if (url.startsWith('/download')) {
		handleFileDownload(req, res);
	} else {
		sendResponse(res, 404, {message: 'Route not found'});
	}
}


// Handle POST requests
function handlePostRequest(req, res) {
	let body = '';

	// Collect data  from the request stream
	req.on('data', chunk => {
		body += chunk.toString();
	});


	// When all data is received
	req.on('end', () => {
		try {
			const data = JSON.parse(body);
			sendResponse(res, 200, {
				message: 'Data received successfully',
				receivedData: data
			});
		} catch (error) {
			sendResponse(res, 400, { message: 'invalid JSON'});
		}
	});
}

// handle file download
function handleFileDownload(req, res) {
	// Extracy file name from url (e.g, /download/video.mp4)
	const filename = req.url.split('/download/')[1];

	if (!filename) {
		return sendResponse(res, 400, { message: 'Filename is required'});
	}

	const filePath = path.join(__dirname, 'downloads', filename);

	// Check if file exists
	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			return sendResponse(res, 404, { message: 'File not found'});
		}

		// Get the file stats(for Content-Length header)
		fs.stat(filePath, (eerr, stats) => {
			if (err) {
				return sendResponse(res, 500, { message: 'Error reading file'});
			}

			// Set headers for file download
			res.writeHead(200, {
				'Content-Type':'application/octet-stream',
				'Content-Length': stats.size,
				'Content-Disposition': `attachment; filename=:"${filename}"`
			});

			// Create a read stream and pipe it to the response
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);

			// Handle stream errors
			fileStream.on('error', (err) => {
				console.error('	File stream error:', err);
				res.end();
			});
		});
	});
}