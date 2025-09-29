/**
 * Plugin Zyllio - Fonctions Date Avancées
 * Version corrigée avec services Zyllio
 */
const PLUGIN_INFO = {
    name: "Fonctions Date Avancées",
    version: "1.1.0",
    author: "Hikaru-ufo",
    description: "Plugin pour calculs de dates avancés"
};
console.log(`🚀 Chargement du plugin "${PLUGIN_INFO.name}" v${PLUGIN_INFO.version}`);

// Icône SVG
const WeekIcon = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="#cccccc">
<path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
<text x="12" y="15" text-anchor="middle" font-size="8" fill="#666">W</text>
</svg>
`;

// Classe de la fonction
class WeekNumberFunction {
    execute(properties) {
        console.log('🔄 Fonction Numéro de semaine appelée');

        try {
            // Récupération de la propriété date
            const dateProperty = properties.find(p => p.id === 'inputDate');
            if (!dateProperty) {
                console.log('⚠️ Propriété date non trouvée');
                return 0;
            }

            // Récupération directe de la valeur
            let dateValue = dateProperty.value;
            console.log('📊 Valeur de date reçue:', dateValue);

            if (!dateValue) {
                console.log('⚠️ Aucune valeur de date fournie');
                return 0;
            }

            // Conversion en objet Date
            let date;
            if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else if (dateValue instanceof Date) {
                date = dateValue;
            } else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else {
                console.log('⚠️ Type de date non reconnu:', typeof dateValue);
                return 0;
            }

            // Vérification de la validité de la date
            if (isNaN(date.getTime())) {
                console.log('⚠️ Date invalide');
                return 0;
            }

            // Calcul du numéro de semaine selon ISO 8601
            const weekNumber = this.getISOWeekNumber(date);
            console.log(`✅ Numéro de semaine: ${weekNumber} pour ${date.toISOString()}`);
            return weekNumber;

        } catch (error) {
            console.error('❌ Erreur:', error);
            return 0;
        }
    }

    /**
     * Calcule le numéro de semaine selon ISO 8601
     */
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

// Métadonnées de la fonction
const WeekNumberMetadata = {
    id: 'week-number',
    icon: WeekIcon,
    label: 'Numéro de semaine',
    category: 'Date',
    properties: [{
        id: 'inputDate',
        name: 'Date',
        type: 'date',  // ou 'variable' si nécessaire
        tooltip: 'Sélectionnez la date ou la variable contenant la date',
        default: '',
        main: true,
        write: false
    }]
};

// Enregistrement
if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    console.log(`✅ Enregistrement de la fonction "${WeekNumberMetadata.label}"...`);
    const weekNumberInstance = new WeekNumberFunction();
    zySdk.services.registry.registerFunction(WeekNumberMetadata, weekNumberInstance);
    console.log(`🎉 Plugin "${PLUGIN_INFO.name}" chargé avec succès !`);
} else {
    console.error(`❌ zySdk non disponible`);
}

// Export des infos
if (typeof window !== 'undefined') {
    window.ZYLLIO_PLUGIN_INFO = PLUGIN_INFO;
}
