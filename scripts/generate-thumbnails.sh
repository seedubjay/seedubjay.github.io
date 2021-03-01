for file in $@; do
    output="${file%.*}-thumbnail.${file##*.}"
    convert "$file" -resize 240 $output
    echo "$file -> $output"
done