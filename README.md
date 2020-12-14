# Dave's Armoury Website

## Notes for Dave

### Static Local Hosting/Testing
    npx servor .

### Image Resizing
    convert '*.jpg[480x]' -set filename:base "%[basename]" "smaller/%[filename:base].jpg"
