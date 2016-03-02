local tal = SILE.baseClass {id = "tal"}

tal:declareFrame("content", {left = "1cm", right = "100% - 1cm", top = "1cm", bottom = "100% - 1cm"})
tal.pageTemplate.firstContentFrame = tal.pageTemplate.frames["content"]

SILE.scratch.tal = {
	extrafeats = {},
	languages = {},
	commonskills = {},
	combatskills = {},
	specialskills = {},
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
		SU.required(options, "type", "tal:skill")

		local name = SILE.findInTree(content, "name")
		local attribute = SILE.findInTree(content, "attribute")
		local description = SILE.findInTree(content, "description")
		local synergy = SILE.findInTree(content, "synergy")
		local bonus = SILE.findInTree(content, "bonus")
		local variants = SILE.findInTree(content, "variants")

		if not SILE.scratch.tal[options.type .. "skills"] then
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

				table.insert(SILE.scratch.tal[options.type .. "skills"], {
					name = name[1] .. " (" .. variantName[1] .. ")",
					attribute = attribute[1],
					synergy = synergy and synergy[1] or nil,
				})
			end
		else
			table.insert(SILE.scratch.tal[options.type .. "skills"], {
				name = name[1],
				attribute = attribute[1],
				synergy = synergy and synergy[1] or nil,
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