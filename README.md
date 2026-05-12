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
 Bij de eerste iteratie heb ik een start gemaakt aan het maken van mijn blog website, en ik moet toegeven dat ik echt niet had verwacht dat ik zo ver zou komen als da tik ben gekomen. Ik heb al meteen een renderer kunnen maken voor de 3D objecten en heb zelfs al de JSON objecten kunnen verwerken naar buttons. Ik ben voornamelijk bezig geweest met het verwerken, toepassen en troevoegen van de 3D objecten naar logische blog elementen. Ik zal elk detial een beetje uitleggen:
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


## Bronnen
- Aarde : https://sketchfab.com/3d-models/earth-5f9c35be31a047928eace8b415a8ee3a#download
- Satteliet : https://sketchfab.com/3d-models/simple-satellite-low-poly-free-f23b484cda664f1cb91b4f62ea5ef8bf
- Maan : https://sketchfab.com/3d-models/moon-2b66072c7bbf47639535dd30b5e65106
- Three.js : https://threejs.org/docs/

