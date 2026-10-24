import type { Tale } from './types';

/** Her yaştan okur için on yedi bağımsız uyku masalı. Her biri son satırdan önce biter. */
const tales: Tale[] = [
  {
    title: 'Deniz Feneri Kedisi',
    body: [
      'Eğri büğrü bir burnun ucunda bir deniz feneri vardı; fenerde yaşlı Anders ile kedisi Pepper otururdu. Anders her akşam doksan dokuz basamak çıkıp büyük lambayı yakardı, Pepper de kuyruğuyla basamakları sayarak arkasından çıkardı.',
      'Fırtınalı bir gece Anders öyle kötü üşüttü ki yataktan kalkamadı. “Lamba,” diye fısıldadı. “Gemiler.” Pepper karanlık pencereye baktı; dalgalar kayalara beyaz şapkalar fırlatıyordu.',
      'O sadece bir kediydi. Kibrit çakamazdı. Ama kibritlerin nerede durduğunu biliyordu, itilen bir kutunun düştüğünü ve düşen bir kibritin pürüzlü bir basamağa sürtülünce uyanabileceğini de. On bir denemesi ve bir yanık bıyığı aldı.',
      'Büyük lamba döndü. Işık suyun üzerinden süpürüldü ve açıkta yolunu kaybetmiş küçük bir balıkçı teknesi ışığı görüp yavaşça yön değiştirdi. Sabaha fırtına yorulmuştu. Tekne limanda güvendeydi; bütün köy fenerin altında durmuş, çok alçakgönüllü bir kediye el sallıyordu.',
    ],
    end: 'Anders iyileşti, gemiler eve döndü ve o günden beri lambayı iki kişi yakıyor; çünkü cesurlar her zaman uzun boylu olmaz.',
  },
  {
    title: 'Rüzgârı Ödünç Alan Kız',
    body: [
      'Ilse, havanın hiç kıpırdamadığı bir vadide yaşardı. Çamaşırlar dik asılır, uçurtmalar yere yatar, tepedeki yel değirmeni yüz yıldır dönmezdi. “Rüzgâr birilerinde olmalı,” dedi Ilse; bir kavanoz ve bir bisküvi alıp onu aramaya çıktı.',
      'Uyuyan çayırın yanından, sessiz köprünün üzerinden geçip büyük gri bir rüzgârın kedi gibi kıvrılıp yattığı bir dağ başına ulaştı. “Biraz ödünç alabilir miyim?” diye kibarca sordu. Rüzgâr bir gözünü açtı. “Kimse sormaz,” dedi. “Hep arkamdan koşarlar.”',
      'Böylece rüzgâr ona kendinden bir kavanoz verdi, kapaklı, tek şartla: bir sonraki dolunaya kadar geri getirecekti. Ilse eve koştu, kapağı değirmenin yanında açtı. Kanatlar gıcırdadı, savruldu, şarkı söyledi. Uçurtmalar fırladı. Çamaşırlar dans etti. Bütün vadi kahkaha attı.',
      'Ama ay yuvarlaklaşınca Ilse yine dağa çıktı. Vadi bağırdı: “Sende kalsın!” Ilse başını salladı. Söz sözdür, rüzgâra bile. Kavanozu yere koydu ve kapağı kaldırdı.',
    ],
    end: 'Güvenildiğine şaşıran rüzgâr vadiye kendi kendine esti ve o günden beri her akşam uğruyor.',
  },
  {
    title: 'Ninni Toplayan Ejderha',
    body: [
      'Bulutların çok yukarısında Fennel adında küçücük bir ejderha yaşardı. Ateş püskürtemiyordu, bundan utanıyordu; kimseyi korkutamıyordu, bundan daha da çok utanıyordu. Fennel’in yapabildiği şey dinlemekti.',
      'Köylerden yükselen ninnileri dinlerdi: annelerin mırıltısını, babaların ıslığını, ablaların sakar şarkılarını. Her birini bir cam şişeye hapsedip mağarasındaki rafa dizerdi. Çok geçmeden rafta yüz on bir ninni vardı.',
      'Bir gece korkunç bir kükreme dağları sarstı. Öfkeli ve uykusuz büyük bir fırtına ejderhası gelmişti; dinlenemediği için bütün vadiyi yakmak istiyordu. Herkes kaçtı. Fennel kaçmadı. Şişelerini indirdi ve teker teker açtı.',
      'Mağara yüz on bir yumuşak şarkıyla doldu. Şarkılar fırtına ejderhasını sıcak yün gibi sardı. Gözleri ağırlaştı. Kükremesi esnemeye, esnemesi horlamaya döndü; horlama o kadar huzurluydu ki baykuşlar bile dinlemek için durdu.',
    ],
    end: 'Sabah büyük ejderha küçüğe teşekkür etti ve Fennel, en sessiz armağanın bazen bir fırtınayı bile evcilleştirdiğini öğrendi.',
  },
  {
    title: 'Çocuk ve Ay’ın Merdiveni',
    body: [
      'Tobias’ın bir sorusu vardı ve soru odasına sığmayacak kadar büyüktü. Ay neden her gece onu eve kadar izliyordu? Bir akşam gökyüzüne üç kez vurdu ve şaşırarak gördü ki bulutlardan gümüş bir merdiven aşağı sarkıyor.',
      'Basamak basamak tırmandı; uyuyan kuşların, dolaşan uçurtmaların yanından geçti ve soluk tozdan sessiz bir tepede durdu. Orada Ay oturuyordu; yuvarlak, iyi kalpli, biraz yorgun. “Herkesi izlerim,” dedi Ay. “Biri karanlıkta eve tek başına yürümesin diye.”',
      'Tobias bunu düşündü. “Peki seninle kim yürüyor?” Ay uzun uzun ona baktı, çünkü bunu daha önce kimse sormamıştı. “Kimse,” dedi sonunda, “ama sorun değil. Bütün gökyüzü benim.”',
      'Tobias Ay’ın yanına oturdu; uykulu dünyanın aşağıda dönüşünü, her pencerenin küçük bir altın para gibi parlayışını izlediler. Ay’a bütün arkadaşlarının adını söyledi, Ay da ona yıldızların adlarını.',
    ],
    end: 'Aşağı indiğinde merdiven arkasından sarıldı; ve o günden sonra Tobias her gece penceresinden el salladı ki Ay, birinin onunla yürüdüğünü bilsin.',
  },
  {
    title: 'Tilki ile Saatçi',
    body: [
      'Karlı bir kasabada, dükkânı tik taklarla dolu bir saatçi yaşardı. Tik, tak, derdi büyük saatler. Tik-a-tik, diye karşılık verirdi küçükler. Dükkânın basamağının altında yaşayan genç bir tilki bu sesi çok severdi. Bir kış gecesi içeri süzülüp en küçük altın saati aldı; tik taklarını yalnızca kendine saklamak istiyordu.',
      'Ama çalıntı bir saat hüzünlü çalar. Tilkinin inde ses yalnız geliyordu, yuvasını özleyen bir kalp gibi; şafakta tilki uyuyamadı. Saati ağzında dükkâna geri sürünerek gitti. Saatçi onu bir fincan sıcak sütle bekliyordu.',
      '“En çok küçüğü kimin sevdiğini merak ediyordum,” dedi. Azarlamadı. Bunun yerine ona dişlileri, minik yayları, her parçanın bir sonrakini nasıl ittiğini gösterdi; tilki bir saatin, zamanı tutmak için birbirine yardım eden birçok küçük şey olduğunu anladı.',
      'Tilki bundan sonra her akşam geldi. Kuyruğuyla yeri süpürdü; saatçi de karşılığında ona saati okumayı öğretti.',
    ],
    end: 'Şimdi kasaba, dükkân basamağında bir tilki başını yana eğip her şeyin birlikte tik taklayışını dinlediğinde gece yarısı olduğunu anlıyor.',
  },
  {
    title: 'Marta ve Uğuldayan Dağ',
    body: [
      'Her gece köy sessizleşirken dağdan derin bir ses yuvarlanırdı: hmmmm. Neden olduğunu kimse bilmezdi. Kimi mağaradaki rüzgâr derdi, kimi horlayan bir dev. Yedi yaşındaki ve çok meraklı Marta bunu öğrenmeye karar verdi.',
      'Bir fener ve yün bir atkıyla tırmandı; ses gürleştikçe peşinden gitti ve kayada büyük bir taş kapıya ulaştı. Kapıyı çaldı. Uğultu kesildi. Çakıl ve bal gibi bir ses sordu: “Kim o?”',
      'Dağdı bu ve horlamıyordu. Şarkı söylüyordu; çünkü yıldızlar o kadar uzaktı ki dünyayı unutmalarından korkuyordu, ve şarkı o kadar uzağa yol alabilen tek şeydi. “Ama ben çok yaşlıyım,” dedi dağ, “sesim de kalınlaşıyor.”',
      'Marta’nın ince, parlak bir sesi vardı. Boğazını temizleyip tiz notaları söyledi, dağ da kalın notaları; birlikte ezgi yukarı, yukarı, bulutların ötesine, yıldızlara kadar yükseldi.',
    ],
    end: 'Yıldızlar bir kez, hep birlikte göz kırptı. O geceden beri köy iki şarkı duyuyor, biri derin biri küçük, ve çok güzel uyuyor.',
  },
  {
    title: 'Kütüphaneyi Ziyaret Eden Balina',
    body: [
      'Küçük liman kasabasının denize bakan yuvarlak pencereli bir kütüphanesi vardı. Yılın en büyük gelgit gecesinde bir balina kıyıya o kadar yaklaştı ki büyük gözü pencereyi tamamen doldurdu. Kütüphaneci Bayan Olsen kalemini düşürdü.',
      '“Rahatsız ettiğim için üzgünüm,” dedi balina, çello gibi bir sesle. “Bütün okyanusları yüzdüm, çok hikâye dinledim ama hiç okumadım.” Kitapların herkes için olduğuna inanan Bayan Olsen en büyük atlasını getirip cama tuttu.',
      'Bütün gece sayfa çevirip yüksek sesle okudu: balinanın yalnızca aşağıdan gördüğü dağları, hayal bile edemediği çölleri, bir balinayla tanışmak isteyen çocukları. Gelgit, bazen iyi bir nedenle olduğu gibi, yüksek kaldı.',
      'Şafakta balina teşekkür etti, Bayan Olsen de pencerenin hep açık kalacağına söz verdi. Balina da bir söz verdi.',
    ],
    end: 'Her yıl en yüksek gelgitte derinlerden yeni bir hikâyeyle dönüyor, bütün kasaba yuvarlak pencerenin yanında oturup dinliyor.',
  },
  {
    title: 'Kış Uykusuna Yatamayan Ayı',
    body: [
      'İlk kar yağdığında ormandaki bütün ayılar esnedi, kıvrıldı ve uyudu. Bruno hariç. O inde, gözü açık, tavandaki çatlakları sayarak yatıyordu ve gözlerini kapatmayı bir türlü başaramıyordu.',
      '“Bir şey eksik,” dedi Bruno ve aramak için beyaz sessizliğe çıktı. O da uyuyamayan bir tavşanla karşılaştı; soğuk kulaklarına işlemişti, Bruno ona sıcak yanını ödünç verdi. Yaprak yorganını kaybetmiş bir kirpiyle karşılaştı, ona yeni bir yorgan buldu.',
      'Gece sonunda Bruno koca bir topluluk toplamıştı: tavşan, kirpi, iki fare, çok yaşlı bir baykuş. Hepsi inine sığıştı ve Bruno birden neyin eksik olduğunu anladı. Uyku değildi. Arkadaşlıktı.',
      'Çevresinde bu kadar çok sıcak kalp atışıyla gözleri sonunda ağırlaştı. Tavşan burnunu tüylerine sokdu. Baykuş yavaş bir ezgi mırıldandı. Dışarıda kar yağdı yağdı, söz kadar yumuşak.',
    ],
    end: 'Bruno bütün kışı uyudu; baharda uyandığında bütün in onunla uyandı ve kimse bir daha yalnız kalmadı.',
  },
  {
    title: 'Rüya Terzisi',
    body: [
      'Kasabanın kenarında, bir dolaptan geniş olmayan bir evde, kıyafet dikmeyen bir terzi yaşardı. Rüya dikerdi. Gece yarısından şafağa kadar, gümüş bir iğne ve esnemelerden eğrilmiş iplikle çalışırdı; yaptığı rüyalar anahtar deliklerinden ihtiyacı olan herkese gönderilirdi.',
      'Bir gece saraydan bir not geldi. Kral yedi yıldır uyuyamıyordu. Krallığın en görkemli rüyasını istiyordu: bin şövalye, altın bir saray, sonsuza dek süren bir ziyafet.',
      'Terzi onu dikti, her altın ilmeğiyle; kral gördü ve eskisinden daha yorgun uyandı. “Çok gürültülü,” dedi. Terzi başka bir kumaş denedi. Küçük bir bahçe, eski bir bank, yağmur kokusu ve hiçbir şey söylemeyen bir dostun rüyasını dikti.',
      'Kral uykusunda ağladı; sessizce, uzun zamandır beklemiş bir şekilde. Uyandığında on yaş gençleşmiş gibiydi.',
    ],
    end: 'Terziye bir dağ altın ödedi, terzi de hepsini iplik almaya harcadı; çünkü en iyi rüyalar hep en sade olanlardır.',
  },
  {
    title: 'Kâğıt Geminin Uzun Yolculuğu',
    body: [
      'Leo eski bir gazete sayfasından bir gemi katladı ve evinin önündeki su birikintisine bıraktı. Çok küçük bir gemiydi, çok küçük bir bayrağı vardı ve su birikintilerinin maceraların başlangıcı olabileceğinden haberi yoktu.',
      'Çisenti birikintiyi şişirdi. Birikinti oluğa taştı, oluk dereye koştu, dere şırıldayarak bir ırmağa karıştı. Kâğıt gemi eğilip selam veren ördeklerin, şapka kaldıran bir balıkçının, çocukların alkışladığı bir köprünün yanından sallanarak geçti.',
      'Sonunda denizi gördü: uğuldayan büyük gri-mavi bir ova. Bir martı güvertesine kondu: “Nereye gidiyorsun?” Gemi bilmiyordu. Sadece gitmek istemişti. “O hâlde deniz fenerine git,” dedi martı. “Misafiri çok severler.”',
      'Sırılsıklam ama gururlu yoluna devam etti; bir akşam büyük bir dalga onu nazikçe kaldırıp bir kumsala bıraktı. Orada bir kız onu buldu, ateşin başında kuruttu ve penceresine iğneledi.',
    ],
    end: 'Çok uzakta Leo’ya bir şişede mektup geldi; kâğıt geminin kanadında şöyle yazıyordu: Yolculuk için teşekkürler.',
  },
  {
    title: 'Karanlıktan Korkan Baykuş',
    body: [
      'Hugo bir baykuştu; karanlıktan korkan biri için çok zor bir şey. Her akşam diğer baykuşlar kanatlarını açıp geceye seslenirken Hugo dalında sıkı sıkı tutunur, kocaman, yuvarlak bir kozalak gibi davranırdı.',
      'Bir gece yerden küçük bir ses yükseldi. “Affedersiniz, karanlıkta gören baykuş siz misiniz?” Küçük bir kirpiydi; kaybolmuş ve titriyordu. Hugo duraksadı. Karanlıkta görmüyordu. Ondan korkuyordu. Ama kirpi daha küçüktü.',
      '“Kuyruk tüylerime tutun,” dedi Hugo ve titreyerek siyahlığa bir adım attı. Şaşkınlıkla gördü ki karanlık hiç de boş değildi. Yumuşak şekillerle doluydu: derenin gümüş çizgisi, bir güvenin soluk feneri, uyuyan büyük dost hayvanlar gibi yatan tepelerin omuzları.',
      'Bütün ormanı böyle geçtiler; baykuş yol gösterdi, kirpi kıkırdadı; sonunda kirpinin küçük evi köklerin arasında, penceresinde ışıkla göründü.',
    ],
    end: 'Hugo yıldızların altında eve uçtu ve karanlığın hiç de bir canavar olmadığını gördü. Sadece çok büyük bir battaniyeydi ve onu hep örtmüştü.',
  },
  {
    title: 'Kar Midillisinin Baharı',
    body: [
      'Kuzeyin en uzak, en beyaz köşesinde kış fazla kalmıştı. Kar derindi, nehirler buzun altında uyuyordu, köylüler yeşil rengini unutmaya başlamıştı. Ama vadide bulut kadar kalın yeleli bir kar midillisi yaşıyordu ve midilli hatırlıyordu.',
      'Karın altında tohumların uyuduğunu, birinin zamanın geldiğini söylemesini beklediğini hatırlıyordu. Bu yüzden donmuş tarlalarda tırısla gitti; her adımda yelesini silkti ve yelesinden orada sakladığı son güz güneşinin sıcak, minik kıvılcımları döküldü.',
      'Her kıvılcımın düştüğü yerde kar küçük, yuvarlak bir çukura çöktü ve her çukurda mavi bir çiçek başını uzattı. Bir, sonra on, sonra yüz; tâ ki bütün vadi gökyüzü gelip içine uzanmış gibi görününceye dek.',
      'Köylüler eldivenleriyle dışarı çıktı, gözlerini ovuşturdu. Nehirler uyandı ve acele etmeye başladı. Bunca sabırla bekleyen kuşlar büyük bir kanat gürültüsüyle döndü.',
    ],
    end: 'Akşama midillinin yelesi gri ve çıplaktı ama kışa kadar uzadı; ve her yıl güneşi yeniden saklıyor, her ihtimale karşı.',
  },
  {
    title: 'Bir Köşesi Boş Harita',
    body: [
      'Nora büyükannesinin haritasını miras almıştı ve bu dünyanın en güzel haritasıydı. Ormanları, adaları, Devedikeni ve Kuzukulağı gibi adlı nehirleri, hatta küçük mor bir denizi gösteriyordu. Ama bir köşede hiçbir şeyin çizilmediği boş bir yer vardı.',
      'Bir pusula, bir kaşık ve bir torba yulaf bisküvisiyle onu doldurmaya çıktı. Devedikeni’ni ödünç bir kayıkla geçti. Eğri Tepeler’e tırmandı ve eğrelti otlarından bir çatı altında uyudu. Konuşan bir balıkçıl, uykulu bir haritacı ve gezgin bir kukla topluluğuyla arkadaş oldu.',
      'Adım adım boş köşe yaklaştı; Nora tam kenarına varınca şaşırarak bir çitin içinde küçük yeşil bir kapı buldu, paspasında HOŞ GELDİN yazıyordu. Kapıyı çaldı ve kapıyı büyükannesi açtı.',
      '“O köşeyi bilerek boş bıraktım,” dedi büyükannesi gülerek ve çaydanlığı ocağa koydu. “Her iyi haritanın eklenecek bir yere ihtiyacı vardır. Onu sana saklıyordum.”',
    ],
    end: 'Nora kapıyı, çiti ve çaydanlığı çizdi ve en güzel yolculukların tam birinin lambayı yanık bıraktığı yerde bittiğini anladı.',
  },
  {
    title: 'Şarkı Söyleyen Taş',
    body: [
      'Berrak bir nehrin dibinde yumurtadan büyük olmayan gri bir taş yatardı; onu kimse fark etmemişti. Balıklar üzerinden geçerdi. Ördekler yukarıda yüzerdi. Ama her gece nehir sessizleşince taş çok yumuşak bir sesle doğduğu dağın şarkısını söylemeye başlardı.',
      'Bir sabah Kai adında küçük bir çocuk dedesiyle balık tutarken şarkıyı duydu. Dizlerine kadar suya girdi ve taşı çıkardı. Sıcaktı. Kulağına tuttu ve bütün dağı duydu: rüzgârı, eriyen karı, kayanın uzun, yavaş, sabırlı kalp atışını.',
      'Onu eve götürüp pencere pervazına koydu ve şarkı odasını doldurdu; o kadar güzeldi ki dinlemeyi bırakamadı. Ama sabaha taş daha sessizdi, akşama neredeyse suskundu.',
      'Kai anladı. Bir şarkının nehre ihtiyacı vardı. Bu yüzden ağır bir kalple ve çok dikkatli bir elle taşı geri götürüp tam olduğu yere koydu.',
    ],
    end: 'Nehir üzerinden aktı, taş her zamankinden yüksek sesle şarkı söyledi; o günden sonra Kai’nin bir dosta kulak vermek için sadece kulağını suya yaklaştırması yetti.',
  },
  {
    title: 'Minik Halkın Fener Şenliği',
    body: [
      'Yüz yılda bir, kocaman bir meşenin köklerinde Minik Halk Fener Şenliği’ni kutlar. Yüksükten büyük değildirler; bu yüzden her fener, çiy damlasından bir çan içinde parlayan bir ateş böceğidir ve binlercesi aynı anda yukarı doğru yağan altın bir kar gibi yükselir.',
      'Bu yıl Pip adında minik bir kızın sorunu vardı. Ateş böceği yoktu. Hepsini daha büyük, daha çevik olanlar almıştı; kalabalığın en arkasında boş bir çiy damlasıyla ve titreyen dudağıyla duruyordu. “Boş ver,” dedi bir salyangoz nazikçe, “benim sırtıma binebilirsin.”',
      'Şenlik göğe yükselirken Pip bir şey fark etti. Meşenin gölgesinin en ucunda küçük bir ışıkböceği ağlıyordu; ışıkböcekleri uçamaz, bu yüzden hiç davet edilmez. Pip küçük çiy damlasını aldı, ışıkböceğini içine koyup yukarı kaldırdı.',
      'En parlak fenerdi; ışığı daha büyük olduğu için değil, paylaşıldığı için. Bütün şenlik dönüp baktı ve Minik Halk’ın en yaşlısı eğildi.',
    ],
    end: 'O günden sonra her fener şenliğinde ilk ışığı, hiç ışığı olmadığını sanan biri yakıyor.',
  },
  {
    title: 'Uykulu Devin Yastığı',
    body: [
      'Dev Gorm köyün üstündeki tepede yaşardı ve kırk gecedir uyuyamamıştı, çünkü yastığı bir kaya parçasıydı. Her döndüğünde dağlar homurdanır, her iç çektiğinde çatılar tıngırdardı. Köylüler de uyuyamıyordu.',
      '“Ona bir yastık yapmalıyız,” dedi fırıncı ve herkes kabul etti. Dokumacılar doku, koyunlar yünlerini verdi, kazlar bütün yumuşak tüylerini bağışladı, çocuklar büyük, eğri, sevgi dolu dikişlerle diktiler; sonunda köy meydanında ahır büyüklüğünde bir yastık yatıyordu.',
      'Ama onu nasıl götüreceklerdi? Elli adam kaldıramadı. Yüz at çekemedi. O zaman köyün en küçük kızı Lotta bir fikir fısıldadı: balonlar. Herkes köydeki bütün balonları şişirdi, kurdelelerle bağladı ve büyük yastık yumuşakça tepeye süzüldü.',
      'Gorm başını kaldırdı, yastığı gördü ve devler tarihinin en uykulu gülümsemesini verdi. Uzandı, içine battı ve bütün vadiye esinti yollayan bir iç çekiş çekti.',
    ],
    end: 'Üç gün uyudu; bütün köyün ezbere bildiği bir ninniyle horladı ve herkes sonunda onunla birlikte uyudu.',
  },
  {
    title: 'Yıldızların İyi Geceler Dediği Gece',
    body: [
      'Bir zamanlar öyle sakin bir gece vardı ki yıldızlar dünyanın nefes alışını duyabiliyordu. Çok aşağıda, binlerce evde çocuklar uykularında dönüyordu; her gece izleyip bir kez bile teşekkür edilmemiş yıldızlar hep birlikte içlerinde küçük, utangaç bir dilek yükseldiğini hissetti.',
      'İyi geceler demek istediler. Bu yüzden yıldızlar tek tek karanlıktan çözülüp kar taneleri gibi yavaş, parlayarak aşağı süzülmeye başladı. Çatılara ve bacalara, bahçe kapılarına, nemli uykulu çimene kondular ve dünya gümüşe döndü.',
      'Uyuyanlar uyanmadı. Ama o gece her rüyada biri çok nazikçe şöyle dedi: “Bugün iyi iş çıkardın.” Sınavdan korkan bir çocuk, treni kaçıran bir kadın, bir ismi unutmuş yaşlı bir adam: her biri bunu duydu ve her biri gülümsedi.',
      'Sonra sabahın ilk solgun ipliğiyle yıldızlar, tek tek, biraz daha sönük, biraz daha hafif ve çok memnun, yerlerine döndü.',
    ],
    end: 'Eğer bir gece uyanıp birinin sana iyilik dilediğini hissedersen, haklısın. Dilediler. İyi geceler, sevgili hayalperest. İyi uykular.',
  },
];

export default tales;
