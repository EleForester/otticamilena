import serviceExam from '../assets/service_exam.jpg';
import serviceContactLenses from '../assets/service_contact_lens_closeup.png';
import serviceRepair from '../assets/service_repair_pro.png';
import serviceLenses from '../assets/service_lenses.jpg';

export const services = [
    {
        id: 1,
        title: 'Esame della Vista',
        description: 'Controllo accurato della vista con strumentazione all\'avanguardia.',
        icon: '👁️',
        image: serviceExam
    },
    {
        id: 2,
        title: 'Applicazione Lenti a Contatto',
        description: 'Consulenza e prova per trovare le lenti a contatto più adatte ai tuoi occhi.',
        icon: '🔍',
        image: serviceContactLenses
    },
    {
        id: 3,
        title: 'Riparazione e Assistenza',
        description: 'Riparazione montature, sostituzione naselli e viti, lucidatura.',
        icon: '🔧',
        image: serviceRepair
    },
    {
        id: 4,
        title: 'Montaggio Lenti',
        description: 'Laboratorio interno per il montaggio rapido e preciso delle tue lenti.',
        icon: '👓',
        image: serviceLenses
    }
];
