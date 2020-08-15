### Ruch, podróżowanie i dźwiganie

To jak szybko się postać porusza zależy od jej współczynnika szybkości, a to ile jest w stanie udźwignąć zależy od jej współczynnika udźwigu.

Szybkość
: 1/2 Zręczności - Określa zasięg w metrach na jaki postać może się poruszyć. Patrz także: Ruch w rozdziale Walka.

Udźwig
: 1/2 Siły - Określa jaki ciężar może nieść postać, bez konsekwencji przeciążania się.

#### Podróżowanie

Miast w perspektywie minut i godzin można liczyć pokonany przez postacie dystans w perspektywie dni. Najwygodniej liczyć tak dystans, gdy postać przez dłuższy czas podróżuje i nie ma potrzeby wskazywania bardzo dokładnych pokonanych dystansów.

Podróżowanie zajmuje cały dzień, lecz samo przemieszczanie trwa sumarycznie ok. 10 godzin w ciągu doby. Pozostałe 14 godzin postacie poświęcają na przygotowywanie posiłków, rozbijanie obozowisk, sen, przerwy w trasie dla wypoczynku etc.

Pokonany dystans zależy od szybkości postaci (w grupie określa to szybkość najwolniejszej postaci), a jeżeli postacie podróżują nie na własnych nogach to szybkość transportu (np. statku, koni etc.).

<table>
	<caption>Przełożenie szybkości na zasięg podróży</caption>
	<thead>
		<tr>
			<th>Szybkość</th>
			<th>Pokonany dystans w ciągu doby</th>
			<th>Dodatkowy dystans</th>
		</tr>
	</thead>
	<script>
		document.write('<tbody>');
		for (var i = 1; i <= 15; ++i) {
			document.write('<tr>');
			document.write('<td>' + ((i * 2) - 1) + '-' + (i * 2) + '</td>');
			document.write('<td>' + (i * 8) + 'km</td>');
			document.write('<td>+ ' + i + 'km</td>');
			document.write('</tr>');
		}
		document.write('<tbody>');
	</script>
</table>

Postać może pokonać dodatkowy dystans w ciągu doby, który jest efektem tego, że mniej czasu poświęcono na odpoczynek, a więcej na przemieszczanie się. W ekstremalnych sytuacjach postacie mogą podróżować 24 godziny bez przerwy, a nawet więcej. Wymaga to jednak zdawania coraz trudniejszego testu wysiłku. Pierwszy o ST=25, a każdy kolejny o +5 większy względem poprzedniego. Każda porażka oznacza otrzymanie przez postać 2 punktów wyczerpania i 1k4 punktów obrażeń (nie powodują one ran).

Poza tym na realnie pokonany dystans wpływa teren po którym się podróżuje. Powyższa tabelka przedstawia wyidealizowany sposób poruszania się po płaskiej trakcie ciągnącym się po równinie. Realny dzienny zasięg w zależności od trudniejszych tras może tylko zmaleć. W poniższej tabelce po lewej stronie wskazano rodzaj terenu, a w rubrykach obok trzy rodzaje drogi po której podróżuje postać. Trakt to wybrukowana lub w inny sposób utwardzona droga. Szlak jest drogą piaszczystą lub tylko wydeptaną, a bezdroża oznaczają brak drogi. W zależności od drogi na danym terytorium postać zmniejsza realnie pokonany odcinek o podaną wartość procentową.

#### Ruch w walce

Ten rodzaj ruchu określa ilość uwagi podczas tury, którą postać poświęca na przemieszczanie się. Z zasady każdy ruch w czasie walki jest dość gwałtowny i można go porównać raczej z bieganiem, niż chodzeniem. Na każdy taki ruch postać musi poświęcić odpowiednią ilość akcji.

