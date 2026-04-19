/**
 * Mapping des descriptions curées tier 1.
 * Clé : alias principal normalisé (premier élément du tableau `aliases` dans plugin-knowledge.ts).
 * Valeur : description en français à afficher dans le bloc « À propos ».
 */
export const CURATED_DESCRIPTIONS: Record<string, string> = {
  serum:
    "Serum, c'est LE synthétiseur wavetable moderne. Pensé pour la production électronique, il combine un son propre et précis avec une interface visuelle qui montre exactement ce que font tes ondes. Si tu fais du hip-hop, de la trap, de l'EDM ou de la pop moderne, tu entends du Serum tous les jours à la radio — qu'il soit chargé à mort de presets tiers ou utilisé pour sculpter un son signature. Ses forces : un éditeur de wavetables complet, des effets intégrés de qualité, et une énorme bibliothèque communautaire. Son piège : facile à surutiliser avec les mêmes presets que tout le monde.",

  kontakt_7:
    "Kontakt, ce n'est pas vraiment un instrument — c'est un hôte qui charge des banques de sons. À peu près tous les orchestres virtuels, pianos échantillonnés, guitares pro et instruments ethniques du marché fonctionnent dedans. Si tu fais de la musique à l'image, de la bande-son, du hip-hop avec samples, ou tu as besoin d'instruments acoustiques réalistes, Kontakt est probablement le moteur qui tourne sous le capot. Il existe une version gratuite (Kontakt Player) qui lit les banques payantes NI, et la version complète qui permet aussi de créer tes propres instruments.",

  kontakt_8:
    "Kontakt, ce n'est pas vraiment un instrument — c'est un hôte qui charge des banques de sons. À peu près tous les orchestres virtuels, pianos échantillonnés, guitares pro et instruments ethniques du marché fonctionnent dedans. Si tu fais de la musique à l'image, de la bande-son, du hip-hop avec samples, ou tu as besoin d'instruments acoustiques réalistes, Kontakt est probablement le moteur qui tourne sous le capot. Il existe une version gratuite (Kontakt Player) qui lit les banques payantes NI, et la version complète qui permet aussi de créer tes propres instruments.",

  fabfilter_pro_q_3:
    "Pro-Q 3, c'est l'EQ paramétrique de référence depuis 2017. Jusqu'à 24 bandes, filtres linéaires ou à phase minimale, analyseur spectral en temps réel avec comparaison avant/après, détection intelligente des conflits entre pistes — tout ce qu'un EQ peut faire, il le fait, et mieux que la plupart. Point fort : l'interface est si fluide qu'on oublie qu'on manipule un outil. Point faible : à force d'être partout, ça peut pousser à sur-égaliser au lieu d'aller chercher un meilleur son à la source.",

  fabfilter_pro_q_4:
    "Pro-Q 4, c'est la dernière évolution de l'EQ de référence FabFilter. Par rapport au Pro-Q 3, il ajoute un mode dynamique plus souple et l'égalisation en fonction du spectre d'une autre piste (EQ Match). Si tu as déjà Pro-Q 3, l'upgrade n'est pas vital. Si tu pars de zéro, c'est l'EQ à avoir.",

  fabfilter_pro_c_2:
    "Pro-C 2, c'est le compresseur couteau-suisse qui simule plusieurs caractères : Clean (transparent, pour le mastering), Opto (doux, pour la voix et la basse), Vocal (adapté aux pistes vocales), Mastering (chirurgical), Punch (pour la batterie), Bus (pour coller un groupe). Interface visuelle excellente avec le signal qui passe en temps réel. Si tu n'as qu'un seul compresseur VST, c'est un candidat sérieux. Si tu en as 50, celui-ci remplace probablement la moitié d'entre eux.",

  fabfilter_pro_l_2:
    "Pro-L 2, c'est LE limiteur de mastering le plus utilisé par les ingés du son modernes. Huit styles d'algorithmes, gestion précise des True Peaks, lookahead ajustable, et surtout une transparence remarquable même sous forte compression. Si tu as du mal à obtenir un master fort sans étouffer le mix, Pro-L 2 est la réponse. Attention : un limiteur ne remplace pas un mix équilibré.",

  fabfilter_pro_mb:
    "Pro-MB, c'est un compresseur multi-bandes moderne. Jusqu'à 6 bandes, détection dynamique qui active la compression seulement quand nécessaire, et une interface claire qui évite le piège habituel du multi-bandes : sur-traiter parce qu'on voit des courbes bouger. Idéal pour dompter une voix qui saute dans les aigus, calmer des médiums agressifs dans un mix de groupe, ou sculpter un master.",

  fabfilter_pro_r_2:
    "Pro-R 2, c'est le reverb algorithmique signature FabFilter. Plutôt que de copier tel ou tel hardware vintage, il propose une approche unique : un paramètre 'Space' qui traverse continûment du petit local jusqu'à la cathédrale, et un égaliseur de decay qui permet d'allonger ou raccourcir certaines fréquences dans la queue. Sonorité moderne, propre, contrôlable. Parfait pour la pop, l'électronique, la musique à l'image.",

  valhalla_vintage_verb:
    "VintageVerb, c'est LA référence des reverbs algorithmiques abordables. 22 algorithmes qui vont du hall classique aux plates vintage en passant par des chambres expérimentales, une sonorité chaude et musicale immédiatement utilisable, et un prix dérisoire comparé aux concurrents. Si tu n'as qu'un seul reverb VST, VintageVerb est un choix qu'un pro confirmerait. Son mode 'Dirty' (saturation subtile) et ses modes vintage (70s, 80s, now) lui donnent un caractère distinctif.",

  valhalla_supermassive:
    "Supermassive, c'est le reverb/delay gratuit qui fait honte à beaucoup de plugins payants. Spécialisé dans les reverbs géants, longs, atmosphériques, les drones, les textures — pas pour une voix claire, mais pour des nappes synthétiques, des pads, des effets. Gratuit, téléchargé des millions de fois, utilisé partout. Si tu produis de l'ambient, de l'électronique atmosphérique ou des bandes-son, Supermassive devrait déjà être un essentiel.",

  auto_tune_access:
    "Auto-Tune Access, c'est la porte d'entrée de la gamme Antares. Correction automatique, contrôles minimaux, idéal pour obtenir l'effet Auto-Tune classique sans se prendre la tête. Pour du travail pro, regarde du côté d'Auto-Tune Artist ou Pro.",

  auto_tune_artist:
    "Auto-Tune Artist, c'est la version allégée d'Auto-Tune Pro. Corrige en temps réel avec les algorithmes Antares mais sans l'éditeur graphique détaillé. Adapté pour du tracking live ou pour des productions où tu veux une correction rapide sans passer une heure à éditer. Pour le travail fin en post-prod, Pro reste plus complet.",

  auto_tune:
    "Auto-Tune, c'est le nom qui est devenu un verbe — 'autotuner une voix'. La version pro (Auto-Tune Pro) va bien au-delà de l'effet T-Pain : correction subtile et transparente, graphical mode pour éditer note par note comme dans Melodyne, contrôle du vibrato, gestion du formant. Dans un contexte pop/rap moderne, c'est presque impossible de sortir une voix sans quelques passages corrigés. Utilisé subtilement, inaudible ; utilisé à fond, c'est un effet créatif assumé.",
};
