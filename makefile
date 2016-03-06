CC=sile
CFLAGS=-e "require 'utils/inputs-xml-flat'" -I tal

all: corebook equipment

corebook: corebook/corebook.sil
	$(CC) $(CFLAGS) $<

equipment: equipment/equipment.sil
	$(CC) $(CFLAGS) $<

.PHONY: all corebook equipment clean 

clean:
	rm -f corebook/*.pdf corebook/*.toc corebook/*.dat equipment/*.pdf equipment/*.toc corebook/*.dat