import type { Tale } from './types';

/** Dix-sept contes indépendants pour s’endormir, pour tous les âges. Chacun se termine avant la dernière ligne. */
const tales: Tale[] = [
  {
    title: 'La chatte du phare',
    body: [
      'Au bout d’un cap tordu se dressait un phare, et dans le phare vivaient le vieil Anders et sa chatte Poivre. Chaque soir, Anders gravissait quatre-vingt-dix-neuf marches pour allumer la grande lampe, et chaque soir Poivre montait derrière lui, comptant les marches avec sa queue.',
      'Une nuit de tempête, Anders prit un rhume si fort qu’il ne put quitter son lit. « La lampe, murmura-t-il. Les navires. » Poivre regarda la fenêtre noire, où les vagues lançaient des chapeaux blancs contre les rochers.',
      'Elle n’était qu’une chatte. Elle ne pouvait pas gratter une allumette. Mais elle savait où vivaient les allumettes, qu’une boîte poussée tombe, et qu’une allumette frottée contre une marche rugueuse peut se réveiller. Il lui fallut onze essais et une moustache roussie.',
      'La grande lampe tourna. Son faisceau balaya l’eau, et au large une petite barque de pêche égarée vit la lumière et vira lentement. Au matin, la tempête était fatiguée. La barque était à l’abri au port, et tout le village, au pied du phare, saluait une chatte très modeste.',
    ],
    end: 'Anders guérit, les navires rentrèrent, et depuis, la lampe est allumée à deux, car les braves ne sont pas toujours les grands.',
  },
  {
    title: 'La fillette qui emprunta le vent',
    body: [
      'Ilse vivait dans une vallée où l’air ne bougeait jamais. Le linge pendait droit, les cerfs-volants restaient à plat, et le moulin sur la colline n’avait pas tourné depuis cent ans. « Quelqu’un doit avoir le vent », dit Ilse, et elle prit un bocal et un biscuit et partit le chercher.',
      'Elle passa devant le pré endormi et le pont silencieux jusqu’à un sommet où un grand vent gris était roulé en boule comme un chat. « Puis-je en emprunter un peu ? » demanda-t-elle poliment. Le vent ouvrit un œil. « Personne ne demande, dit-il. Ils me courent seulement après. »',
      'Alors le vent lui donna un bocal de lui-même, avec un couvercle, à une condition : le rapporter avant la prochaine pleine lune. Ilse courut chez elle et ouvrit le couvercle près du moulin. Les ailes grincèrent, tournèrent, chantèrent. Les cerfs-volants bondirent. Le linge dansa. Toute la vallée éclata de rire.',
      'Mais quand la lune s’arrondit, Ilse remonta la montagne. La vallée cria : « Garde-le ! » Ilse secoua la tête. Une promesse est une promesse, même au vent. Elle posa le bocal et souleva le couvercle.',
    ],
    end: 'Le vent, étonné qu’on lui fasse confiance, descendit seul dans la vallée, et il lui rend visite chaque soir depuis.',
  },
  {
    title: 'Le dragon qui collectionnait les berceuses',
    body: [
      'Très haut au-dessus des nuages vivait un tout petit dragon nommé Fenouil. Il ne savait pas cracher le feu, ce dont il avait honte, et il ne savait effrayer personne, ce dont il avait encore plus honte. Ce que Fenouil savait faire, c’était écouter.',
      'Il écoutait les berceuses qui montaient des villages : le fredonnement des mères, le sifflotement des pères, les chansons maladroites des grandes sœurs. Il capturait chacune dans une bouteille de verre et la posait sur une étagère de sa grotte. Bientôt l’étagère portait cent onze berceuses.',
      'Une nuit, un rugissement terrible secoua les montagnes. Un grand dragon d’orage était venu, furieux et sans sommeil, et voulait brûler toute la vallée parce qu’il ne pouvait pas se reposer. Tous s’enfuirent. Pas Fenouil. Il descendit ses bouteilles, une à une, et les ouvrit.',
      'La grotte se remplit de cent onze chansons douces. Elles s’enroulèrent autour du dragon d’orage comme de la laine tiède. Ses yeux s’alourdirent. Son rugissement devint un bâillement, son bâillement un ronflement, et le ronflement était si paisible que même les hiboux s’arrêtèrent pour écouter.',
    ],
    end: 'Au matin, le grand dragon remercia le petit, et Fenouil apprit que le cadeau le plus silencieux est parfois celui qui apprivoise une tempête.',
  },
  {
    title: 'Le garçon et l’échelle de la Lune',
    body: [
      'Tobias avait une question, et elle était trop grande pour sa chambre. Pourquoi la Lune le suivait-elle chaque soir jusqu’à la maison ? Alors un soir il frappa trois fois au ciel et, à sa surprise, une échelle d’argent se déroula des nuages.',
      'Il grimpa barreau après barreau, entre les oiseaux endormis et les cerfs-volants perdus, jusqu’à une colline tranquille de poussière pâle. Là était assise la Lune, ronde, gentille et un peu fatiguée. « Je suis tout le monde, dit-elle. Il faut bien que quelqu’un veille à ce que personne ne rentre seul dans le noir. »',
      'Tobias y réfléchit. « Mais qui marche avec toi ? » La Lune le regarda longtemps, car personne ne le lui avait jamais demandé. « Personne, dit-elle enfin, mais ce n’est pas grave. J’ai tout le ciel. »',
      'Tobias s’assit près de la Lune et ils regardèrent le monde endormi tourner en bas, chaque fenêtre une petite pièce d’or. Il dit à la Lune les noms de tous ses amis, et la Lune lui dit les noms des étoiles.',
    ],
    end: 'Quand il redescendit, l’échelle se roula derrière lui, et chaque soir ensuite Tobias fit signe depuis sa fenêtre, pour que la Lune sache que quelqu’un marchait aussi avec elle.',
  },
  {
    title: 'Le renard et l’horlogère',
    body: [
      'Dans une ville enneigée vivait une horlogère dont la boutique était pleine de tic-tac. Tic, tac, disaient les grandes horloges. Tic-a-tic, répondaient les petites. Un jeune renard qui vivait sous la marche de la boutique adorait ce son, et par une nuit d’hiver il se glissa à l’intérieur et prit la plus petite montre d’or, car il voulait son tic-tac rien que pour lui.',
      'Mais une montre volée tictaque tristement. Dans le terrier, elle sonnait seule, comme un cœur qui regrette sa maison, et à l’aube le renard ne put dormir. Il retourna à la boutique avec la montre dans la gueule. L’horlogère l’attendait avec une tasse de lait chaud.',
      '« Je me demandais qui aimait le plus la petite », dit-elle. Elle ne gronda pas. Elle lui montra les rouages, les ressorts minuscules, comment chaque pièce pousse la suivante, jusqu’à ce que le renard comprenne qu’une horloge est faite de plein de petites choses qui s’entraident pour garder le temps.',
      'Le renard revint chaque soir. Il balayait le sol avec sa queue, et en échange l’horlogère lui apprit à lire l’heure.',
    ],
    end: 'Maintenant la ville sait qu’il est minuit quand un renard s’assoit sur la marche de la boutique et penche la tête, écoutant tout tictaquer ensemble.',
  },
  {
    title: 'Marta et la montagne qui fredonnait',
    body: [
      'Chaque nuit, quand le village se taisait, une note grave roulait depuis la montagne : hmmmm. Personne ne savait pourquoi. Certains disaient que c’était le vent dans une grotte. D’autres, un géant qui ronflait. Marta, qui avait sept ans et beaucoup de curiosité, décida de le découvrir.',
      'Elle grimpa avec une lanterne et une écharpe de laine, suivant le son qui grandissait, jusqu’à une grande porte de pierre dans la roche. Elle frappa. Le fredonnement s’arrêta. Une voix de gravier et de miel demanda : « Qui est-ce ? »',
      'C’était la montagne, et elle ne ronflait pas. Elle chantait, car les étoiles étaient si loin qu’elle craignait qu’elles n’oublient la terre, et une chanson est la seule chose qui voyage si loin. « Mais je suis si vieille, dit la montagne, et ma voix devient grave. »',
      'Marta avait une voix fine et claire. Elle s’éclaircit la gorge et chanta les notes aiguës pendant que la montagne chantait les graves, et ensemble la mélodie monta, monta, au-delà des nuages, jusqu’aux étoiles.',
    ],
    end: 'Les étoiles clignèrent une fois, toutes ensemble. Depuis cette nuit, le village entend deux chansons, une grave et une petite, et dort très bien.',
  },
  {
    title: 'La baleine qui visita la bibliothèque',
    body: [
      'La petite ville portuaire avait une bibliothèque dont la fenêtre ronde donnait sur la mer. La nuit de la plus grande marée de l’année, une baleine nagea si près du rivage que son grand œil remplit toute la fenêtre. La bibliothécaire, Mademoiselle Olsen, laissa tomber son stylo.',
      '« Pardonnez-moi de vous déranger, dit la baleine d’une voix de violoncelle. J’ai nagé dans tous les océans, j’ai entendu beaucoup d’histoires, mais je n’en ai jamais lu. » Mademoiselle Olsen, qui croyait que les livres étaient pour tous, apporta son plus grand atlas et le tint contre la vitre.',
      'Toute la nuit elle tourna les pages et lut à voix haute : des histoires de montagnes que la baleine n’avait vues que d’en dessous, de déserts qu’elle ne pouvait imaginer, d’enfants qui voulaient rencontrer une baleine. La marée resta haute, comme il arrive parfois pour une bonne raison.',
      'À l’aube, la baleine la remercia, et Mademoiselle Olsen promit que la fenêtre resterait toujours ouverte. Et la baleine fit aussi une promesse.',
    ],
    end: 'Chaque année à la plus haute marée, elle revient avec une nouvelle histoire des profondeurs, et toute la ville s’assoit près de la fenêtre ronde pour l’écouter.',
  },
  {
    title: 'L’ours qui ne pouvait pas hiberner',
    body: [
      'Quand la première neige tomba, tous les ours de la forêt bâillèrent, se pelotonnèrent et s’endormirent. Tous sauf Bruno. Il restait dans sa tanière, bien éveillé, comptant les fissures du plafond, et il n’arrivait pas, pour rien au monde, à fermer les yeux.',
      '« Il manque quelque chose », dit Bruno, et il sortit dans le silence blanc le chercher. Il rencontra un lièvre qui ne dormait pas non plus, car le froid lui était entré dans les oreilles, et il lui prêta son flanc chaud. Il rencontra un hérisson qui avait perdu sa couverture de feuilles, et Bruno lui en trouva une nouvelle.',
      'À la fin de la nuit, Bruno avait réuni toute une troupe : le lièvre, le hérisson, deux souris, un très vieux hibou. Ils se serrèrent tous dans sa tanière, et Bruno comprit soudain ce qui manquait. Ce n’était pas le sommeil. C’était la compagnie.',
      'Avec tant de cœurs chauds autour de lui, ses yeux s’alourdirent enfin. Le lièvre enfouit son nez dans sa fourrure. Le hibou fredonna un air lent. Dehors, la neige tombait, tombait, douce comme une promesse.',
    ],
    end: 'Bruno dormit tout l’hiver, et quand il s’éveilla au printemps, toute la tanière s’éveilla avec lui, et personne ne fut plus jamais seul.',
  },
  {
    title: 'Le tailleur de rêves',
    body: [
      'À l’orée de la ville, dans une maison pas plus large qu’une armoire, vivait un tailleur qui ne cousait pas de vêtements. Il cousait des rêves. Il travaillait de minuit à l’aube, avec une aiguille d’argent et un fil filé de bâillements, et les rêves qu’il faisait sortaient par les serrures vers ceux qui en avaient besoin.',
      'Une nuit, un mot arriva du château. Le roi ne dormait plus depuis sept ans. Il voulait le plus grandiose des rêves du royaume : mille chevaliers, un palais doré, un festin qui durerait toujours.',
      'Le tailleur le cousit, chaque point doré, et le roi le rêva et s’éveilla plus fatigué qu’avant. « C’est trop bruyant », dit-il. Alors le tailleur essaya une autre étoffe. Il cousit un rêve avec un petit jardin, un vieux banc, une odeur de pluie et un ami qui ne disait rien du tout.',
      'Le roi pleura dans son sommeil, doucement, d’une façon qui attendait depuis longtemps. À son réveil, il avait l’air plus jeune de dix ans.',
    ],
    end: 'Il paya le tailleur une montagne d’or, et le tailleur la dépensa en fil, car les meilleurs rêves sont toujours les plus simples.',
  },
  {
    title: 'Le long voyage du bateau en papier',
    body: [
      'Léo plia un bateau dans une page de vieux journal et le posa sur une flaque devant sa maison. C’était un tout petit bateau, avec un tout petit drapeau, et il ne savait pas que les flaques peuvent être le début des aventures.',
      'Une bruine gonfla la flaque. La flaque déborda dans un caniveau, le caniveau courut vers un ruisseau, et le ruisseau, en gargouillant, rejoignit une rivière. Le bateau de papier tangua devant des canards qui saluaient, un pêcheur qui ôta son chapeau, un pont où des enfants l’encourageaient.',
      'Il vit enfin la mer : une grande plaine gris-bleu qui bourdonnait. Une mouette se posa sur son pont et demanda : « Où vas-tu ? » Le bateau ne savait pas. Il avait seulement voulu partir. « Alors va au phare, dit la mouette. Ils adorent les visiteurs. »',
      'Il navigua, trempé mais fier, jusqu’à ce qu’un soir une grande vague le soulève doucement et le dépose sur une plage, où une fillette le trouva, le fit sécher près du feu et l’épingla à sa fenêtre.',
    ],
    end: 'Très loin, Léo reçut une lettre dans une bouteille, et sur l’aile du bateau de papier était écrit : Merci pour le voyage.',
  },
  {
    title: 'Le hibou qui avait peur du noir',
    body: [
      'Hugo était un hibou, ce qui est très gênant quand on a peur du noir. Chaque soir, tandis que les autres hiboux ouvraient leurs ailes et hululaient dans la nuit, Hugo restait sur sa branche, agrippé, faisant semblant d’être une très grosse pomme de pin bien ronde.',
      'Une nuit, une petite voix monta du sol. « Excusez-moi, êtes-vous le hibou qui voit dans le noir ? » C’était un petit hérisson, perdu et tremblant. Hugo hésita. Il ne voyait pas dans le noir. Il en avait peur. Mais le hérisson était plus petit.',
      '« Accroche-toi à mes plumes de queue », dit Hugo, et il fit un pas tremblant dans le noir. Et, à son grand étonnement, l’obscurité n’était pas vide du tout. Elle était pleine de formes douces : le trait d’argent du ruisseau, la pâle lanterne d’un papillon de nuit, les épaules des collines endormies comme de grands animaux amicaux.',
      'Ils traversèrent ainsi toute la forêt, le hibou guidant, le hérisson riant, jusqu’à ce que la maisonnette du hérisson apparaisse parmi les racines, une lumière à la fenêtre.',
    ],
    end: 'Hugo rentra sous les étoiles et découvrit que le noir n’était pas un monstre. C’était seulement une très grande couverture, et elle le bordait depuis toujours.',
  },
  {
    title: 'Le printemps du poney des neiges',
    body: [
      'Dans le coin le plus lointain et le plus blanc du nord, l’hiver était resté trop longtemps. La neige était profonde, les rivières dormaient sous la glace, et les villageois commençaient à oublier la couleur verte. Mais dans la vallée vivait un poney des neiges à la crinière épaisse comme un nuage, et le poney se souvenait.',
      'Il se souvenait que sous la neige dormaient des graines qui attendaient que quelqu’un leur dise qu’il était temps. Alors il trotta à travers les champs gelés, et à chaque pas il secouait sa crinière, et il en tombait de petites étincelles chaudes, le dernier soleil d’automne qu’il y avait gardé.',
      'Là où chaque étincelle tombait, la neige s’enfonçait en un petit creux rond, et dans chaque creux une fleur bleue levait la tête. Une, puis dix, puis cent, jusqu’à ce que toute la vallée ressemble à un ciel venu s’y coucher.',
      'Les villageois sortirent dans leurs moufles, se frottant les yeux. Les rivières s’éveillèrent et se hâtèrent. Les oiseaux, qui avaient attendu si patiemment, revinrent dans un grand bruit d’ailes.',
    ],
    end: 'Le soir, la crinière du poney était grise et dégarnie, mais elle repoussa pour l’hiver, et chaque année il garde le soleil de nouveau, au cas où.',
  },
  {
    title: 'La carte au coin vide',
    body: [
      'Nora avait hérité de la carte de sa grand-mère, et c’était la plus belle carte du monde. Elle montrait des forêts, des îles, des rivières aux noms comme Chardon et Oseille, et même une petite mer violette. Mais dans un coin, il y avait un espace vide où rien n’était dessiné.',
      'Alors elle partit, avec une boussole, une cuillère et un sac de biscuits à l’avoine, pour le remplir. Elle traversa le Chardon dans une barque empruntée. Elle gravit les Collines Tordues et dormit sous un toit de fougères. Elle se lia d’amitié avec un héron bavard, un cartographe endormi et une troupe de marionnettes voyageuses.',
      'Et pas à pas le coin vide se rapprocha, jusqu’à ce que Nora atteigne son bord même et trouve, surprise, une petite porte verte dans une haie, avec un paillasson qui disait BIENVENUE. Elle frappa, et ce fut sa grand-mère qui ouvrit.',
      '« J’ai laissé ce coin vide exprès, dit sa grand-mère en riant, et elle mit la bouilloire sur le feu. Toute bonne carte a besoin d’une place où ajouter encore. Je te la gardais. »',
    ],
    end: 'Nora dessina la porte, la haie et la bouilloire, et comprit que les plus beaux voyages finissent exactement là où quelqu’un a laissé la lampe allumée.',
  },
  {
    title: 'La pierre qui chantait',
    body: [
      'Au fond d’une rivière claire reposait une pierre grise, pas plus grosse qu’un œuf, que personne n’avait jamais remarquée. Les poissons nageaient au-dessus. Les canards pagayaient plus haut. Mais chaque nuit, quand la rivière se taisait, la pierre se mettait à chanter, très doucement, une chanson de la montagne où elle était née.',
      'Un matin, un petit garçon nommé Kai pêchait avec son grand-père et l’entendit. Il entra dans l’eau jusqu’aux genoux et en sortit la pierre. Elle était tiède. Il la porta à son oreille et entendit toute la montagne : le vent, la neige qui fondait, le battement long, lent et patient du roc.',
      'Il la rapporta chez lui et la posa sur le rebord de sa fenêtre, et la chanson remplit sa chambre, si belle qu’il ne pouvait cesser d’écouter. Mais au matin la pierre était plus faible, et le soir elle était presque muette.',
      'Kai comprit. Une chanson a besoin de sa rivière. Alors, le cœur lourd et la main très prudente, il rapporta la pierre et la reposa dans l’eau exactement où elle était.',
    ],
    end: 'La rivière coula sur elle, et la pierre chanta plus fort que jamais ; et dès ce jour Kai n’eut qu’à poser l’oreille sur l’eau pour entendre une amie.',
  },
  {
    title: 'La fête des lanternes du Petit Peuple',
    body: [
      'Une fois tous les cent ans, parmi les racines d’un chêne immense, le Petit Peuple célèbre la Fête des Lanternes. Ils ne sont pas plus grands que des dés à coudre, alors chaque lanterne est une luciole qui brille dans une cloche de rosée, et des milliers s’élèvent à la fois comme une neige dorée qui tomberait vers le haut.',
      'Cette année, une petite fille nommée Pip avait un problème. Elle n’avait pas de luciole. Les plus grands et les plus rapides les avaient toutes prises, et elle se tenait au fond de la foule avec une goutte de rosée vide et la lèvre qui tremblait. « Ce n’est rien, dit un escargot avec gentillesse, tu peux monter sur moi. »',
      'Tandis que la fête s’élevait dans le ciel, Pip remarqua quelque chose. Tout au bord de l’ombre du chêne, un petit ver luisant pleurait, car les vers luisants ne volent pas et ne sont donc jamais invités. Pip prit sa petite goutte de rosée, y recueillit le ver luisant et le leva bien haut.',
      'Ce fut la plus brillante lanterne de toutes, non parce que la lumière était plus grande, mais parce qu’elle était partagée. Toute la fête se tourna pour regarder, et la plus ancienne du Petit Peuple s’inclina.',
    ],
    end: 'Depuis ce jour, à chaque fête des lanternes, la première lumière est allumée par quelqu’un qui croyait n’en avoir aucune.',
  },
  {
    title: 'L’oreiller du géant endormi',
    body: [
      'Le géant Gorm vivait sur la colline au-dessus du village, et il n’avait pas dormi depuis quarante nuits, parce que son oreiller était un rocher. Chaque fois qu’il se retournait, les montagnes grondaient, et chaque fois qu’il soupirait, les toits tremblaient. Les villageois ne pouvaient pas dormir non plus.',
      '« Nous devons lui faire un oreiller », dit le boulanger, et tous furent d’accord. Alors les tisserands tissèrent, les moutons donnèrent leur laine, les oies offrirent chaque plume douce, et les enfants cousirent, avec de grands points tordus et pleins d’amour, jusqu’à ce qu’un oreiller de la taille d’une grange repose sur la place du village.',
      'Mais comment le livrer ? Cinquante hommes ne pouvaient le soulever. Cent chevaux ne pouvaient le tirer. Alors la plus petite fille du village, Lotta, chuchota une idée : des ballons. Tout le monde gonfla tous les ballons du village, les attacha avec des rubans, et le grand oreiller monta doucement la colline en flottant.',
      'Gorm leva la tête, le vit, et fit le sourire le plus endormi de l’histoire des géants. Il s’allongea, s’enfonça dedans et soupira un soupir qui envoya une brise dans toute la vallée.',
    ],
    end: 'Il dormit trois jours, ronflant une berceuse que tout le village savait par cœur, et enfin tout le monde dormit avec lui.',
  },
  {
    title: 'La nuit où les étoiles dirent bonne nuit',
    body: [
      'Il y eut un jour une nuit si calme que les étoiles pouvaient entendre le monde respirer. Tout en bas, dans mille maisons, des enfants se retournaient, et les étoiles, qui regardaient chaque nuit sans jamais avoir été remerciées, sentirent un petit souhait timide monter en elles toutes à la fois.',
      'Elles voulaient dire bonne nuit. Alors, une à une, les étoiles se détachèrent du noir et commencèrent à descendre, lentes comme des flocons, brillant en venant. Elles se posèrent sur les toits et les cheminées, sur les portails des jardins, sur l’herbe humide et endormie, et le monde devint d’argent.',
      'Les dormeurs ne s’éveillèrent pas. Mais dans chaque rêve cette nuit-là, quelqu’un dit, très doucement : « Tu as bien fait aujourd’hui. » Un enfant qui avait peur d’un examen, une femme qui avait manqué son train, un vieil homme qui avait oublié un nom : tous l’entendirent, et tous sourirent.',
      'Puis, avec le premier fil pâle du matin, les étoiles remontèrent, une à une, à leur place, un peu plus ternes, un peu plus légères et tout à fait contentes.',
    ],
    end: 'Et si jamais tu t’éveilles la nuit en sentant que quelqu’un vient de te souhaiter du bien, tu as raison. C’est vrai. Bonne nuit, cher rêveur. Dors bien.',
  },
];

export default tales;
