local tal = SILE.baseClass {id = "tal"}

tal:declareFrame("content", {left = "1cm", right = "100% - 1cm", top = "1cm", bottom = "100% - 1cm"})
tal.pageTemplate.firstContentFrame = tal.pageTemplate.frames["content"]

SILE.scratch.tal = {
	extrafeats = {},
	languages = {},
	commonskills = {},
	combatskills = {},
	specialskills = {},
	generalfeats = {},
	innatefeats = {},
}

tal.init = function(self)
	local v = SILE.baseClass.init(self)

	SILE.call("font", {language = "pl", family = "Ubuntu"})
	SILE.settings.set("document.parskip", SILE.nodefactory.newVglue("10pt"))
	SILE.settings.set("document.parindent", SILE.nodefactory.newGlue("0pt"))

	return v
end

tal.registerCommands = function(self)
	local v = SILE.baseClass.registerCommands(self)

	SILE.registerCommand("vfill", function(options, content)
		SILE.typesetter:leaveHmode()
		SILE.typesetter:pushExplicitVglue(SILE.nodefactory.vfillGlue)
	end)

	SILE.registerCommand("br", function(options, content)
		SILE.typesetter:leaveHmode()
	end)

	SILE.registerCommand("itemlist", function(options, content)
		SILE.process(content)
	end)

	SILE.registerCommand("item", function(options, content)
		if options.title then
			SILE.call("item:title", {}, {options.title})
		end

		SILE.process(content)
		SILE.call("par")
	end)

	SILE.registerCommand("tal:extrafeat", function(options, content)
		local name = SILE.findInTree(content, "name")
		local description = SILE.findInTree(content, "description")
		local forbidden = SILE.findInTree(content, "forbidden")

		SILE.call("tal:extrafeat:name", {}, name)
		SILE.call("tal:extrafeat:description", {}, description)
		if forbidden then
			SILE.call("tal:extrafeat:forbidden", {}, forbidden)
		end
		SILE.call("par")

		table.insert(SILE.scratch.tal.extrafeats, {
			name = name[1],
			forbidden = forbidden and forbidden[1] or nil,
		})
	end)

	SILE.registerCommand("tal:language", function(options, content)
		local name = SILE.findInTree(content, "name")
		local native = SILE.findInTree(content, "native")
		local group = SILE.findInTree(content, "group")
		local description = SILE.findInTree(content, "description")
		local alphabet = SILE.findInTree(content, "alphabet")
		local requirements = SILE.findInTree(content, "requirements")
		local appearance = SILE.findInTree(content, "appearance")

		SILE.call("tal:language:name", {}, name)
		SILE.typesetter:typeset(" ")
		SILE.call("tal:language:native", {}, native)
		SILE.typesetter:typeset(" ")
		SILE.call("tal:language:group", {}, group)
		SILE.call("tal:language:description", {}, description)
		SILE.call("tal:language:alphabet", {}, alphabet)
		SILE.call("tal:language:requirements", {}, requirements)
		SILE.call("tal:language:appearance", {}, appearance)
		SILE.call("par")

		table.insert(SILE.scratch.tal.languages, {
			name = name[1],
			requirements = tal.shortRequirements(requirements[1]),
		})
	end)

	SILE.registerCommand("tal:skill", function(options, content)
		local name = SILE.findInTree(content, "name")
		local attribute = SILE.findInTree(content, "attribute")
		local description = SILE.findInTree(content, "description")
		local synergy = SILE.findInTree(content, "synergy")
		local bonus = SILE.findInTree(content, "bonus")
		local variants = SILE.findInTree(content, "variants")

		if options.type and not SILE.scratch.tal[options.type .. "skills"] then
			SU.error("Unknown skill type " .. options.type)
		end

		SILE.call("tal:skill:name", {}, name)
		SILE.call("tal:skill:attribute", {}, attribute)
		SILE.call("tal:skill:description", {}, description)
		if synergy then
			SILE.call("tal:skill:synergy", {}, synergy)
		end
		if bonus then
			SILE.call("tal:skill:bonus", {}, bonus)
		end
		SILE.call("par")

		if variants then
			for i, variant in ipairs(variants) do
				local variantName = SILE.findInTree(variant, "name")
				description = SILE.findInTree(variant, "description")
				synergy = SILE.findInTree(variant, "synergy")
				bonus = SILE.findInTree(variant, "bonus")

				SILE.call("tal:skill:name", {}, variantName)
				SILE.call("tal:skill:description", {}, description)
				if synergy then
					SILE.call("tal:skill:synergy", {}, synergy)
				end
				if bonus then
					SILE.call("tal:skill:bonus", {}, bonus)
				end
				SILE.call("par")

				if options.type then
					table.insert(SILE.scratch.tal[options.type .. "skills"], {
						name = name[1] .. " (" .. variantName[1] .. ")",
						attribute = attribute[1],
						synergy = synergy and synergy[1] or nil,
					})
				end
			end
		else
			if options.type then
				table.insert(SILE.scratch.tal[options.type .. "skills"], {
					name = name[1],
					attribute = attribute[1],
					synergy = synergy and synergy[1] or nil,
				})
			end
		end
	end)

	SILE.registerCommand("tal:feat", function(options, content)
		local name = SILE.findInTree(content, "name")
		local requirements = SILE.findInTree(content, "requirements")
		local description = SILE.findInTree(content, "description")
		local animal = SILE.findInTree(content, "animal")
		local action = SILE.findInTree(content, "action")
		local cost = SILE.findInTree(content, "cost")
		local profit = SILE.findInTree(content, "profit")
		local normal = SILE.findInTree(content, "normal")
		local special = SILE.findInTree(content, "special")

		if options.type and not SILE.scratch.tal[options.type .. "feats"] then
			SU.error("Unknown feats type " .. options.type)
		end

		SILE.call("tal:feat:name", {}, name)
		if requirements then
			SILE.call("tal:feat:requirements", {}, requirements)
		end
		if description then
			SILE.call("tal:feat:description", {}, description)
		end
		if profit then
			SILE.call("tal:feat:profit", {}, profit)
		end
		if special then
			SILE.call("tal:feat:special", {}, special)
		end
		if normal then
			SILE.call("tal:feat:normal", {}, normal)
		end
		if cost then
			SILE.call("tal:feat:cost", {}, cost)
		end
		if animal then
			SILE.call("tal:feat:animal", {}, animal)
		end
		if action then
			SILE.call("tal:feat:action", {}, action)
		end
		SILE.call("par")

		if options.type then
			table.insert(SILE.scratch.tal[options.type .. "feats"], {
				name = name[1],
				requirements = requirements and tal.shortRequirements(requirements[1]) or nil,
			})
		end
	end)

	SILE.registerCommand("tal:weapon", function(options, content)
		local name = SILE.findInTree(content, "name")
		local damage = SILE.findInTree(content, "damage")
		local weight = SILE.findInTree(content, "weight")
		local price = SILE.findInTree(content, "price")
		local traits = SILE.findInTree(content, "traits")

		SILE.call("tal:weapon:name", {}, name)
		if damage then
			SILE.call("tal:weapon:damage", {}, damage)
		end
		SILE.call("tal:weapon:weight", {}, weight)
		SILE.call("tal:weapon:price", {}, price)
		if traits then
			SILE.call("tal:weapon:traits", {}, traits)
		end
		SILE.call("par")
	end)

	SILE.registerCommand("tal:armor", function(options, content)
		local name = SILE.findInTree(content, "name")
		local armor = SILE.findInTree(content, "armor")
		local coverage = SILE.findInTree(content, "coverage")
		local weight = SILE.findInTree(content, "weight")
		local price = SILE.findInTree(content, "price")
		local traits = SILE.findInTree(content, "traits")
		local description = SILE.findInTree(content, "description")

		SILE.call("tal:armor:name", {}, name)
		if armor then
			SILE.call("tal:armor:armor", {}, armor)
		end
		if coverage then
			SILE.call("tal:armor:coverage", {}, coverage)
		end
		if weight then
			SILE.call("tal:armor:weight", {}, weight)
		end
		SILE.call("tal:armor:price", {}, price)
		if traits then
			SILE.call("tal:armor:traits", {}, traits)
		end
		SILE.call("tal:armor:description", {}, description)
		SILE.call("par")
	end)

	SILE.registerCommand("tal:material", function(options, content)
		local name = SILE.findInTree(content, "name")
		local description = SILE.findInTree(content, "description")
		local special = SILE.findInTree(content, "special")
		local armor = SILE.findInTree(content, "armor")
		local weight = SILE.findInTree(content, "weight")
		local price = SILE.findInTree(content, "price")
		local dc = SILE.findInTree(content, "dc")

		SILE.call("tal:material:name", {}, name)
		SILE.call("tal:material:description", {}, description)
		if special then
			SILE.call("tal:material:special", {}, special)
		end
		SILE.call("tal:material:armor", {}, armor)
		SILE.call("tal:material:weight", {}, weight)
		SILE.call("tal:material:price", {}, price)
		SILE.call("tal:material:dc", {}, dc)
		SILE.call("par")
	end)

	return v
