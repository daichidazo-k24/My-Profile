const fishImages = Array.from({ length: 30 }, (_, index) => ({
    src: `image/fish${index + 1}.jpg`,
    alt: `釣果写真 ${index + 1}`
}));

const gallery = document.getElementById("fishGallery");
const imageDialog = document.getElementById("imageDialog");
const dialogImage = document.getElementById("dialogImage");

if (gallery && imageDialog && dialogImage) {
    fishImages.forEach((fish) => {
        const button = document.createElement("button");
        const image = document.createElement("img");

        button.className = "gallery-item";
        button.type = "button";
        button.setAttribute("aria-label", `${fish.alt}を拡大表示`);

        image.className = "fish-img";
        image.src = fish.src;
        image.alt = fish.alt;
        image.loading = "lazy";

        button.appendChild(image);
        button.addEventListener("click", () => {
            dialogImage.src = fish.src;
            dialogImage.alt = `${fish.alt}の拡大表示`;
            imageDialog.showModal();
        });
        gallery.appendChild(button);
    });

    imageDialog.addEventListener("click", (event) => {
        if (event.target === imageDialog) imageDialog.close();
    });

    imageDialog.addEventListener("close", () => {
        dialogImage.src = "";
        dialogImage.alt = "";
    });
}
