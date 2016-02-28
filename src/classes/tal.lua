local tal = SILE.baseClass {id = "tal"}

tal:declareFrame("content", {left = "1cm", right = "100% - 1cm", top = "1cm", bottom = "100% - 1cm"})
tal.pageTemplate.firstContentFrame = tal.pageTemplate.frames["content"]

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

	return v
end

return tal