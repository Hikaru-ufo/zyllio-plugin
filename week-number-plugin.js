/**
 * Plugin Zyllio - Numéro de semaine (Version JavaScript pure)
 * Prêt à utiliser directement, sans compilation !
 */

// Icône SVG pour la fonction
const WeekIcon = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="#cccccc">
<path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
<text x="12" y="15" text-anchor="middle" font-size="8" fill="#666">W</text>
</svg>
`;

// Classe de la fonction
class WeekNumberFunction {
    execute(properties) {
        try {
            // Récupération de la propriété date
            const dateProperty = properties.find(p => p.id === 'date');
            if (!dateProperty || !dateProperty.value) {
                return 0;
            }

            // Conversion en objet Date
            let date;
            if (typeof dateProperty.value === 'string') {
                date = new Date(dateProperty.value);
            } else if (dateProperty.value instanceof Date) {
                date = dateProperty.value;
            } else {
                return 0;
            }

            // Vérification de la validité de la date
            if (isNaN(date.getTime())) {
                return 0;
            }

            // Calcul du numéro de semaine selon ISO 8601
            return this.getISOWeekNumber(date);
        } catch (error) {
            console.error('Erreur lors du calcul du numéro de semaine:', error);
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
        type: 'date',
        tooltip: 'La date pour laquelle calculer le numéro de semaine (norme ISO 8601)',
        default: '',
        main: true
    }]
};

// Instance et enregistrement de la fonction
const weekNumberFunctionInstance = new WeekNumberFunction();
zySdk.services.registry.registerFunction(WeekNumberMetadata, weekNumberFunctionInstance);