export const THEMES = [
    { 
        sky: ['#87CEEB', '#E0F6FF', '#FFFFFF'], 
        pipe: ['#2E8B57', '#3CB371'], 
        ground: '#8FBC8F', 
        groundEdge: '#556B2F',
        type: 'sunny',
        elements: { clouds: true, mountains: false, trees: true, stars: false }
    },
    { 
        sky: ['#191970', '#000080', '#000000'], 
        pipe: ['#483D8B', '#6A5ACD'], 
        ground: '#2F4F4F', 
        groundEdge: '#000000',
        type: 'night',
        elements: { clouds: false, mountains: true, trees: true, stars: true }
    },
    { 
        sky: ['#FF7F50', '#FF4500', '#DA70D6'], 
        pipe: ['#8B0000', '#B22222'], 
        ground: '#A0522D', 
        groundEdge: '#8B4513',
        type: 'sunset',
        elements: { clouds: true, mountains: true, trees: false, stars: false }
    },
    { 
        sky: ['#F0E68C', '#FFDAB9', '#FFE4B5'], 
        pipe: ['#D2B48C', '#DEB887'], 
        ground: '#F4A460', 
        groundEdge: '#CD853F',
        type: 'desert',
        elements: { clouds: false, mountains: true, trees: false, stars: false } // mountains acting as dunes
    },
    { 
        sky: ['#B0C4DE', '#E6E6FA', '#FFFFFF'], 
        pipe: ['#A9A9A9', '#C0C0C0'], 
        ground: '#F0F8FF', 
        groundEdge: '#DCDCDC',
        type: 'snow',
        elements: { clouds: true, mountains: true, trees: true, stars: false }
    }
];

export const COLORS = [
    { name: "CARDINAL", val: "#DC143C" }, { name: "BLUE JAY", val: "#1E90FF" },
    { name: "GOLD FINCH", val: "#FFD700" }, { name: "PARROT", val: "#32CD32" }, 
    { name: "FLAMINGO", val: "#FF69B4" }, { name: "PIGEON", val: "#708090" },
    { name: "RAVEN", val: "#1c1c1c" }, { name: "SNOWY", val: "#F8F8FF" }
];

export const STYLES = [
    { id: "classic", name: "CLASSIC" }, { id: "realistic", name: "CARDINAL" },
    { id: "parrot", name: "PARROT" }, { id: "owl", name: "OWL" },
    { id: "eagle", name: "EAGLE" }, { id: "sparrow", name: "SPARROW" }, 
    { id: "woodpecker", name: "PECKER" }
];

export const HATS = [
    { id: "none", name: "NO HAT" }, { id: "crown", name: "CROWN" },
    { id: "cowboy", name: "COWBOY" }, { id: "propeller", name: "PROPEL" },
    { id: "tophat", name: "TOP HAT" }, { id: "beanie", name: "BEANIE" },
    { id: "cap", name: "CAP" }, { id: "helmet", name: "HELMET" }
];

export const WINGS = [
    { id: "feathery", name: "FEATHERY" }, { id: "glider", name: "GLIDER" },
    { id: "swift", name: "SWIFT" }, { id: "angel", name: "ANGEL" },
    { id: "bat", name: "BAT" }, { id: "butterfly", name: "BUTTER" }
];

export const COINS_TO_LEVEL_UP = 5;
