// Business logic for the Entrega Facilitada Pricing Engine
// Ported to TypeScript for the Next.js / Supabase environment

export interface PricingParams {
    Ms: number; // Margem de Segurança (ex: 0.15)
    Co: number; // Custos Operacionais (ex: 0.10)
    Pp: number; // Preço Projetado (Projected Repair Cost)
    months: number; // Contract duration
}

export const PricingEngine = {
    /**
     * Estimates repair cost based on property metrics
     * @param m2 - Square meters
     * @param standard - 'economico', 'standard', 'premium' 
     */
    estimateProjectedRepair(m2: number, standard: string): number {
        const rates: Record<string, number> = {
            'economico': 85,  // R$/m2 for light paint/cleanup
            'standard': 145,  // R$/m2 for standard paint + small repairs
            'premium': 280,   // R$/m2 for high-end paint + maintenance
        };
        
        return m2 * (rates[standard] || rates['standard']);
    },

    /**
     * Calculates the final subscription price
     * Formula: Pc = (Pp * (1 + Ms)) / (1 - Co)
     */
    calculateFinalPrice(Pp: number, Ms: number, Co: number, months: number = 12) {
        const totalCost = (Pp * (1 + Ms)) / (1 - Co);
        const monthly = totalCost / months;
        
        return {
            total: Number(totalCost.toFixed(2)),
            monthly: Number(monthly.toFixed(2)),
            breakdown: {
                repairBase: Pp,
                safetyMargin: Pp * Ms,
                operationalCost: totalCost * Co
            }
        };
    }
};
