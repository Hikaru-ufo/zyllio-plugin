/**
 * Test Fonction Zyllio SANS paramètres
 */

console.log('🚀 Test fonction sans paramètres...');

// Fonction qui ne prend AUCUN paramètre
class ZeroParamFunction {
    execute(properties) {
        console.log('🎯 Fonction sans paramètre appelée !');
        
        // Retourne la date actuelle et son numéro de semaine
        const now = new Date();
        const weekNumber = this.getWeekNumber(now);
        
        console.log(`📅 Semaine actuelle: ${weekNumber}`);
        return `Semaine ${weekNumber}`;
    }
    
    getWeekNumber(date) {
        const target = new Date(date.valueOf());
        const dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    }
}

// Métadonnées SANS propriétés
const ZeroParamMetadata = {
    id: 'current-week',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#cccccc"><path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" /></svg>`,
    label: 'Semaine Actuelle',
    category: 'Date',
    properties: [] // AUCUNE propriété !
};

// Enregistrement
if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    console.log('✅ Test fonction sans paramètre...');
    const instance = new ZeroParamFunction();
    zySdk.services.registry.registerFunction(ZeroParamMetadata, instance);
    console.log('🎉 Fonction sans paramètre enregistrée !');
} else {
    console.error('❌ zySdk indisponible');
}