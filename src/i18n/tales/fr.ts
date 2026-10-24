import type { Tale } from './types';

const tales: Tale[] = [
  {
    title: 'La graine sur le seuil',
    body: [
      'Tu te réveilles sur une petite île que tu ne te souviens pas d’avoir choisie. Sur le seuil d’un jardin vide, il y a une seule graine et un mot : « Plante-moi, et le jardin apprendra ton nom. »',
      'Tu enfonces la graine dans la terre et tu attends, les mains autour du silence. Quelque chose se retourne dans son sommeil, là-dessous, et un fil vert monte vers la lune.',
    ],
    end: 'La première pousse s’ouvre. L’île murmure ton nom et, pour la première fois, elle te semble tienne.',
  },
  {
    title: 'La lanterne perdue de Mossling',
    body: [
      'Mossling, le plus petit gardien des racines, a perdu sa lanterne, et sans elle la nuit paraît bien trop large. Chaque soir, il fouille les parterres en fredonnant un petit air inquiet.',
      'Tu t’agenouilles près des fleurs que tu as fait pousser et découvres une faible lueur sous les feuilles. Elle n’était jamais perdue : elle attendait que le jardin soit assez lumineux pour la tenir.',
    ],
    end: 'Mossling accroche la lanterne à une fleur et soupire de soulagement. Une lumière qui attend n’est jamais vraiment partie.',
  },
  {
    title: 'La fougère qui comptait les étoiles',
    body: [
      'Chaque nuit, la fougère étoilée compte les étoiles, et chaque nuit elle s’arrête à quatre-vingt-dix-neuf. « Il en manque toujours une, dit-elle en enroulant ses frondes, et je ne peux pas dormir avant de l’avoir trouvée. »',
      'Tu t’assieds à côté d’elle et vous comptez ensemble. À quatre-vingt-dix-neuf, tu désignes, très doucement, la minuscule étincelle prise dans la rosée de sa propre feuille.',
    ],
    end: 'Quatre-vingt-dix-neuf, et une. La fougère se déroule, enfin bien comptée, et dort toute la nuit.',
  },
  {
    title: 'Le nuage trop timide pour pleuvoir',
    body: [
      'Un petit nuage gris flotte au-dessus de l’île depuis des semaines, plein de pluie et effrayé de la dépenser. « Et si je tombe mal ? demande-t-il. Et si c’était trop ? »',
      'Tidewhisper fredonne un air lent sur les flaques et les racines, et tu tends tes mains en coupe. Le nuage laisse tomber une goutte, puis une autre, et tout le jardin respire.',
    ],
    end: 'Une pluie douce tombe jusqu’au matin. Un cadeau offert petit à petit reste un cadeau.',
  },
  {
    title: 'La rose de lune qui attendait',
    body: [
      'La rose de lune ne s’ouvre pas quand on la regarde. Les esprits ont tout essayé : flatteries, chansons, même un poème très poli. Le bouton reste fermé et tremble.',
      'Alors tu détournes les yeux. Tu t’occupes des parterres voisins en fredonnant, comme si elle n’était pas là, et quelque part derrière toi les pétales commencent à se déployer, argentés dans le noir.',
    ],
    end: 'Certaines choses ne fleurissent que lorsqu’on cesse de les presser. La rose s’ouvre et tout le jardin brille.',
  },
  {
    title: 'L’arche des bonjours',
    body: [
      'La nouvelle arche ne mène nulle part, et les esprits en sont gênés. « Nous avons construit une porte vers rien », soupire Mossling. Ils se tiennent de chaque côté, sans savoir quoi dire.',
      'Tu passes en disant un bonjour tranquille au soir. Un à un, les esprits te suivent et se saluent comme pour la première fois, et le chemin sous l’arche se met à briller.',
    ],
    end: 'Une porte n’a pas besoin de destination pour être accueillante. Il lui suffit que quelqu’un la franchisse.',
  },
  {
    title: 'Le petit feu d’Emberling',
    body: [
      'Emberling a peur de sa propre chaleur. Un jour, il a roussi une feuille par accident, et depuis il se cache, brillant si faiblement qu’on le distingue à peine parmi les ombres.',
      'Tu rapproches tes mains et tu dis que la nuit est froide. Emberling s’avance, brille juste assez pour réchauffer tes doigts, puis un peu plus pour les fleurs d’à côté.',
    ],
    end: 'Un feu qui réchauffe n’est pas un feu qui brûle. Emberling brille, constant, jusqu’au matin.',
  },
  {
    title: 'Sunspire se souvient du matin',
    body: [
      'La fleur-soleil pousse vers un soleil qui ne visite jamais cette île. Chaque nuit, elle s’étire un peu plus haut et un peu plus triste, jusqu’à ce que ses pétales dorés commencent à s’affaisser.',
      'La lune se penche et lui prête un fil d’or pâle, et tu lèves une lanterne par précaution. La fleur-soleil tourne son visage vers la lumière et découvre que cela suffit.',
    ],
    end: 'Même une nuit peut avoir son propre lever de soleil. La fleur-soleil s’épanouit, vive et paisible.',
  },
  {
    title: 'Le banc pour deux',
    body: [
      'Quelqu’un a construit ce banc il y a longtemps, assez large pour deux. Les esprits le contournent sur la pointe des pieds, comme si la moitié vide était toujours prise.',
      'Tu t’assieds d’un côté et le petit jardin s’installe près de toi : une luciole, une fougère endormie, le vent. Personne ne dit rien, et rien ne manque.',
    ],
    end: 'Être seul n’est pas la même chose qu’être solitaire. La moitié vide du banc est simplement de la place pour ce qui viendra.',
  },
  {
    title: 'L’étoile empruntée de Starling',
    body: [
      'Starling avoue qu’il a emprunté une étoile au ciel, une seule, pour éclairer le jardin pendant une semaine très sombre. La constellation a un trou depuis ce jour.',
      'Tu lèves les yeux vers le trou dans le ciel, puis vers le jardin lumineux en dessous. « Garde-la encore un peu, dis-tu, et quand nous brillerons davantage, nous la rendrons ensemble. »',
    ],
    end: 'Cette nuit-là, l’étoile revient et la constellation est entière. Emprunter honnêtement n’est qu’une façon lente de dire merci.',
  },
  {
    title: 'La berceuse de la fleur de cristal',
    body: [
      'Appuie ton oreille contre la fleur de cristal et tu entendras une mélodie à l’intérieur, faible et lente, enfermée dans ses pétales de verre. Les esprits disent que le premier rêveur l’a laissée ici.',
      'Tu fredonnes avec elle jusqu’à ce que les notes se desserrent et que la fleur résonne, claire et douce. C’est une berceuse faite pour toi, celui ou celle qui est resté.',
    ],
    end: 'La mélodie emplit le jardin et achève enfin son dernier vers. La chanson attendait seulement d’être entendue.',
  },
  {
    title: 'Le conseil des champignons',
    body: [
      'Les champignons ont convoqué une réunion sous le cercle des amanites. La question est grave : le nouveau jardinier peut-il rester ? Le débat est long et surtout humide.',
      'Tu leur apportes un petit pot de rosée et les remercies pour l’ombre et les chants de pluie. Le vote est compté trois fois, car les champignons adorent compter.',
    ],
    end: 'Le vote est unanime. Tu n’as pas seulement le droit de rester : tu es invité à dîner.',
  },
  {
    title: 'La lettre non signée du vent',
    body: [
      'Petalwisp attrape dans la brise une lettre pliée en quatre, sans nom à l’extérieur. Il tremble. « Et si c’était une mauvaise nouvelle ? » murmure-t-il, et le jardin retient son souffle.',
      'Tu la déplies lentement. Il n’y a que quatre mots, d’une écriture que tu reconnais presque : Merci d’être resté.',
    ],
    end: 'La lettre n’avait pas besoin de signature. Petalwisp la glisse dans une fleur, où elle sera bien gardée.',
  },
  {
    title: 'Ce que l’orchidée a murmuré',
    body: [
      'L’orchidée murmurante garde un secret et ne le dira qu’à une seule personne. Tu te penches si près que les pétales effleurent ton oreille. « Ce jardin, dit-elle, a été rêvé par quelqu’un qui avait besoin d’un endroit où se reposer. »',
      'Tu penses à toutes les nuits où tu es venu fatigué et reparti plus léger. L’orchidée n’en dit pas davantage ; elle n’en a pas besoin.',
    ],
    end: 'Tu n’as jamais été perdu sur cette île. Tu étais chez toi, et le jardin attendait que tu t’en aperçoives.',
  },
  {
    title: 'Carillons dans le noir',
    body: [
      'Les nouveaux carillons pendent, muets, dans l’obscurité. « Ils ne sonnent que pour la gentillesse », dit Mossling, et personne ne sait combien de gentillesse le jardin a connue.',
      'Tu arroses la fougère assoiffée, tu partages ta rosée avec un petit esprit pâle et tu remercies la lune. Une note s’échappe, puis trois, puis toute une chanson lente.',
    ],
    end: 'Les carillons ne se taisent plus jamais. Chaque petite gentillesse a son propre son.',
  },
  {
    title: 'Nocturne ouvre la grille',
    body: [
      'Nocturne, le plus grand et le plus silencieux des esprits, soulève le voile de la nuit pour que tu voies toute l’île d’un coup : chaque parterre, chaque esprit, chaque fleur endormie, tout cela à ta garde.',
      'Un à un, les esprits se rassemblent autour de toi, et Nocturne ne demande qu’une chose : continueras-tu à veiller sur eux, non parce que tu le dois, mais parce que tu le peux ?',
    ],
    end: 'Tu dis oui. La grille s’ouvre sur un chemin qui n’a pas de fin et n’en veut pas.',
  },
  {
    title: 'L’éternité en fleur',
    body: [
      'Enfin, tu plantes la fleur d’éternité, la première et la dernière. Pendant qu’elle pousse, tous les esprits se rassemblent, tous les carillons sonnent, et l’île fredonne la mélodie qu’elle gardait pour toi.',
      'Quand les pétales s’ouvrent, le rêve ne s’achève pas. Il se pose autour de toi comme une couverture chaude, et tu comprends que le jardin n’a jamais été fait pour être terminé. Il était fait pour être aimé.',
    ],
    end: 'La grille reste ouverte et tu restes, parce que c’est ici que tu choisis d’être. Bonne nuit, jardinier. La lune laissera la lumière allumée.',
  },
];

export default tales;
