const fs = require("fs")
const jsonServer = require("json-server")
const path = require("path")
const https = require("https")
const http = require("http")

const server = jsonServer.create()

const router = jsonServer.router(path.resolve(__dirname, "db.json"))

server.use(jsonServer.defaults({}))
server.use(jsonServer.bodyParser)

server.use(async (req, res, next) => {
	await new Promise(res => {
		setTimeout(res, 800)
	})
	next()
})

server.post("/login", (req, res) => {
	try {
		const { userName, password } = req.body
		const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"))
		const { users = [] } = db

		const userFromBd = users.find(
			user => user.userName === userName && user.password === password
		)

		if (userFromBd) {
			return res.json({
				userName: userFromBd.userName,
				id: userFromBd.id,
				avatar: userFromBd.avatar,
				roles: userFromBd.roles,
				features: userFromBd.features,
				settings: userFromBd.settings
			})
		}

		return res.status(403).json({ message: "User not found" })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: e.message })
	}
})

server.use((req, res, next) => {
	next()
})

const HTTP_PORT = process.env.PORT || 8000

const httpServer = http.createServer(server)

server.use(router)

httpServer.listen(HTTP_PORT, () => {
	console.log(`server is running on ${HTTP_PORT} port`)
})
