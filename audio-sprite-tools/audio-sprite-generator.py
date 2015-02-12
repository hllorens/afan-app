#!/usr/bin/python

silenceDuration = 1.0  # Seconds of silence between merged files (and at the beginning and end)
outfile = "soundsSprite.wav"  # Output file. Will be saved in the path below.
folder = "/home/hector/Desktop/audio-all-files-and-sprite-scripts/audio-treated/"

# Prepare...
import wave, os, glob
os.chdir(folder)
currentTime = 0
sprite = {}

# Open output file
output = wave.open(outfile, 'wb')

# Loop through files in folder and append to outfile
for i, infile in enumerate(glob.glob('*.wav')):
    # Skip the outfile itself
    if infile == outfile: continue

    # Open file and get info
    w = wave.open(folder + infile, 'rb')
    soundDuration = w.getnframes() / float(w.getframerate())

    # First file: determine general parameters- Create silence.
    if i == 0:
        output.setparams(w.getparams())
        silenceData = [0] * int(w.getframerate() * 2 * silenceDuration)  # N 0's where N are the num samples of "silenceDuration" duration
        silenceFrames = "".join(wave.struct.pack('h', item) for item in silenceData)
	output.writeframes(silenceFrames)
        currentTime += silenceDuration

    # Output sound + silence to file
    output.writeframes(w.readframes(w.getnframes()))
    output.writeframes(silenceFrames)
    w.close()

    # Create sprite metadata {'mysound.wav': [start_secs, end_secs]}. Then increment current time
    start = round(currentTime, 3)
    end = round(currentTime + soundDuration, 3)
    sprite[infile[:-4]] = [start, end]
    currentTime += soundDuration + silenceDuration

# Yay, the worst is behind us. Close output file
output.close()

# Output in the required format. Here for jquery.mb.audio
for filename, times in sprite.items():
    print '%s: {id: "%s", start: %.3f, end: %.3f}, ' % (filename, filename, times[0], times[1]) # loop: false
print 'zsilence_start: {id: "zsilence_start", start: 0.100, end: 0.700}, ' # add zsilence_start

