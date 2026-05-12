# Meesterschap

## Plan 
Ik wil voor mijn website hetzelfde thema gebruiken als de eerste introductie website, de ruimte, maar omdat we nu een blog website moeten maken heb ik lang moeten nadenken over hoe ik de ruimte als onderwerp wil toepassen zonder het herhalend te maken van de eerste website. Ik wil graag mijn kennis van hetr afgelopen blok toepassen zodat ik een website kan bouwen waar ik echt heel trots op ben! Om dit te doen heb ik lang lopen brainstormen en ben ik op een idee gekomen: <br>
<br>
Mijn idee is om een combinatie te maken van informatie en 3D modellen > Ik wil een 3D model van de aarde gebruiken en hier sattelieten om heen laten draaien, elke satteliet heeft dan een eigen informatie bron. Di tkan dan een weekly nerd zijn, of juist een vak, of iets heel anders. Zo kan ik ook meer spelen met verschillende 3D modellen maar ook verschillende details. <br><br>

## Visualisatie plan
Ik heb een paar verschillende pagina's in gedachte, of secties in dit geval: <br><br>

// Algemene/landings pagina
<img width="1920" height="1080" alt="Frame 1" src="https://github.com/user-attachments/assets/59bda339-8ffe-4dd1-acbd-1d6477c8dcee" />
<br><br>
// Informatie pagina (elk onderwerp)
<img width="1920" height="1080" alt="Frame 2" src="https://github.com/user-attachments/assets/9f73e6b5-6874-4b72-ab35-490938818745" />
<br><br>
// Meesterproef informatie pagina 
<img width="1920" height="1080" alt="Frame 3" src="https://github.com/user-attachments/assets/6b02ab24-1be8-4708-ab57-771001161f8c" />

## Iteratie 1
- Start gemaakt an 3d rendering
- 3d modellen toegevoegd
- informatie (deels) uitgeschreven en toegevoegd
- functie gemaakt om dynamisch satellieten toe te voegen (nog niet perfect)

 ### Uitleg
 Bij de eerste iteratie heb ik een start gemaakt aan het maken van mijn blog website, en ik moet toegeven dat ik echt niet had verwacht dat ik zo ver zou komen als dat ik ben gekomen. Ik heb al meteen een renderer kunnen maken voor de 3D objecten en heb zelfs al de JSON objecten kunnen verwerken naar buttons. Ik ben voornamelijk bezig geweest met het verwerken, toepassen en troevoegen van de 3D objecten naar logische blog elementen. Ik zal elk detial een beetje uitleggen:
 <br><br>
 Als eerste heb ik gewerkt aan het renderen van de 3D objecten, dit heb ik gedaan door middel van `Three.js`. Three.js kan je importeren als `import * as THREE from 'three';` in de code, en vanuit daar kan je addons toevoegen zoals `GLTFLoader` en `OrbitControls`. Door deze code te combineren de `WebGLRenderer` van Three.js wist ik een 3D object te renderen binnen de website, het eerst object dat ik wist te renderen was de aarde (earth.gbl): <br>
<img width="622" height="572" alt="31328da0e246b8e8fc089367026aa51d-ezgif com-optimize (1)" src="https://github.com/user-attachments/assets/65a1ccbd-370a-44f1-ba3a-696bb26b88d0" />

<br>
Daarna heb ik andere objecten toegevoegd zoals de satellite.glb en de moon.glb, maar ik heb met deze objecten nog niet veel gedaan naast het in renderen en het resizen van deze objecten.
<br>
Ik ben ook bezig geweest met het verwerken van de JSON informatie naar HTML objecten, op dit moment heb ik al verschillende informatie van javscript naar HTML kunnen vertralen: <br><br>

``` 
async function loadInfo() {
    try {
        const response = await fetch('assets/api/info.json')
        const data = await response.json();

        const container = document.getElementById('weekly-nerd-container');

        const selectorContainer = document.getElementById('selector-list');

        data.topic.forEach((nerd, index) => {
            const selectorList = `
                <li>
                    <h2>Satteliet ${index + 1}</h2>
                    <h2>${nerd.eventTitle}</h2>
                    <p><em>${nerd.speaker} - ${nerd.date}</em></p>
                </li>
            `

            selectorContainer.insertAdjacentHTML('beforeend', selectorList);
        });

    } catch (error) {
        console.error("Oeps, er ging iets mis met het laden van de data:", error);
    }
}

loadInfo();
``` 
<br>
Op dit moment wordt dit op de website laten zien als een simpele lijst, maar uiteindelijk wil ik hier focus buttons van maken zodat je de satteliet volgt en de informatie per satteliet ziet: <br>
<img width="432" height="918" alt="image" src="https://github.com/user-attachments/assets/92cb6859-61bc-425d-a850-a3aabcce48a3" />

## Iteratie 2
- Zon toegevoegd
- Navigation toegevoegd (en verbeterd)
- Informatie per satteliet verbeterd en meer toegevoegd
- Als je op informatie klikt krijg je een close up van de relatieve satelliet

