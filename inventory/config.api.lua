Config = {
	Guild_ID = '1275474031801274523', -- Defina o ID do seu guilda (ou sua guilda principal se usar múltiplas guildas)
	Multiguild = false, -- Defina como verdadeiro se quiser usar várias guildas
	Guilds = {
		["name"] = "guild_id", -- Substitua isso por um nome, como "principal"
	},
	Bot_Token = 'MTA0OTczMjY4MjczODgzOTYyNA.Gb5oLz.PgErf-NK9XFoOFWgoAMgzQH45i7Uz97sujf1wU',
	RoleList = {},
	DebugScript = false,
	CacheDiscordRoles = true, -- verdadeiro para armazenar em cache os papéis dos jogadores, falso para fazer uma nova solicitação ao Discord a cada vez
	CacheDiscordRolesTime = 60, -- se CacheDiscordRoles for verdadeiro, quanto tempo armazenar em cache os papéis antes de limpar (em segundos)
}

Config.Splash = {
	Header_IMG = 'https://forum.cfx.re/uploads/default/original/3X/a/6/a6ad03c9fb60fa7888424e7c9389402846107c7e.png',
	Enabled = true,
	Wait = 10, -- Quantos segundos a página de splash deve ser exibida? (O máximo é 12)
	Heading1 = "Bem-vindo ao [ServerName]",
	Heading2 = "Certifique-se de se juntar ao nosso Discord e conferir nosso site!",
	Discord_Link = 'https://discord.gg',
	Website_Link = 'https://badger.store',
}