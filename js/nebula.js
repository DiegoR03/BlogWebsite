import * as THREE from 'three';

// Shooting Starts gemaakt met Gemini:
// Als de vallende sterren om de aarde heen moeten bewegen (of in ieder geval niet er recht op af moeten vliegen), moeten we de manier waarop ze spawnen en richten aanpassen. Op dit moment staat er lookAt(0, 0, 0), wat ervoor zorgt dat ze altijd precies naar het middelpunt vliegen. Om ze "langs" de aarde of in de ruimte eromheen te laten schieten, moeten we een offset (afwijking) toevoegen aan hun doelwit.
// dist (straal $r$): Hoe ver het punt van het midden staat. 
// phi ($\phi$): De hoek vanaf de bovenpool (noordpool) naar beneden.
// theta ($\theta$): De rotatie rondom de as (zoals de lengtegraden op de aarde).
class ShootingStar {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.active = false;

        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -150)
        ]);

        const material = new THREE.LineBasicMaterial({
            color: "#00ffcc",
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });

        this.mesh = new THREE.Line(geometry, material);
        this.scene.add(this.mesh);
    }

    spawn() {
        this.active = true;
        this.opacity = 0.7;
        this.mesh.visible = true;

        const distance = this.config.minDistance + Math.random() * 1500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const startPos = new THREE.Vector3(
            distance * Math.sin(phi) * Math.cos(theta),
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi)
        );
        this.mesh.position.copy(startPos);

        const offsetRange = 300;
        const target = new THREE.Vector3(
            (Math.random() - 0.5) * offsetRange,
            (Math.random() - 0.5) * offsetRange,
            (Math.random() - 0.5) * offsetRange
        );

        this.mesh.lookAt(target);
        this.speed = 10 + Math.random() * 10;
    }

    update() {
        if (!this.active) {
            if (Math.random() < 0.0005) this.spawn();
            return;
        }

        this.mesh.translateZ(this.speed);
        this.opacity -= 0.012;
        this.mesh.material.opacity = this.opacity;

        if (this.opacity <= 0) {
            this.active = false;
            this.mesh.visible = false;
        }
    }
}

// Met behulp van Gemini mijn 2D nebula code omgezet naar 3D code
export class NebulaBackground {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = {
            blobCount: config.blobCount || 50,
            colors: config.colors || ["#03041b", "#0a265f", "#00072e"],
            starCount: config.starCount || 6000,
            minDistance: 2000,
            maxDistance: 5500,
            ...config
        };
        this.shootingStars = [];
        this.init();
    }

    createPureTexture() {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        for (let horizontalDistance = 0; horizontalDistance < size; horizontalDistance++) {
            for (let verticalDistance = 0; verticalDistance < size; verticalDistance++) {
                const x = horizontalDistance - size / 2;
                const y = verticalDistance - size / 2;
                const distance = Math.sqrt(x * x + y * y);
                const strength = Math.max(0, 1 - distance / (size / 2));
                const alpha = Math.pow(strength, 3) * 255;

                const index = (horizontalDistance + verticalDistance * size) * 4;
                data[index] = 255; data[index + 1] = 255; data[index + 2] = 255;
                data[index + 3] = alpha;
            }
        }
        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
    }

    getRandomPos(min, max) {
        const dist = min + Math.random() * (max - min);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        return new THREE.Vector3(
            dist * Math.sin(phi) * Math.cos(theta),
            dist * Math.sin(phi) * Math.sin(theta),
            dist * Math.cos(phi)
        );
    }

    init() {
        const nebulaTexture = this.createPureTexture();

        for (let i = 0; i < this.config.blobCount; i++) {
            const material = new THREE.SpriteMaterial({
                map: nebulaTexture,
                color: new THREE.Color(this.config.colors[i % this.config.colors.length]),
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const sprite = new THREE.Sprite(material);
            sprite.position.copy(this.getRandomPos(this.config.minDistance, this.config.maxDistance));
            const s = 1600 + Math.random() * 2400;
            sprite.scale.set(s, s, 1);
            sprite.renderOrder = -1;
            this.scene.add(sprite);
        }

        const starGeo = new THREE.BufferGeometry();
        const starPos = [];
        for (let i = 0; i < this.config.starCount; i++) {
            const p = this.getRandomPos(this.config.minDistance + 1000, this.config.maxDistance);
            starPos.push(p.x, p.y, p.z);
        }

        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2.5,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            depthWrite: false
        });

        const starPoints = new THREE.Points(starGeo, starMat);
        starPoints.renderOrder = -2;
        this.scene.add(starPoints);

        for (let i = 0; i < 3; i++) {
            this.shootingStars.push(new ShootingStar(this.scene, this.config));
        }
    }

    update() {
        this.shootingStars.forEach(star => star.update());
    }
}