### Uitleg
De tweede iteratie ging voornamelijk naar het verbeteren van de 3D omgeving, de ruimte wat natuurlijker laten voelen, de zon toevoegen en de informatie dadwerkelijk tonen. De eerste iteratie voelde nog best leeg aan als het gaat om informatie, dus heb ik hier hard gewerkt om deze informatie op een creatieve manier te tonen. Ik heb ervoor gekozen om met javascript voor elk JSON element een aparte satelliet te maken zodat elke informatie bron aan kan worden getoont met zijn eigen satelliet:
```
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
```
<br><br> 
Elke satelliet heeft dezelfde indeling, maar met andere informatie, zo kan ik het makkelijker dynamisch instellen en kan ik meer satellieten toevoegen indien nodig is. natuurlijk moest ik alle informatie wel apart indelen, ik heb een navigatie bar toegevoegd met elk zijn eigen onderwerp. Onderandere: <br><br>
- Weekly Nerds
- Sprint 0
- Hackaton
- Weekly Geek
- Andere vakken
- Meesterproef
- Check outs

<br><br>
Hoewel deze keuzes nog niet definitief zijn, geeft mij dit wel een soort structuur waar ik rekening mee moet houden qua informatie verwerken en toevoegen. Dit filteren tussen evenementen doe ik met de volgende code:
```
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

```
<img width="1869" height="150" alt="image" src="https://github.com/user-attachments/assets/fca8acd1-2081-486f-a3f0-131076d29e2e" />
<img width="683" height="915" alt="image" src="https://github.com/user-attachments/assets/b717a79e-cc2e-4a50-ab85-a15ac70d1331" />

<br><br>
Per satelliet heb ik de informatie ook veel meer verbeterd, ik heb alle informatie (zoals aangegeven in iteratie 1) verwerkt in een JSON file, hoewel deze file nog niet perfect is ingedeeld of aangevuld, werkt het wel in combinatie met het toevoegen van 3D modellen. Op dit moment heb ik mij voornamelijk gefocust op het verwerken van Weekly nerds, hier heb ik namelijk de informatie al van klaar staan, de indeling ziet er als volgt uit: 50% van de viewport gaat naar het showcasen van de baan van de satelliet, de andere 50% kan je de informatie weergeven en lezen (ook scrollen ja):
<img width="1850" height="918" alt="image" src="https://github.com/user-attachments/assets/be46bec2-c4b8-44ca-8f76-ec9d47a0569b" />
<br><br>
Dit doe ik allemaal met de `window.handleSatelliteClick` functie in de `index.js`. Hiermee genereer ik de benodige HTML elementen en ladt ik tegelijkertijd de informatie in uit de JSON file: 
```
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
```

<br><br>
Als laatste heb ik mij gefocust op het verbeteren van de ruimte omgeving, voornamelijk de zon toevoege. DIt heeft mij flink wat moeite gekost. Mijn eerste tests waren met een 3D zon werken, maar dit zag er onatuurlijk uit en gaf geen ruimte gevoel, het enige wat je zag was een gele 3D wereld, maar verder geen licht bron of iets anders, ondanks het feit dat ik wel een lichtbron in de ruimte zelf heb toegevoegd. Daarna ben ik (op basis van de aanrader van Gemini) verder gaan werken met het toevoegen van een 2D zon, deze 2D zon kan ik ook in de ruimte plaatsen, maar het geeft een vele natuurlijker gevoel. Hoewel het een PNG is, kan ik de afstand van de aarde, en de positie van het zonlicht amen combineren tot 1 licht bron:
```
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
const sunLight = new THREE.DirectionalLight(0xffffff, 8);
const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load('assets/img/lensflare0.png');
const textureFlare1 = textureLoader.load('assets/img/lensflare1.png');
const lensflare = new Lensflare();

loader.load('/assets/models/earth.glb', function (gltf) {
    earthModel = gltf.scene;
    
    sunLight.position.set(500, 100, 500);
    camera.position.set(0, 100, 250);

    scene.add(sunLight, ambientLight, moonPivot, earthModel);

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 60, 0.6, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 0.7, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 120, 0.9, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 1, sunLight.color, THREE.AdditiveBlending));

    sunLight.add(lensflare);
});
```
<br><br>
In combinatie met de sunflare e de andere lensflares heb ik uiteindelijk een relatief realistische zon kunnen maken die ook de lichtbron aanhoudt als positie:
<img width="1864" height="910" alt="image" src="https://github.com/user-attachments/assets/0d81364f-02a2-4d78-9aa2-b345749d59e4" />

### Doelen voor volgende iteratie
- Ruimte meer realistisch maken (bijvoorbeeld 3D sterren of andere objecten)
- Meer Satellieten toevoegen
- (optioneel) muziek of een loading screen, op de start van de website zie je een paar seconden niets
- Meesterproef linken aan de maan

## Bronnen
- Aarde : https://sketchfab.com/3d-models/earth-5f9c35be31a047928eace8b415a8ee3a#download
- Satteliet : https://sketchfab.com/3d-models/simple-satellite-low-poly-free-f23b484cda664f1cb91b4f62ea5ef8bf
- Maan : https://sketchfab.com/3d-models/moon-2b66072c7bbf47639535dd30b5e65106
- Three.js : https://threejs.org/docs/

