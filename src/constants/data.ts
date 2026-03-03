export interface CelestialBody {
  id: string;
  name: string;
  radius: number;
  distanceFromSun: number;
  orbitSpeed: number;
  rotationSpeed: number;
  textureUrl: string | null;
  normalMapUrl?: string | null;
  roughnessMapUrl?: string | null;
  color: string;
  type: "star" | "planet" | "moon" | "dwarf";
  mass: number;
  moons?: CelestialBody[];
}

export const celestialData: CelestialBody[] = [
  {
    id: "sun",
    name: "Sun (Sol)",
    radius: 12,
    distanceFromSun: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
    textureUrl: null, // We'll render this procedurally or with emissive color
    color: "#FDB813",
    type: "star",
    mass: 1000,
  },
  {
    id: "mercury",
    name: "Mercury",
    radius: 0.8,
    distanceFromSun: 25,
    orbitSpeed: 0.04,
    rotationSpeed: 0.01,
    textureUrl:
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg",
    color: "#8c8c8c",
    type: "planet",
    mass: 10,
  },
  {
    id: "venus",
    name: "Venus",
    radius: 1.8,
    distanceFromSun: 35,
    orbitSpeed: 0.03,
    rotationSpeed: -0.005,
    textureUrl: null,
    color: "#e6c88e",
    type: "planet",
    mass: 20,
  },
  {
    id: "earth",
    name: "Earth",
    radius: 2,
    distanceFromSun: 50,
    orbitSpeed: 0.02,
    rotationSpeed: 0.02,
    textureUrl:
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
    normalMapUrl:
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
    roughnessMapUrl:
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
    color: "#2b82c9",
    type: "planet",
    mass: 25,
    moons: [
      {
        id: "moon",
        name: "Moon",
        radius: 0.5,
        distanceFromSun: 4,
        orbitSpeed: 0.08,
        rotationSpeed: 0.02,
        textureUrl:
          "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg",
        color: "#d9d9d9",
        type: "moon",
        mass: 2,
      },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    radius: 1.2,
    distanceFromSun: 70,
    orbitSpeed: 0.016,
    rotationSpeed: 0.02,
    textureUrl: null,
    color: "#c1440e",
    type: "planet",
    mass: 15,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radius: 7,
    distanceFromSun: 120,
    orbitSpeed: 0.008,
    rotationSpeed: 0.05,
    textureUrl: null,
    color: "#c9966b",
    type: "planet",
    mass: 150,
  },
  {
    id: "saturn",
    name: "Saturn",
    radius: 6,
    distanceFromSun: 170,
    orbitSpeed: 0.006,
    rotationSpeed: 0.045,
    textureUrl: null,
    color: "#e3d2ab",
    type: "planet",
    mass: 100,
  },
  {
    id: "uranus",
    name: "Uranus",
    radius: 3.5,
    distanceFromSun: 230,
    orbitSpeed: 0.004,
    rotationSpeed: 0.03,
    textureUrl: null,
    color: "#81c0c2",
    type: "planet",
    mass: 60,
  },
  {
    id: "neptune",
    name: "Neptune",
    radius: 3.4,
    distanceFromSun: 290,
    orbitSpeed: 0.003,
    rotationSpeed: 0.03,
    textureUrl: null,
    color: "#3452b4",
    type: "planet",
    mass: 65,
  },
];

export const asteroidBeltRange = {
  inner: 85,
  outer: 105,
  count: 2000,
};
