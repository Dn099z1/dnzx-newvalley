fx_version "cerulean"
game "gta5"
lua54 "yes"

ui_page "src/web/index.html"

shared_scripts {
	"@vrp/lib/utils.lua",
	"@vrp/lib/Tunnel.lua",
	"@vrp/lib/Proxy.lua",
}

client_scripts {
	"hooks/client-side/*"
}

server_scripts {
	"hooks/server-side/*"
}

files {
	"src/web/*",
	"src/web/**/*"
}
