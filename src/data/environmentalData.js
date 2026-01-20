export const beachQualityData = [
    { id: 1, name: "Praia dos Ingleses", status: "unsuitable", coords: [-27.425, -48.385], update: "2026-01-18", source: "IMA" },
    { id: 2, name: "Canasvieiras", status: "unsuitable", coords: [-27.43, -48.46], update: "2026-01-18", source: "IMA" },
    { id: 3, name: "Jurerê Internacional", status: "suitable", coords: [-27.435, -48.515], update: "2026-01-18", source: "IMA" },
    { id: 4, name: "Lagoa do Peri", status: "suitable", coords: [-27.725, -48.525], update: "2026-01-18", source: "IMA" },
    { id: 5, name: "Campeche", status: "suitable", coords: [-27.695, -48.465], update: "2026-01-18", source: "IMA" },
    { id: 6, name: "Joaquina", status: "suitable", coords: [-27.63, -48.45], update: "2026-01-18", source: "IMA" },
    { id: 7, name: "Barra da Lagoa", status: "suitable", coords: [-27.575, -48.421], update: "2026-01-18", source: "IMA" },
    { id: 8, name: "Matadeiro", status: "suitable", coords: [-27.765, -48.49], update: "2026-01-18", source: "IMA" },
    { id: 9, name: "Pântano do Sul", status: "unsuitable", coords: [-27.78, -48.51], update: "2026-01-18", source: "IMA" },
    { id: 10, name: "Santo Antônio de Lisboa", status: "unsuitable", coords: [-27.51, -48.52], update: "2026-01-18", source: "IMA" }
];

export const airQualityData = [
    { id: 1, location: "Centro", aqi: 45, pm25: 11, status: "good", coords: [-27.595, -48.548], update: "10:00 AM" },
    { id: 2, location: "Lagoa da Conceição", aqi: 30, pm25: 7, status: "good", coords: [-27.575, -48.455], update: "10:00 AM" },
    { id: 3, location: "Ingleses", aqi: 55, pm25: 14, status: "moderate", coords: [-27.43, -48.39], update: "10:00 AM" },
    { id: 4, location: "Estreito", aqi: 60, pm25: 16, status: "moderate", coords: [-27.58, -48.58], update: "10:00 AM" }
];

export const marineLifeData = [
    { id: 1, type: "jellyfish", location: "Praia Mole", note: "Recent sightings of jellyfish clusters.", coords: [-27.60, -48.43], severity: "caution" },
    { id: 2, type: "whale", location: "Morro das Pedras", note: "Right whale sighting confirmed this morning.", coords: [-27.74, -48.49], severity: "info" },
    { id: 3, type: "jellyfish", location: "Campeche (North)", note: "Scattered jellyfish reported by surfers.", coords: [-27.67, -48.47], severity: "caution" }
];
