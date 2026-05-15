# Sökfunktionalitet - Boozt-inspirerad

## Översikt
Sökfunktionen har uppdaterats för att efterlikna Boozt's sökupplevelse med förbättrad funktionalitet för både desktop och mobil.

## Funktioner

### Desktop-sökning
- **Expanderande sökfält**: Sökfältet i headern expanderar med en dropdown när användaren fokuserar
- **Autocomplete**: Realtidsförslag baserat på produktnamn och kategorier
- **Senaste sökningar**: Visar de 5 senaste sökningarna (sparas i localStorage)
- **Populära sökningar**: Fördefinierade populära söktermer som snabbknappar
- **Kategorisnabbval**: Snabb åtkomst till produktkategorier direkt från sökningen
- **Klicka utanför för att stänga**: Dropdown stängs automatiskt när användaren klickar utanför

### Mobil-sökning
- **Fullskärmsoverlay**: Sökningen öppnas i ett fullskärmsläge för bättre fokus
- **Touch-optimerad**: Större knappar och bättre spacing för touch-interaktion
- **Samma funktioner som desktop**: Autocomplete, senaste sökningar, populära sökningar och kategorier
- **Rensa-knapp**: Enkel X-knapp för att rensa sökfältet
- **Stäng-knapp**: Tydlig stäng-knapp för att återgå till huvudvyn

## Komponenter

### Header.tsx
Huvudkomponenten som innehåller sökfunktionaliteten:
- Desktop: Integrerad i headern med expanderande dropdown
- Mobil: Öppnas som fullskärmsmodal

### SmartSearch.tsx
Fristående sökkomponent med samma funktionalitet som kan användas på andra sidor.

## Tekniska detaljer

### State Management
- `searchQuery`: Aktuell sökfråga (från SearchContext)
- `searchSuggestions`: Dynamiska förslag baserat på produkter
- `recentSearches`: Senaste sökningar (localStorage)
- `isSearchFocused`: Desktop dropdown-synlighet
- `isSearchOpen`: Mobil modal-synlighet

### LocalStorage
Senaste sökningar sparas i localStorage med nyckeln:
- Header: `recentSearches`
- SmartSearch: `smartSearchRecent`

### Autocomplete-logik
Förslag genereras genom att matcha sökfrågan mot:
1. Produktnamn
2. Kategorier

Maximalt 6-8 förslag visas beroende på komponent.

## Design
- **Vit bakgrund**: Behåller den rena, vita designen
- **Grå accenter**: Subtila grå färger för borders och hover-states
- **Svarta knappar**: Primära åtgärdsknappar i svart (#000)
- **Ikoner**: Tydliga ikoner för sök, klocka (senaste), och pil (navigation)

## Användning

### Desktop
1. Klicka i sökfältet eller börja skriva
2. Dropdown expanderar automatiskt
3. Välj från förslag, senaste sökningar eller kategorier
4. Tryck Enter eller klicka på sökknappen

### Mobil
1. Klicka på sökikonen i headern
2. Fullskärmsmodal öppnas
3. Börja skriva för förslag
4. Välj från förslag eller använd snabbval
5. Stäng med X-knappen eller genom att välja en sökning

## Framtida förbättringar
- Produktbilder i autocomplete-förslag
- Sökhistorik synkroniserad med användarkonto
- Trendande sökningar baserat på analytics
- Visuell sökning (bildsökning)
- Röstbaserad sökning
- Filtrering direkt i sökdropdown
