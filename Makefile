FFMPEG = ffmpeg
FLAC_FILES = $(wildcard public/audio/*.flac)
M4A_FILES = $(patsubst %.flac,%.m4a,$(FLAC_FILES))
OGG_FILES = $(patsubst %.flac,%.ogg,$(FLAC_FILES))


%.flac: %.wav
	afconvert $< -f flac $@

%.m4a: %.flac
	afconvert $< -d aac -f m4af --soundcheck-generate -b 160000 -s 2 $@

%.ogg: %.flac
	$(FFMPEG) -v 0 -y -i $< -c:a libvorbis -aq 5 $@

.PHONY: all audio dist

audio: $(M4A_FILES) $(OGG_FILES)

dist:
	npm run build

all: dist audio
