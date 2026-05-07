async function loadNerds() {
    try {
        const response = await fetch('assets/api/info.json');
        
        const data = await response.json();

        const container = document.getElementById('weekly-nerd-container');

        data.topic.forEach(nerd => {
            const nerdHtml = `
                <article class="nerd-card">
                    <h2>${nerd.eventTitle}</h2>
                    <p><em>${nerd.speaker} - ${nerd.date}</em></p>
                    
                    <div class="content">
                    <h3>Content</h3>
                        ${(nerd.infos ?? []).map(info => `
                            <h4>${info.title}</h4>
                            <p>${info.content}</p>
                        `).join('')}
                    </div>

                    <div class="tips">
                    <h3>Tips</h3>
                        ${(nerd.cssTips?? []).map(tips => `
                            <h4>Element voorbeeld: ${tips.selector}</h4>
                            <p>${tips.note}</p>
                        `).join('')}
                    </div>

                    <div class="examples">
                    <h3>Code voorbeelden</h3>
                        ${(nerd.codeExamples ?? []).map(example => `
                            <h4>Code taal: ${example.language}</h4>
                            <p>${example.code}</p>
                        `).join('')}
                    </div>
                </article>
                <hr>
            `;
            container.insertAdjacentHTML('beforeend', nerdHtml);
        });

    } catch (error) {
        console.error("Oeps, er ging iets mis met het laden van de data:", error);
    }
}

loadNerds();