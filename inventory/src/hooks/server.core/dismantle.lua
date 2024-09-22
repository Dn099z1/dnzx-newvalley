-----------------------------------------------------------------------------------------------------------------------------------------
-- VARIABLES
-----------------------------------------------------------------------------------------------------------------------------------------
Travel = {}
Boosting = {}
Dismantle = {}
Creative = {}

-----------------------------------------------------------------------------------------------------------------------------------------
-- GENERATEPLATE
-----------------------------------------------------------------------------------------------------------------------------------------
exports("GeneratePlate",function()
	local Plate = ""

	repeat
		Plate = vRP.GenerateString("DDLLLDDD")
	until not Dismantle[Plate] and not Boosting[Plate]

	return Plate
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- INVENTORY:BOOSTING
-----------------------------------------------------------------------------------------------------------------------------------------
AddEventHandler("inventory:Boosting",function(Plate,Status)
	if not Boosting[Plate] then
		Boosting[Plate] = Status
	end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- GARAGES:DELETE
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("garages:Delete")
AddEventHandler("garages:Delete",function(Network,Plate)
	if Plate then
		if Dismantle[Plate] and vRP.Passport(Dismantle[Plate]) then
			TriggerClientEvent("dismantle:Reset",Dismantle[Plate])
			Dismantle[Plate] = nil
		end

		if Boosting[Plate] and vRP.Passport(Boosting[Plate]["Source"]) then
			TriggerClientEvent("boosting:Reset",Boosting[Plate]["Source"])
			exports["boosting"]:Remove(Boosting[Plate]["Passport"],Plate)
			Boosting[Plate] = nil
		end
	end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- CREATEVEHICLE
-----------------------------------------------------------------------------------------------------------------------------------------
function Creative.CreateVehicle(Model,Coords)
	local source = source
	local Passport = vRP.Passport(source)
	if Passport then
		local Vehicle = CreateVehicle(Model,Coords,true,true)

		while not DoesEntityExist(Vehicle) do
			Wait(1)
		end

		if DoesEntityExist(Vehicle) then
			local Plate = exports["inventory"]:GeneratePlate()

			SetVehicleNumberPlateText(Vehicle,Plate)
			SetVehicleCustomPrimaryColour(Vehicle,math.random(255),math.random(255),math.random(255))
			SetVehicleCustomSecondaryColour(Vehicle,math.random(255),math.random(255),math.random(255))

			Entity(Vehicle)["state"]:set("Nitro",0,true)
			Entity(Vehicle)["state"]:set("Fuel",100,true)
			Entity(Vehicle)["state"]:set("Tower",true,true)

			Dismantle[Plate] = source

			local Service = vRP.NumPermission("Policia")
			for Passports,Sources in pairs(Service) do
				async(function()
					TriggerClientEvent("sounds:Private",Sources,"crime",0.5)
					TriggerClientEvent("NotifyPush",Sources,{ code = 31, title = "Desmanche de Veículo", x = Coords["x"], y = Coords["y"], z = Coords["z"], vehicle = VehicleName(Model).." - "..Plate, color = 44 })
				end)
			end

			return NetworkGetNetworkIdFromEntity(Vehicle)
		end
	end

	return false
end
-----------------------------------------------------------------------------------------------------------------------------------------
-- DISMANTLE
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("inventory:Dismantle")
AddEventHandler("inventory:Dismantle",function(Entity)
	local source = source
	local Plate = Entity[1]
	local Passport = vRP.Passport(source)
	if Passport and not Active[Passport] and Dismantle[Plate] then
		vRP.FreezePlayer(source,true)
		Active[Passport] = os.time() + 60
		Player(source)["state"]["Buttons"] = true
		TriggerClientEvent("inventory:Close",source)
		TriggerClientEvent("Progress",source,"Desmanchando",60000)
		vRPC.playAnim(source,false,{"anim@amb@clubhouse@tutorial@bkr_tut_ig3@","machinic_loop_mechandplayer"},true)

		repeat
			if Active[Passport] and os.time() >= parseInt(Active[Passport]) and Dismantle[Plate] then
				vRPC.Destroy(source)
				Active[Passport] = nil
				vRP.FreezePlayer(source,false)
				Player(source)["state"]["Buttons"] = false
				TriggerClientEvent("dismantle:Reset",source)
				TriggerEvent("garages:Delete",Entity[4],Plate)
				TriggerClientEvent("player:Residuals",source,"Resíduo de Borracha.")

				local Experience = vRP.GetExperience(Passport,"Dismantle")
				local Valuation = 1275 + (ClassCategory(Experience) * 25)

				if Buffs["Dexterity"][Passport] and Buffs["Dexterity"][Passport] > os.time() then
					Valuation = Valuation + (Valuation * 0.1)
				end

				if exports["party"]:DoesExist(Passport) then
					local Consult = exports["party"]:Room(Passport,source,25)
					local AmountMembers = CountTable(Consult)

					if AmountMembers >= 5 then
						Valuation = Valuation + (Valuation * 0.1)
					end

					for Number = 1,AmountMembers do
						if vRP.Passport(Consult[Number]["Source"]) then
							vRP.PutExperience(Consult[Number]["Passport"],"Dismantle",3)
							vRP.GenerateItem(Consult[Number]["Passport"],"dirtydollar",Valuation,true)
						end
					end
				else
					vRP.PutExperience(Passport,"Dismantle",3)
					vRP.GenerateItem(Passport,"dirtydollar",Valuation,true)
				end

				if math.random(100) >= 75 then
					vRP.GenerateItem(Passport,"plate",1,true)
				end
			end

			Wait(100)
		until not Active[Passport] or not Dismantle[Plate]
	end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- EXPERIENCE
-----------------------------------------------------------------------------------------------------------------------------------------
function Creative.Experience()
	local source = source
	local Passport = vRP.Passport(source)
	if Passport then
		return vRP.GetExperience(Passport,"Dismantle")
	end

	return 0
end