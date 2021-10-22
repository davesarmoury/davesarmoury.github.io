# Dave's Armoury Website

## Notes for Dave

### Static Local Hosting/Testing
    npx servor .

### Image Resizing
    convert '*.jpg[480x]' -set filename:base "%[basename]" "smaller/%[filename:base].jpg"

### Logo Resizing
    convert '*.png'  -background none -resize 460x260  -gravity center -extent 460x260 -set filename:base "%[basename]" "smaller/%[filename:base].png"
