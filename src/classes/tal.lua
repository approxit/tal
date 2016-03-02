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

		SILE.call("tal:extrafeat:name", {}, {name[1]})
		SILE.call("tal:extrafeat:description", {}, {description[1]})
		if forbidden then
			SILE.call("tal:extrafeat:forbidden", {}, {forbidden[1]})
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

		SILE.call("tal:language:name", {}, {name[1]})
		SILE.typesetter:typeset(" ")
		SILE.call("tal:language:native", {}, {native[1]})
		SILE.typesetter:typeset(" ")
		SILE.call("tal:language:group", {}, {group[1]})
		SILE.call("tal:language:description", {}, {description[1]})
		SILE.call("tal:language:alphabet", {}, {alphabet[1]})
		SILE.call("tal:language:requirements", {}, {requirements[1]})
		SILE.call("tal:language:appearance", {}, {appearance[1]})
		SILE.call("par")

		table.insert(SILE.scratch.tal.languages, {
			name = name[1],
			requirements = requirements[1],
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

		SILE.call("tal:skill:name", {}, {name[1]})
		SILE.call("tal:skill:attribute", {}, {attribute[1]})
		SILE.call("tal:skill:description", {}, {description[1]})
		if synergy then
			SILE.call("tal:skill:synergy", {}, {synergy[1]})
		end
		if bonus then
			SILE.call("tal:skill:bonus", {}, {bonus[1]})
		end
		SILE.call("par")

		if variants then
			for i, variant in ipairs(variants) do
				local variantName = SILE.findInTree(variant, "name")
				description = SILE.findInTree(variant, "description")
				synergy = SILE.findInTree(variant, "synergy")
				bonus = SILE.findInTree(variant, "bonus")

				SILE.call("tal:skill:name", {}, {variantName[1]})
				SILE.call("tal:skill:description", {}, {description[1]})
				if synergy then
					SILE.call("tal:skill:synergy", {}, {synergy[1]})
				end
				if bonus then
					SILE.call("tal:skill:bonus", {}, {bonus[1]})
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

		SILE.call("tal:feat:name", {}, {name[1]})
		if requirements then
			SILE.call("tal:feat:requirements", {}, {requirements[1]})
		end
		if description then
			SILE.call("tal:feat:description", {}, {description[1]})
		end
		if profit then
			SILE.call("tal:feat:profit", {}, {profit[1]})
		end
		if special then
			SILE.call("tal:feat:special", {}, {special[1]})
		end
		if normal then
			SILE.call("tal:feat:normal", {}, {normal[1]})
		end
		if cost then
			SILE.call("tal:feat:cost", {}, {cost[1]})
		end
		if animal then
			SILE.call("tal:feat:animal", {}, {animal[1]})
		end
		if action then
			SILE.call("tal:feat:action", {}, {action[1]})
		end
		SILE.call("par")

		if options.type then
			table.insert(SILE.scratch.tal[options.type .. "feats"], {
				name = name[1],
				requirements = requirements and requirements[1] or nil,
			})
		end
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

tal.writeData = function(dataType)
	local file, fileError = io.open(SILE.masterFilename .. "." .. dataType .. ".dat", "w")

	if file then
		file:write("return " .. std.string.pickle(SILE.scratch.tal[dataType]))
	else
		return SU.error(fileError)
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