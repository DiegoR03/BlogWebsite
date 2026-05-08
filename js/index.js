let jsonData = null;

async function loadInfo() {
    try {
        const response = await fetch('assets/api/info.json');
        const data = await response.json();
        jsonData = data; 

        const selectorContainer = document.getElementById('selector-list');

        data.topic.forEach((nerd, index) => {
            const selectorList = `
                <li>
                    <!-- VERANDERD: handleSatelliteClick in plaats van focusOnSatellite -->
                    <button onclick="handleSatelliteClick(${index})">
                        <h2>Satelliet ${index + 1}</h2>
                        <h2>${nerd.eventTitle}</h2>
                        <p><em>${nerd.speaker} - ${nerd.date}</em></p>
                    </button>    
                </li>
            `;
            selectorContainer.insertAdjacentHTML('beforeend', selectorList);

            if (typeof satelliteModel !== 'undefined' && satelliteModel !== null) {
                createSatelliteInstance();
            } else {
                window.pendingSatellites = (window.pendingSatellites || 0) + 1;
            }
        });
    } catch (error) {
        console.error("Fout bij het laden van de JSON:", error);
    }
}

window.filterByEvent = (selectedEvent) => {
    const selectorContainer = document.getElementById('selector-list');
    const titleSelector = document.getElementById('titleSelector');
    const selectorWrapper = document.getElementById('selector-container');

    selectorContainer.innerHTML = '';

    if (!jsonData) return;

    const backBtn = `
        <li style="list-style: none; margin-bottom: 20px;">
            <button onclick="resetFocus()" style="background: #444; color: white;">
                <strong>← Terug naar alle categorieën</strong>
            </button>
        </li>
    `;
    selectorContainer.insertAdjacentHTML('beforeend', backBtn);

    jsonData.topic.forEach((nerd, originalIndex) => {
        if (nerd.event === selectedEvent) {
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

    titleSelector.style.display = 'none';
    selectorWrapper.style.display = 'block';
};

window.handleSatelliteClick = (index) => {
    window.focusOnSatellite(index);
    
    const selectorContainer = document.getElementById('selector-container');
    const detailsContainer = document.getElementById('details-container');
    const detailsContent = document.getElementById('details-content');
    
    if (!jsonData) {
        console.error("JSON data is nog niet geladen!");
        return;
    }

    const info = jsonData.topic[index];

    const infosHTML = info.infos.map(item => `
        <div class="info-block">
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        </div>
    `).join('');

    const cssTipsHTML = info.cssTips ? info.cssTips.map(tip => `
        <code>${tip.selector}</code>
        <p>: ${tip.note}<p>
    `).join('') : '';

    const codeExamples = info.codeExamples ? info.codeExamples.map(code => `
        <div class="code-block">
            <span class="language-label">${code.language}</span>
            <pre><code>${code.code}</code></pre>
        </div>
    `).join('') : '';
    
    if (selectorContainer) selectorContainer.style.display = 'none';
    
    detailsContent.innerHTML = `
        <h2>${info.eventTitle}</h2>
        <h3>Spreker: ${info.speaker}</h3>
        <h3>Datum: ${info.date}</h3>
        <hr>
        
        <section class="infos-section">
            ${infosHTML}
        </section>

        ${cssTipsHTML ? `
            <hr>
            <h3>CSS Tips:</h3>
            <ul>${cssTipsHTML}</ul>
        ` : ''}

        ${codeExamples ? `
            <hr>
            <h3>Code examples:</h3>
            <ul>${codeExamples}</ul>
        ` : ''}
    `;
    
    if (detailsContainer) detailsContainer.style.display = 'block';
};

window.resetFocus = () => {
    if (typeof window.focusOnSatellite === 'function') {
        window.focusOnSatellite(-1);
    }
    
    const titleSelector = document.getElementById('titleSelector');
    const selectorWrapper = document.getElementById('selector-container');
    const detailsContainer = document.getElementById('details-container');

    if (titleSelector) titleSelector.style.display = 'flex';
    if (selectorWrapper) selectorWrapper.style.display = 'none';
    if (detailsContainer) detailsContainer.style.display = 'none';
};

loadInfo();