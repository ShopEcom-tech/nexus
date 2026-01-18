import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiShield, FiTrendingUp, FiActivity } from 'react-icons/fi';

const features = [
    {
        id: 'support',
        icon: FiShield,
        title: 'Support Illimité',
        desc: "Une équipe dédiée disponible 7j/7. Plus jamais bloqué par un problème technique. On gère l'infrastructure, vous gérez le business.",
        stats: 'Réponse < 2h'
    },
    {
        id: 'updates',
        icon: FiCpu,
        title: 'Mises à jour Auto',
        desc: "Votre site ne vieillit jamais. Nous déployons les derniers correctifs de sécurité et d'optimisation sans que vous leviez le petit doigt.",
        stats: 'Hebdomadaire'
    },
    {
        id: 'strategy',
        icon: FiTrendingUp,
        title: 'Suivi Stratégique',
        desc: "On ne fait pas que du code. Chaque trimestre, on analyse vos KPIs et on propose des améliorations pour convertir plus.",
        stats: '+15% CRO'
    },
    {
        id: 'monitor',
        icon: FiActivity,
        title: 'Monitoring 24/7',
        desc: "Nos sondes surveillent votre site en permanence. 99.9% d'uptime garanti. Si ça coupe, on est déjà au courant.",
        stats: '100% Uptime'
    }
];

export default function FeatureExplorer() {
    const [activeTab, setActiveTab] = useState(features[0].id);

    return (
        <section className="py-20 relative overflow-hidden bg-black/5 rounded-3xl border border-white/5 mx-4 md:mx-0">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                        L'Assurance <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Tranquillité</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Plus qu'un abonnement, c'est votre département technique externalisé.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                    {/* Tabs */}
                    <div className="flex flex-col gap-2 w-full lg:w-1/3">
                        {features.map((feature) => (
                            <button
                                key={feature.id}
                                onClick={() => setActiveTab(feature.id)}
                                className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left relative overflow-hidden ${activeTab === feature.id
                                        ? 'bg-white/10 text-white shadow-lg border border-white/10'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                                    }`}
                            >
                                <div className={`p-3 rounded-lg ${activeTab === feature.id ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 group-hover:bg-white/10'}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{feature.title}</h3>
                                </div>
                                {activeTab === feature.id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-0 top-0 w-1 h-full bg-brand-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Card */}
                    <div className="w-full lg:w-1/2 h-full min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {features.map((feature) => (
                                activeTab === feature.id ? (
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative flex flex-col justify-center"
                                    >
                                        <div className="absolute top-8 right-8 text-brand-500 font-mono text-xl opacity-50">
                                            0{features.indexOf(feature) + 1}
                                        </div>

                                        <div className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center mb-6 text-brand-400">
                                            <feature.icon className="w-8 h-8" />
                                        </div>

                                        <h3 className="text-3xl font-bold mb-4 text-white">
                                            {feature.title}
                                        </h3>

                                        <p className="text-lg text-gray-400 leading-relaxed mb-8">
                                            {feature.desc}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Performance</span>
                                            <span className="text-xl font-mono text-brand-400 font-bold">{feature.stats}</span>
                                        </div>
                                    </motion.div>
                                ) : null
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
