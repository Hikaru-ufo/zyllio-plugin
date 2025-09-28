/**
 * Plugin Zyllio - Test Simple Numéro de semaine
 */

console.log('🚀 Chargement plugin test simple...');

// Icône simple
const SimpleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#cccccc"><path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" /></svg>`;

// Fonction ultra-simple
class SimpleWeekFunction {
    execute(properties) {
        console.log('🔄 Fonction appelée !', properties);
        
        // Test basique - retourne juste 42 pour voir si ça marche
        return 42;
    }
}

// Métadonnées ultra-simples
const SimpleMetadata = {
    id: 'simple-week',
    icon: SimpleIcon,
    label: 'Test Semaine',
    category: 'Date',
    properties: [{
        id: 'date',
        name: 'Date',
        type: 'date',
        default: '',
        main: true
    }]
};

// Enregistrement
if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    console.log('✅ Enregistrement fonction test...');
    const simpleInstance = new SimpleWeekFunction();
    zySdk.services.registry.registerFunction(SimpleMetadata, simpleInstance);
    console.log('🎉 Fonction test enregistrée !');
} else {
    console.error('❌ zySdk non disponible');
}