[Zależność dystansu ruchu od kosztów akcji]
| Dystans       | Koszt akcji  | Dodatkowe informacje |
| ------------- | ------------ | :------------------- |
| 1 m           | Darmowa      | Postać przysługuje tylko jedna taka akcja w turze i może skorzystać z niej tylko, gdy w swej turze nie wykonuje innego rodzaju ruchu (wskazanego w tej tabeli) |
| 1/2 szybkości | Dodatkowa    | Postać porusza się na zasięg 1/2 szybkości |
| Szybkość      | Zwykła       | Postać porusza się na zasięg swej szybkości |
| x3 szybkości  | Dwie zwykłe  | Postać porusza się na zasięg swej szybkości x3. Do swej kolejnej tury otrzymuje modyfikator^1^ do obrony fizycznej równy wartości swej szybkości |
| x6 szybkości  | Cało-rundowa | Postać porusza się na zasięg swej szybkości x6. Do swej kolejnej tury otrzymuje modyfikator do obrony fizycznej równy wartości swej szybkości x2 |

^1^ Modyfikator nie działa względem ataków przeciwników do których zbliża się postać w linii prostej lub względnie prostej. {.table-footnotes}

#### Ruch specjalny

Postać prócz podróżowania, poruszania się po okolicy i w walce może skorzystać z kilku specjalnych sposobów poruszania się.

Ostrożny ruch
: Ostrożny ruch, to taki, który wymaga od postaci specjalnego skupienia się na rzeczach, które bezpośrednio nie dotyczą poruszania się. Wykonuje się ten ruch w okolicznościach, które wymagają od postaci zmniejszenia swej szybkości o połowę (patrz tabelka "Zasięg postaci niezwiązanej walką dla ostrożnego ruchu i marszu w metrach" w tym podrozdziale), a są to między innymi: skradanie się, zachowywanie równowagi, maskowanie śladów, tropienie etc.

Pływanie
: Postać może płynąć na wodzie lub pod wodą, a w zależności od tego ile akcji na to poświęci pokonuje odpowiedni dystans.

[Normalny dystans jaki może pokonać postać płynąc]
| Dystans       | Koszt akcji  |
| ------------- | ------------ |
| 1/4 szybkości | Zwykła       |
| 1/2 szybkości | Dwie zwykłe  |
| Szybkość      | Cało-rundowa |

Postać płynąca w sposób normalny pokonuje dystans równy swojej szybkości w ciągu 6 sekund. Dzięki umiejętności można przyśpieszyć ten sposób poruszania się.

Skakanie
: Jeżeli postać się odpowiednio rozpędzi, to może skoczyć w dal na tyle metrów ile wynosi jej 1/2 szybkość. W wzwyż postać może skoczyć na tyle ile wynosi 1/5 jej szybkości. Dzięki akrobatyce można zwiększyć te długości i wysokości. Skakanie należy liczyć jako część ruchu w walce tj. poświęcić na niego tyle akcji ile poświęca się na ruch, którego skakanie jest częścią. Patrz również akrobatyka.

Wspinaczka
: Wdrapywanie się po stromych zboczach, wchodzenie po linie itp. Z zasady każda postać, która potrafi chodzić potrafi się również wspinać. Postać w ciągu 6 sekund wspina się na wysokość równą 1/4 szybkości (w metrach). W przypadku walki wspinanie się wymaga poświęcenia akcji cało-rundowych. Postać może jednak dzięki umiejętności wysportowania przyśpieszyć ten sposób poruszania się.

#### Udźwig

Udźwig wyznacza limit ciężaru jaki może nieść postać. Im większe obciążenie postaci, tym większe kary za przekroczenie udźwigu ponosi.

#### Przeciążenie

Postać może dźwigać ciężar o wadze równej wartości swego udźwigu w kilogramach bez żadnych kar. Przekroczenie dopuszczalnego udźwigu o 1 kg lub o każdą kolejną wartość udźwigu powoduje kary. W poniższej tabelce podano efekty przeciążenia.

[Udźwig i przeciążenie]
| Obciążenie              | -- Efekt przeciążenia --                                                 ||||
| ^^                      | Re i Zr | Obrona fizyczna  | Szybkość     | Specjalne                       |
| ----------------------- | ------- | ---------------- | ------------ | :------------------------------ |
| Udźwig                  | n/d     | n/d              | n/d          | n/d                             |
| x2 udźwigu              |  -1     |  -1              | n/d          | n/d                             |
| x3 udźwigu              |  -2     |  -2              | -1           | Powstawanie: +1 akcja dodatkowa |
| x4 udźwigu              |  -6     |  -6              | -3           | Powstawanie: +1 akcja zwykła    |
| x5 udźwigu              | -10     | -10              | Połowa*      | Powstawanie: akcja cało-rundowa |
| x10 udźwigu             | Porażka | Nieprzy-gotowany | Szybkość = 1 | Na ziemi                        |
| większy niż x10 udźwigu | Porażka | Bezradny         | 0            | Upadek                          |

