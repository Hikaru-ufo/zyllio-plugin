/**
 * Plugin Zyllio - Fonctions Date Avancées
 * Développé par Hikaru-ufo
 * Prêt à utiliser directement, sans compilation !
 */

// Métadonnées du plugin
const PLUGIN_INFO = {
    name: "Fonctions Date Avancées",
    version: "1.0.0",
    author: "Hikaru-ufo",
    description: "Plugin pour calculs de dates avancés"
};

console.log(`🚀 Chargement du plugin "${PLUGIN_INFO.name}" v${PLUGIN_INFO.version} par ${PLUGIN_INFO.author}`);

// Icône SVG pour la fonction
const WeekIcon = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="#cccccc">
<path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
<text x="12" y="15" text-anchor="middle" font-size="8" fill="#666">W</text>
</svg>
`;

// Classe de la fonction (version simplifiée)
class WeekNumberFunction {
    execute(properties) {
        console.log('🔄 Execution de la fonction Numéro de semaine');
        console.log('📝 Propriétés reçues:', properties);
        
        try {
            // Récupération de la propriété date
            const dateProperty = properties.find(p => p.id === 'date');
            console.log('📅 Propriété date trouvée:', dateProperty);
            
            if (!dateProperty || !dateProperty.value) {
                console.log('⚠️ Aucune date fournie, retour 0');
                return 0;
            }

            // Conversion en objet Date
            let date;
            if (typeof dateProperty.value === 'string') {
                date = new Date(dateProperty.value);
            } else if (dateProperty.value instanceof Date) {
                date = dateProperty.value;
            } else {
                console.log('⚠️ Format de date non reconnu:', typeof dateProperty.value);
                return 0;
            }

            // Vérification de la validité de la date
            if (isNaN(date.getTime())) {
                console.log('⚠️ Date invalide');
                return 0;
            }

            // Calcul du numéro de semaine selon ISO 8601
            const weekNumber = this.getISOWeekNumber(date);
            console.log(`✅ Numéro de semaine calculé: ${weekNumber} pour la date ${date.toISOString()}`);
            return weekNumber;
        } catch (error) {
            console.error('❌ Erreur lors du calcul du numéro de semaine:', error);
            return 0;
        }
    }

    /**
     * Calcule le numéro de semaine selon la norme ISO 8601
     * @param {Date} date - La date à traiter
     * @returns {number} Le numéro de semaine (1-53)
     */
    getISOWeekNumber(date) {
        // Copie de la date pour éviter les mutations
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
        id: 'date',
        name: 'Date',
        type: 'row-variable', // Changé de 'date' vers 'row-variable'
        tooltip: 'Sélectionnez la variable contenant la date pour obtenir son numéro de semaine (norme ISO 8601 - semaine 1 à 53)',
        default: '',
        main: true,
        write: false // Ajouté pour indiquer que c'est en lecture seule
    }]
};

// Instance et enregistrement de la fonction
const weekNumberFunctionInstance = new WeekNumberFunction();

// Vérifier que zySdk est disponible avant d'enregistrer
if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    console.log(`✅ Enregistrement de la fonction "${WeekNumberMetadata.label}"...`);
    zySdk.services.registry.registerFunction(WeekNumberMetadata, weekNumberFunctionInstance);
    console.log(`🎉 Plugin "${PLUGIN_INFO.name}" chargé avec succès !`);
    console.log(`📅 Fonction "${WeekNumberMetadata.label}" disponible dans la catégorie "${WeekNumberMetadata.category}"`);
} else {
    console.error(`❌ zySdk non disponible - impossible de charger le plugin "${PLUGIN_INFO.name}"`);
    console.error('Vérifiez que vous êtes bien dans Zyllio Studio');
}

// Export des informations du plugin pour Zyllio
if (typeof window !== 'undefined') {
    window.ZYLLIO_PLUGIN_INFO = PLUGIN_INFO;
}
