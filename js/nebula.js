// Met behulp van https://codepen.io/beejaymorgan/pen/rjPwmL

const Nebula_Config = {
    Blob_Count: 30,
    Color_1: "#03041b",
    Color_2: "#0d337e4d",
    Color_3: "#000000c4",
}

function createNebulaGradient() {
    let gradient_array = [];

    for (let i = 0; i < Nebula_Config.Blob_Count; i++) {
        const x = Math.round(Math.random() * 100);
        const y = Math.round(Math.random() * 100);
        const color =
            Math.random() < 0.33
                ? Nebula_Config.Color_1
                : Math.random() < 0.66
                    ? Nebula_Config.Color_2
                    : Nebula_Config.Color_3;
        const gradient = `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent 30%)`;

        // Push gebruikt om de gradient toe te voegen aan de array https://www.w3schools.com/js/js_const.asp
        gradient_array.push(gradient);
    }

    return gradient_array.join(",");
}

function applyNebula() {
    const nebulaGradient = createNebulaGradient();
    const sections = document.querySelectorAll("body");

    sections.forEach((section, index) => {
        if (section.id === "info") {
            return;
        }

        section.style.backgroundImage = nebulaGradient;
        section.style.backgroundAttachment = "fixed";
        section.style.transition = "background-image 0.5s ease";
    });
}

applyNebula();