end

tal.finish = function(self)
	local v = SILE.baseClass.finish(self)

	tal.writeData("extrafeats")
	tal.writeData("languages")
	tal.writeData("commonskills")
	tal.writeData("combatskills")
	tal.writeData("specialskills")
	tal.writeData("generalfeats")
	tal.writeData("innatefeats")

	return v
end

tal.shortRequirements = function(str)
	str = str:gsub("Atrybut: ", "A: ")
	str = str:gsub("Język: ", "J: ")
	str = str:gsub("Rasa: ", "R: ")
	str = str:gsub("Umiejętność: ", "U: ")
	str = str:gsub("Współczynnik: ", "W: ")
	str = str:gsub("Zdolność: ", "Z: ")

	str = str:gsub("Charyzma", "Ch")
	str = str:gsub("Inteligencja", "In")
	str = str:gsub("Kondycja", "Ko")
	str = str:gsub("Percepcja", "Pe")
	str = str:gsub("Refleks", "Re")
	str = str:gsub("Siła", "Si")
	str = str:gsub("Wola", "Wo")
	str = str:gsub("Zręczność", "Zr")

	return str
end

tal.writeData = function(dataType)
	if next(SILE.scratch.tal[dataType]) ~= nil then
		local file, fileError = io.open(SILE.masterFilename .. "." .. dataType .. ".dat", "w")

		if file then
			file:write("return " .. std.string.pickle(SILE.scratch.tal[dataType]))
		else
			return SU.error(fileError)
		end
	end
end

tal.readData = function(dataType)
	local file = io.open(SILE.masterFilename .. "." .. dataType .. ".dat")

	if file then
		return loadstring(file:read("*all"))()
	else
		SU.warn("No " .. dataType .. " data, additional pass needed!")

		return {}
	end
end

return tal