### Krok 7: Współczynniki

Przyszedł czas określenia współczynników postaci. Wszyscy humanoidalni Bohaterowie mają 8 współczynników, które należy wpisać w kartę postaci. Wszystkie współczynniki zależą od wartości atrybutów postaci, jej zdolności i cech. Na początku należy określić wartość punktów życia postaci. W tym celu należy wartość kondycji pomnożyć razy dwa i dodać dziesięć (Ko x2 +10). Wartość ta informuje ilu obrażeń może doznać postać przed śmiercią. Spadek aktualnych punktów życia do zera oznacza śmierć. Następnie należy określić wartość punktów many mnożąc wartość inteligencji razy dwa i dodać dziesięć (In x2 +10). Mana odpowiada za magiczny potencjał postaci. Im więcej postać ma many, tym z większej ilości magicznych przedmiotów będzie mogła korzystać i tym więcej będzie mogła rzucać zaklęć. Zarówno stracone punkty życia, jak i many odnawiają się postaci. Każdy Bohater może się poruszać, a szybkość jego ruchu określa wartość szybkości. Aby ją określić należy podzielić wartość zręczności na dwa. Dzieląc wartość siły na dwa uzyska się wartość udźwigu postaci, który informuje o tym ile postać jest w stanie nieść kilogramów bez żadnych kar za przeciążenie. Do obciążenia postaci nie należy wliczać wagi jej tuszy/ciała, ani tego co się wewnątrz niego mieści (np. posiłek, czy zawartość butelki wina). Wartość udźwigu można przekroczyć wielokrotnie, a wtedy kary za przeciążenie będę odpowiednio większe. Każda walcząca postać powinna zadbać o to, aby wartość jej wytrwałości była odpowiednio wysoka. Wartość tę uzyskuje się dzieląc wartość kondycji na dwa. Jeżeli postać otrzyma ilość obrażeń równą lub większą od wartość wytrwałości, to będzie oznaczało, że została ona poważnie zraniona i zacznie się krwawienie, które niepowstrzymane może doprowadzić do śmierci postaci. W mechanice mamy również do czynienia z dwiema obronami: fizyczna, która stanowi ST trafienia postaci, gdy ta jest przygotowana na atak. Jej wartość określa się przez dodanie do wartości refleksu liczby 10. Druga obrona to obrona magiczna, która stanowi Stopień Trudności zaczarowania postaci. Jej wartość określa się przez dodanie do wartości woli liczby 10. Istnieje jednak jeszcze jeden współczynnik, który jest dostępny tylko dla Bohaterów, ich Arcywrogów i potężnych istot. Przeciętny śmiertelnik nie posiada tego współczynnika i dlatego jest przeciętnym śmiertelnikiem. Mowa tu o szczęściu. Wartość szczęścia powstaje z dodania liczby 10 do  wartości charyzmy. Tyle też punktów szczęścia postać będzie miała rozpoczynając przygody. Bohater będzie mógł wydawać te punkty, aby w newralgicznych momentach zwiększyć swą moc i szansę przeżycia. Niestety punkty szczęścia same się nie odnawiają - trzeba na ich zwrócenie zapracować. 

Minimalna wartość współczynnika
: Szybkość, udźwig i wytrwałość nie mogą być mniejsze niż 5 wskutek niskiej wartości atrybutów. Mana i życie nie mogą być mniejsze niż 30 wskutek niskiej wartości atrybutu, a obrona fizyczna, obrona magiczna i szczęście nie mogą być mniejsze niż 20 wskutek niskiej wartości atrybutu. Jest to pokłosie minimalnego przełożenia atrybutu na współczynniki. Nawet, gdy jakiś atrybut ma wartość niższą, niż 10, to należy na potrzeby obliczania współczynnika o niego opartego przyjmować, że jego wartość wynosi 10. Efektem tego jest to, że postać może mieć co najwyżej wyższe wartości współczynników, przy wyższych wartościach atrybutów.

Do tego kroku należy powrócić jeszcze później, gdyż na współczynniki wpływ mają zdolności i różnego rodzaju cechy, a aktualne punkty szczęścia mogą zostać obniżone przy rozpoczęciu przygód (np. wydając je na ekwipunek lub wymieniając na doświadczenie).

<table>
	<caption>Przełożenie wartości atrybutu na wartość współczynnika</caption>
	<thead>
		<tr>
			<th>Wartość atrybutu</th>
			<th>Mana i życie</th>
			<th>Szyb., udźwig i wytr.</th>
			<th>Szczęście, obrona fiz. i mag.</th>
		</tr>
	</thead>
	<script>
		document.write('<tbody>');
		for (var i = 1; i <= 30; ++i) {	
			document.write('<tr>');
			document.write('<td>' + i + '</td>');
			document.write('<td>' + Math.max(30, ((i - 10) * 2) + 30) + '</td>');
			document.write('<td>' + Math.max(5, Math.ceil(i / 2)) + '</td>');
			document.write('<td>' + Math.max(20, i + 10) + '</td>');
			document.write('</tr>');
		}
		document.write('</tbody>');
	</script>
</table>