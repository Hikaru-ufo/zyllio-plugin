/**
 * Plugin Zyllio - Numéro de Semaine
 * Métadonnées strictement conformes au SDK
 */

// Informations du plugin
const PLUGIN_INFO = {
    name: "Fonctions Date Avancées",
    version: "2.0.1",  // VERSION AUGMENTÉE POUR IDENTIFIER
    author: "Hikaru-ufo",
    buildDate: "2025-01-20 15:30"  // Date de build pour tracer
};

console.log('========================================');
console.log('CHARGEMENT PLUGIN ZYLLIO');
console.log(`Nom: ${PLUGIN_INFO.name}`);
console.log(`Version: ${PLUGIN_INFO.version}`);
console.log(`Auteur: ${PLUGIN_INFO.author}`);
console.log(`Build: ${PLUGIN_INFO.buildDate}`);
console.log('========================================');

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
        console.log('Nombre de properties:', properties.length);
        
        // Logger TOUTE la structure en détail
        properties.forEach((prop, index) => {
            console.log(`Property [${index}]:`, JSON.stringify(prop, null, 2));
        });
        
        try {
            const dateProperty = properties.find(p => p.id === 'date');
            console.log('dateProperty trouvée:', dateProperty);
            
            if (!dateProperty) {
                console.log('ERREUR: dateProperty est undefined');
                return 0;
            }
            
            console.log('STRUCTURE COMPLETE dateProperty:', JSON.stringify(dateProperty, null, 2));
            console.log('Toutes les clés de dateProperty:', Object.keys(dateProperty));
            
            // Essayer différentes façons d'accéder à la valeur
            console.log('dateProperty.value:', dateProperty.value);
            console.log('dateProperty.propertyValue:', dateProperty.propertyValue);
            console.log('dateProperty.data:', dateProperty.data);
            
            let dateValue = null;
            
            // Méthode 1: value direct
            if (dateProperty.value && typeof dateProperty.value === 'string') {
                dateValue = dateProperty.value;
                console.log('Méthode 1 (value string):', dateValue);
            }
            // Méthode 2: value est un timestamp
            else if (dateProperty.value && typeof dateProperty.value === 'number') {
                dateValue = dateProperty.value;
                console.log('Méthode 2 (value number):', dateValue);
            }
            // Méthode 3: propertyValue
            else if (dateProperty.propertyValue) {
                dateValue = dateProperty.propertyValue;
                console.log('Méthode 3 (propertyValue):', dateValue);
            }
            // Méthode 4: value.variableName avec dictionary
            else if (dateProperty.value && dateProperty.value.variableName) {
                console.log('Méthode 4: Tentative avec dictionary...');
                try {
                    if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.dictionary) {
                        const valueFromDict = await zySdk.services.dictionary.getValue(dateProperty);
                        console.log('Dictionary result:', valueFromDict);
                        dateValue = valueFromDict;
                    }
                } catch(e) {
                    console.error('Erreur dictionary:', e);
                }
            }
            
            if (!dateValue) {
                console.log('ERREUR: Impossible de récupérer dateValue par aucune méthode');
                console.log('Retour de 0 - la fonction ne peut pas accéder aux données');
                return 0;
            }

            console.log('Valeur finale récupérée:', dateValue, 'Type:', typeof dateValue);
            
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
