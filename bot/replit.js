if (process.env.KEEP_REPL_ALIVE) {
	const http = require('http');

	const server = http.createServer((req, res) => {
		res.writeHead(200);
		res.end(`Bot is responding! (${new Date().getTime()})`);
	});

	server.on('error', (err) => {
		console.error(err);
		process.exit(1);
	})

	server.listen(3000);
}