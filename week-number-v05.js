/**
 * Plugin Zyllio - Numéro de Semaine
 * Métadonnées strictement conformes au SDK
 */

// Informations du plugin
const PLUGIN_INFO = {
    name: "Fonctions Date Avancées",
    version: "1.0.1",
    author: "Hikaru-ufo"
};

console.log(`Chargement plugin ${PLUGIN_INFO.name} v${PLUGIN_INFO.version}...`);

// Icône
const WeekIcon = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
<path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
</svg>
`;

// Fonction
class WeekNumberFunction {
    async execute(properties) {  // Ajout de async
        console.log('=== DEBUT EXECUTION ===');
        console.log('Properties reçues:', properties);
        
        try {
            const dateProperty = properties.find(p => p.id === 'date');
            console.log('dateProperty trouvée:', dateProperty);
            
            if (!dateProperty) {
                console.log('ERREUR: dateProperty est undefined');
                return 0;
            }
            
            console.log('dateProperty.value:', dateProperty.value);
            console.log('Type de value:', typeof dateProperty.value);
            
            // Utiliser le service dictionary avec await
            let dateValue = dateProperty.value;
            
            if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.dictionary) {
                const valueFromDict = await zySdk.services.dictionary.getValue(dateProperty);  // Ajout de await
                console.log('Valeur via dictionary (awaited):', valueFromDict);
                if (valueFromDict) {
                    dateValue = valueFromDict;
                }
            }
            
            if (!dateValue) {
                console.log('ERREUR: dateValue est vide');
                return 0;
            }

            console.log('Valeur finale à convertir:', dateValue);
            let date = new Date(dateValue);
            console.log('Date créée:', date);
            console.log('Date valide?', !isNaN(date.getTime()));
            
            if (isNaN(date.getTime())) {
                console.log('ERREUR: Date invalide');
                return 0;
            }

            const week = this.getISOWeekNumber(date);
            console.log('SUCCES: Semaine calculée =', week);
            return week;

        } catch (error) {
            console.error('EXCEPTION:', error);
            console.error('Stack:', error.stack);
            return 0;
        }
    }

    getISOWeekNumber(date) {
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

// Métadonnées EXACTEMENT comme l'exemple du SDK
const WeekNumberMetadata = {
    id: 'week-number',
    icon: WeekIcon,
    label: 'Numéro de semaine',
    category: 'Date',
    properties: [{
        id: 'date',  // Simplifié
        name: 'Date',
        type: 'date',
        tooltip: 'La date',
        default: '',
        main: true
        // PAS de write: false !
        // PAS de format: 'number' !
    }]
};

// Enregistrement
if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    console.log('✅ Enregistrement...');
    const instance = new WeekNumberFunction();
    zySdk.services.registry.registerFunction(WeekNumberMetadata, instance);
    console.log('🎉 Plugin chargé !');
} else {
    console.error('❌ zySdk indisponible');
}
