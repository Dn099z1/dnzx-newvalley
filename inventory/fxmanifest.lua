fx_version "bodacious"
game "gta5"
lua54 "yes"

ui_page "src/web/index.html"

client_scripts {
	"@vrp/config/Native.lua",
	"@vrp/config/Vehicle.lua",
	"@vrp/config/Item.lua",
	"@PolyZone/client.lua",
	"@vrp/lib/Utils.lua",
	"src/hooks/client.core/*",
	"src/api/api.client/*"
}

server_scripts {
	"@vrp/config/Vehicle.lua",
	"@vrp/config/Item.lua",
	"@vrp/lib/Utils.lua",
	"src/hooks/server.core/*",
	"src/api/api.server/*"
}

shared_scripts {
	"config.api.lua",
}

files {
	"src/web/*",
	"src/web/**/*",
	"src/web/**/**/*",
	"src/web/**/**/**/*"
}