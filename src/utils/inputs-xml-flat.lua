local lxp = require "lxp"

local function starttag(p, tag, attr)
	local stack = p:getcallbacks().stack
	local l, c, pos = p:pos()
	local newelement = {tag = tag, attr = attr, line = l, col = c}
	table.insert(stack, newelement)
end

local function endtag(p, tag)
	local stack = p:getcallbacks().stack
	local element = table.remove(stack)
	assert(element.tag == tag)
	local level = #stack
	table.insert(stack[level], element)
end

local function text(p, txt)
	txt = txt:gsub("^\t*(.-)\t*$", "%1")
	txt = txt:gsub("\t+", " ")

	if txt ~= "" then
		local stack = p:getcallbacks().stack
		local element = stack[#stack]
		local n = #element
		if type(element[n]) == "string" then
			element[n] = element[n] .. txt
		else
			table.insert(element, txt)
		end
	end
end

local function parse(o)
	local c = {
		StartElement = starttag,
		EndElement = endtag,
		CharacterData = text,
		_nonstrict = true,
		stack = {{}}
	}
	local p = lxp.new(c)
	local status, err
	if type(o) == "string" then
		status, err = p:parse(o)
		if not status then return nil, err end
	else
		for l in pairs(o) do
			status, err = p:parse(l)
			if not status then return nil, err end
		end
	end
	status, err = p:parse()
	if not status then return nil, err end
	p:close()
	return c.stack[1][1]
end

SILE.inputs.XML.process = function(fn)
	local fh = io.open(fn)
	local t = parse(fh:read("*all"))
	local root = (SILE.documentState.documentClass == nil)

	if root then
		if not(t.tag == "sile") then
			SU.error("This isn't a SILE document!")
		end
		SILE.inputs.common.init(fn, t)
	end

	SILE.process(t)

	if root and not SILE.preamble then
		SILE.documentState.documentClass:finish()
	end
end