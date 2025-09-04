BOOK_FILES = 00-titre.md 01-introduction.md 02-pourquoi-rag.md 03-comparaison-approches.md \
             04-principes-cles.md 05-architecture-detaillee.md 06-anatomie-pipeline.md \
             07-modularite-vs-frameworks.md 08-securite-gouvernance.md 09-extensions-pipeline.md \
             10-cas-usages.md 11-comparaison-alternatives.md 12-limites-defis.md \
             13-conclusion.md annexes.md

all: LIVRE_FULL.md LIVRE_FULL_pdf.pdf

LIVRE_FULL.md: $(BOOK_FILES)
	cat $(BOOK_FILES) > LIVRE_FULL.md

LIVRE_FULL_pdf.pdf: $(BOOK_FILES)
	pandoc $(BOOK_FILES) -s -o LIVRE_FULL_pdf.pdf

