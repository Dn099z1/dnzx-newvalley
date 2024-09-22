-----------------------------------------------------------------------------------------------------------------------------------------
-- CONTAINERS
-----------------------------------------------------------------------------------------------------------------------------------------
local Containers = {
	["1"] = vec3(-905.15,-2781.36,14.33)
}
-----------------------------------------------------------------------------------------------------------------------------------------
-- ONCLIENTRESOURCESTART
-----------------------------------------------------------------------------------------------------------------------------------------
AddEventHandler("onClientResourceStart",function(Resource)
	if (GetCurrentResourceName() ~= Resource) then
		return
	end

	for Number,v in pairs(Containers) do
		exports["target"]:AddCircleZone("Robberys:Containers:"..Number,v,0.25,{
			name = "Robberys:Containers:"..Number,
			heading = 0.0,
			useZ = true
		},{
			shop = Number,
			Distance = 1.25,
			options = {
				{
					event = "inventory:Container",
					tunnel = "server",
					label = "Roubar"
				}
			}
		})
	end
end)