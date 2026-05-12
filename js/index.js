let jsonData = null;
let flatData = []; 

// Bron: https://www.w3schools.com/tags/av_prop_volume.asp
let vid = document.getElementById("backgroundMusic");
vid.volume = 0.3;

async function loadInfo() {
    try {
        const response = await fetch('../assets/api/info.json');
        const data = await response.json();
        jsonData = data; 

        flatData = [];
        for (const category in data.events) {
        data.events[category].forEach((item) => {
            item.category = category; 
            flatData.push(item);

            if (category !== "Meesterproef") {
                if (typeof satelliteModel !== 'undefined' && satelliteModel !== null) {
                    createSatelliteInstance();
                } else {
                    window.pendingSatellites = (window.pendingSatellites || 0) + 1;
                }
            }
        });
    }
    } catch (error) {
        console.error("Fout bij het laden van de JSON:", error);
    }
}

window.filterByEvent = (selectedEvent) => {
    const selectorContainer = document.getElementById('selector-list');
    const titleSelector = document.getElementById('titleSelector');
    const selectorWrapper = document.getElementById('selector-container');

    if (!selectorContainer) return;
    selectorContainer.innerHTML = '';

    const backBtn = `
        <li>
            <button onclick="resetFocus()">
                <strong>← Terug naar alle categorieën</strong>
            </button>
        </li>
    `;
    selectorContainer.insertAdjacentHTML('beforeend', backBtn);

    flatData.forEach((nerd, originalIndex) => {
        if (nerd.category === selectedEvent) {
            const selectorList = `
                <li>
                    <button onclick="handleSatelliteClick(${originalIndex})">
                        <h2>${nerd.eventTitle}</h2>
                        <p><em>${nerd.speaker} - ${nerd.date}</em></p>
                    </button>    
                </li>
            `;
            selectorContainer.insertAdjacentHTML('beforeend', selectorList);
        }
    });

    if (titleSelector) titleSelector.style.display = 'none';
    if (selectorWrapper) selectorWrapper.style.display = 'block';
};

window.handleSatelliteClick = (index) => {
    const info = flatData[index];
    if (!info) return;

    window.focusOnSatellite(index);
    
    const selectorContainer = document.getElementById('selector-container');
    const detailsContainer = document.getElementById('details-container');
    const detailsContent = document.getElementById('details-content');

    const infosHTML = info.infos.map(item => `
        <div class="info-block">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
        </div>
    `).join('');

    const codeTipsHTML = info.codeTips ? info.codeTips.map(tip => `
        <li><code>${tip.selector}</code>: ${tip.note}</li>
    `).join('') : '';

    const codeExamplesHTML = info.codeExamples ? info.codeExamples.map(code => `
        <div class="code-block">
            <span class="language-label">${code.language}</span>
            <pre><code>${code.code}</code></pre>
        </div>
    `).join('') : '';

    const websiteLinksHTML = info.websites ? info.websites.map(website => {
        const url = website.websiteLink.startsWith('http') 
                    ? website.websiteLink 
                    : `https://${website.websiteLink}`;

        return `
            <div class="website-block">
                <a href="${url}" target="_blank"">${website.websiteLink}</a>
                <p>${website.websiteInfo}</p>
            </div>
        `;
    }).join('') : '';

    detailsContent.innerHTML = `
        <h2>${info.eventTitle}</h2>
        <h3>Spreker: ${info.speaker}</h3>
        <h3>Datum: ${info.date}</h3>
        
        <section class="infos-section">
            ${infosHTML}
        </section>

        ${codeTipsHTML ? `
            <h3>Code Tips:</h3>
            <ul>${codeTipsHTML}</ul>
        ` : ''}

        ${codeExamplesHTML ? `
            <h3>Code voorbeelden:</h3>
            ${codeExamplesHTML}
        ` : ''}

        ${websiteLinksHTML ? `
            <h3>Website Links:</h3>
            ${websiteLinksHTML}
        ` : ''}
    `;

    if (selectorContainer) selectorContainer.style.display = 'none';
    if (detailsContainer) detailsContainer.style.display = 'block';
};

window.handleMoonClick = (index) => {
    const info = flatData[index];
    if (!info) return;

    window.focusOnSatellite(index);
    
    const selectorContainer = document.getElementById('selector-container');
    const detailsContainer = document.getElementById('details-container');
    const detailsContent = document.getElementById('details-content');

    const infosHTML = info.infos.map(item => `
        <div class="info-block">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
        </div>
    `).join('');

    const codeTipsHTML = info.codeTips ? info.codeTips.map(tip => `
        <li><code>${tip.selector}</code>: ${tip.note}</li>
    `).join('') : '';

    const codeExamplesHTML = info.codeExamples ? info.codeExamples.map(code => `
        <div class="code-block">
            <span class="language-label">${code.language}</span>
            <pre><code>${code.code}</code></pre>
        </div>
    `).join('') : '';

    detailsContent.innerHTML = `
        <h2>${info.eventTitle}</h2>
        <h3>Spreker: ${info.speaker}</h3>
        <h3>Datum: ${info.date}</h3>
        
        <section class="infos-section">
            ${infosHTML}
        </section>

        ${codeTipsHTML ? `
            <h3>Code Tips:</h3>
            <ul>${codeTipsHTML}</ul>
        ` : ''}

        ${codeExamplesHTML ? `
            <h3>Code voorbeelden:</h3>
            ${codeExamplesHTML}
        ` : ''}
    `;

    if (selectorContainer) selectorContainer.style.display = 'none';
    if (detailsContainer) detailsContainer.style.display = 'block';
};

window.resetFocus = () => {
    if (typeof window.focusOnSatellite === 'function') {
        window.focusOnSatellite(-1);
    }
    document.getElementById('titleSelector').style.display = 'flex';
    document.getElementById('selector-container').style.display = 'none';
    document.getElementById('details-container').style.display = 'none';
};

loadInfo();