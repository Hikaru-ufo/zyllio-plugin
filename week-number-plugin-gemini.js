// La fonction de calcul du numéro de semaine ISO 8601
function getIsoWeekNumber(date) {
    // ... (Logique JavaScript du calcul ISO 8601)
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); 
    const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Enregistrement de la formule via le Zyllio SDK
if (typeof zyllio !== 'undefined' && zyllio.defineCustomFormula) {
    zyllio.defineCustomFormula({
        name: 'SEMAINE_ISO',
        description: 'Retourne le numéro de semaine ISO 8601 de la date fournie.',
        arguments: [{
            name: 'date',
            type: 'date', 
            description: 'La date à convertir.'
        }],
        func: function (date) {
            if (!(date instanceof Date) || isNaN(date)) {
                // Retourne une erreur si la date n'est pas valide
                return null; 
            }
            return getIsoWeekNumber(date);
        },
        returnType: 'number',
    });
}