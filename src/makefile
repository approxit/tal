CC=sile
CFLAGS=-e "require 'utils/inputs-xml-flat'" -I tal

all: corebook

corebook: corebook/corebook.sil
	$(CC) $(CFLAGS) $<

.PHONY: all corebook clean 

clean:
	rm -f corebook/*.pdf corebook/*.toc