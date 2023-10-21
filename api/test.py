from PIL import Image
# "D:\\WULI_HashLips\\WULI_NFT_PSD\\SWORD"
# Open the two input images
image_A = Image.open("D:\\WULI_HashLips\\HashLipsArtEngine\\Wuli_hashLips\\layers\\Shield\\SHIELD_Cat_2#100.png")
image_B = Image.open("D:\\WULI_HashLips\\HashLipsArtEngine\\Wuli_hashLips\\layers\\Head\\HEAD_ICE#150.png")

# Ensure the images have an alpha (transparency) channel
image_A = image_A.convert("RGBA")
image_B = image_B.convert("RGBA")

# Get the size of image A
width, height = image_A.size

# Create a new blank image (image_C) with the same size
image_C = Image.new("RGBA", (width, height))

# Composite image A on top of image B
image_C = Image.alpha_composite(image_B, image_A)

# Save the resulting image as C
image_C.save("imageC.png")

print("Images A and B have been overlaid, and the result is saved as imageC.png.")