Obciążenie
: W tej kolumnie wskazano w kilogramach jakie maksymalne obciążenie będzie powodowało dane efekty. Jeżeli postać ma takie obciążenie ile wynosi jej udźwig, to nie ponosi żadnych kar. Jeżeli więc przyjmie ona dodatkowo jeden lub więcej kilogramów obciążenia, wtedy zacznie odczuwać tego efekty.

Re i Zr
: W tej kolumnie wskazano kary do wszystkich testów atrybutów refleksu i zręczności, które ponosi postać o takim przeciążeniu. Przy obciążeniu x10 udźwig  postać ponosi automatyczną porażkę w teście (co ewentualnie można zamienić na karę -100 w specjalnych wypadkach). Trzeba pamiętać, że kary do testów atrybutów odbijają się również na wynikach testów umiejętności postaci. Kolejne wartości kar zastępują się, a nie sumują.

Obrona fizyczna
: Przeciążenie powoduje, że postać traci swoją obronę fizyczną i łatwiej jest ją trafić. Po zastosowaniu kar z przeciążenia postać nie może mieć wartości obrony fizycznej poniżej wartości wariantu: nieprzygotowany. Przeciążona postać w stopniu większym niż x10 udźwig jest tak obładowana, że pod wpływem ciężaru upada i staje się bezradna do czasu wygrzebania się spod przywalającego ją ciężaru (testami krzepy).

Szybkość
: Przeciążenie spowalnia postać przez to ta wolniej się porusza. Kara do szybkości nie może obniżyć szybkości do 0, chyba że przeciążenie wynosi więcej jak x10 udźwig, gdyż wtedy pod wpływem ciężaru postać upada i jedyne co może robić, to próbować wygrzebać się spod ciężaru. Poza tym między obciążeniem równym x3 udźwig, a x4 udźwig maksymalna kara do szybkości postaci nie może sprawić, że straci ona ponad połowę swojej szybkości. Gdy zaś udźwig postaci wyniesie x10 udźwig, to szybkość postaci zostanie zredukowana do 1. Jeżeli szybkość postaci wynosi normalnie 0, to niezależnie od kary do szybkości będzie ona tyle wynosiła.

Specjalne
: Gdy obciążenie postaci zrówna się z wartością x3 udźwig, to postać będzie musiała poświęcić na powstanie akcję dodatkową, prócz tych, które normalnie musi wydać, aby powstać. Przy obciążeniu równym x4 udźwig postać powstanie, gdy wykorzysta na to poza normalnymi akcjami jeszcze akcję zwykłą. Gdy przeciążenie zrówna się z x5 udźwig, to postać ta będzie mogła powstać w akcji cało-rundowej, a przy przeciążeniu równym x10 udźwig nie będzie mogła powstać z ziemi z takim obciążeniem, a przyjąć je na siebie i funkcjonować przy karach będzie mogła dopiero wtedy, gdy wstanie i weźmie ciężar stojąc tj. może go dźwigać, ale nie może z nimi powstawać z ziemi. Postać mająca na sobie obciążenie ponad limit upada wskutek przeciążenia i musi wygrzebać się spod ładunku, aby wstać.

Zniwelowanie efektów przeciążenia
: Postać może zniwelować efekt przeciążenia na czas 1 rundy, ale w konsekwencji tego zużyje więcej energii, co zaowocuje otrzymaniem punktów zmęczenia. Postać może w ten sposób zniwelować efekty przeciążenia nie większe, niż gdy dźwiga ciężar o wadze: x5 udźwig. Koszt zniwelowania efektów przeciążenia jest równy karze do refleksu i zręczności, którą normalnie otrzymałaby postać mająca takiej wielkości przeciążenie.

[Koszt zniwelowania przeciążenia na 1 rundę]
| Przeciążenia równe | Punkty zmęczenia |
| ------------------ | ---------------- |
| x2 udźwig          | 1                |
| x3 udźwig          | 2                |
| x4 udźwig          | 6                |
| x5 udźwig          | 10               |