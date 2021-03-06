chunk_starts=(0 640 896 1152 1408 1920)

files=""

for (( i=1; i <= "$#"; i++ )); do
    f=${!i}
    s=${chunk_starts[$((i-1))]}
    e=${chunk_starts[i]}
    width=$((e-s))
    echo $f $s $width
    convert "$f" -scale 1920 "temp-$f"
    convert "temp-$f" -crop "$width"x1280+"$s"+0 +repage "temp-$f"
    files="$files temp-$f"
done

convert $files +append out.png
rm $files
