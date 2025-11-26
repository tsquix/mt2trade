# 🤖 CodeReviewAgent - Dokumentacja

## Opis

**CodeReviewAgent** to zaawansowany agent AI do automatycznego code review, zbudowany z użyciem Anthropic Claude API (model Claude 3.5 Sonnet). Agent przeprowadza kompleksową analizę kodu, wykrywając błędy, anty-patterny, problemy z wydajnością i proponując konkretne poprawki.

## Cechy

✨ **Kompleksowa analiza:**
- Wykrywanie błędów i luk bezpieczeństwa
- Identyfikacja anty-patternów
- Propozycje optymalizacji wydajności
- Sugestie refaktoryzacji
- Konkretne fragmenty kodu do poprawy
- Propozycje testów
- Ocena dokumentacji
- Opcjonalnie: zrefaktoryzowana wersja pliku

🎨 **Ładne formatowanie:**
- Kolorowy output w terminalu
- Przejrzysta struktura raportu
- Podświetlanie bloków kodu
- Oznaczanie poziomów krytyczności (CRITICAL/HIGH/MEDIUM/LOW)

⚡ **Wydajność:**
- Model Claude 3.5 Sonnet (najnowszy)
- Maksymalnie 8192 tokeny w odpowiedzi
- Niska temperatura (0.2) dla deterministycznych wyników

## Instalacja

### 1. Zainstaluj zależności

```bash
npm install
```

To zainstaluje:
- `@anthropic-ai/sdk` - oficjalny SDK Anthropic
- `dotenv` - zarządzanie zmiennymi środowiskowymi

### 2. Skonfiguruj klucz API

Skopiuj plik `.env.example` do `.env`:

```bash
cp .env.example .env
```

Dodaj swój klucz API Anthropic do pliku `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-api-key-here
```

Możesz uzyskać klucz API na: https://console.anthropic.com/

## Użycie

### Podstawowe użycie

```bash
node review-agent.js <ścieżka-do-pliku>
```

### Przykłady

```bash
# Review pliku API
node review-agent.js src/pages/api/offer.js

# Review modelu Mongoose
node review-agent.js models/User.ts

# Review utility
node review-agent.js lib/mongoose.js

# Review komponentu React
node review-agent.js src/components/Layout.js

# Użycie przez npm script
npm run review src/pages/api/buyOrder.js
```

### Pomoc

Uruchom bez argumentów aby zobaczyć pomoc:

```bash
node review-agent.js
```

## Obsługiwane języki

Agent automatycznie rozpoznaje język na podstawie rozszerzenia pliku:

- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- Python (`.py`)
- Java (`.java`)
- Go (`.go`)
- Rust (`.rs`)
- C/C++ (`.c`, `.cpp`)
- C# (`.cs`)
- Ruby (`.rb`)
- PHP (`.php`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- Scala (`.scala`)

## Struktura raportu

Agent generuje raport w 8 sekcjach:

### 1. BŁĘDY I RYZYKA
- Potencjalne błędy
- Luki bezpieczeństwa (XSS, SQL injection, CSRF, itp.)
- Race conditions
- Memory leaks
- Null pointer errors
- Poziom krytyczności dla każdego problemu

### 2. ANTY-PATTERNY
- Code smells
- Złe praktyki projektowe
- Naruszenia zasad SOLID
- Problemy z czytelnością
- Nadmierna złożoność

### 3. OPTYMALIZACJE WYDAJNOŚCI
- Złożoność algorytmiczna (Big O)
- Optymalizacje bazy danych
- Caching
- Redukcja alokacji pamięci
- Lazy loading / code splitting

### 4. REFAKTORYZACJA
- Lepsze nazewnictwo
- Ekstrakcja funkcji/komponentów
- Redukcja duplikacji (DRY)
- Design patterns
- Separation of concerns

### 5. KONKRETNE FRAGMENTY DO POPRAWY
- Oryginalny kod z numerami linii
- Wyjaśnienie problemu
- Poprawiona wersja
- Uzasadnienie zmian

### 6. TESTY
- Propozycje unit testów
- Wykryte edge cases
- Coverage gaps

### 7. DOKUMENTACJA
- Ocena jakości dokumentacji
- Brakujące komentarze
- JSDoc/TSDoc completeness

### 8. ZREFAKTORYZOWANA WERSJA (OPCJONALNIE)
- Kompletnie zrefaktoryzowana wersja pliku
- Komentarze wyjaśniające zmiany

## Przykładowy output

```
═══════════════════════════════════════════════════════════════════════════════
  🤖 CODE REVIEW AGENT
═══════════════════════════════════════════════════════════════════════════════

ℹ Wczytuję plik...
✓ Wczytano plik: src/pages/api/offer.js
ℹ Przeprowadzam analizę kodu...
ℹ To może chwilę potrwać...
✓ Analiza zakończona

═══════════════════════════════════════════════════════════════════════════════
  📋 RAPORT CODE REVIEW
═══════════════════════════════════════════════════════════════════════════════

Plik: src/pages/api/offer.js
Linie kodu: 150
Rozmiar: 4.52 KB

────────────────────────────────────────────────────────────────────────────────
  WYNIKI ANALIZY
────────────────────────────────────────────────────────────────────────────────

1. BŁĘDY I RYZYKA
────────────────────────────────────────────────────────────────────────────────

  - Linia 23: Brak walidacji parametru userId - MEDIUM
  - Linia 45: Możliwa NoSQL injection - HIGH
  - Linia 78: Brak obsługi błędów MongoDB - CRITICAL

[... więcej wyników ...]

✨ REVIEW ZAKOŃCZONY
✓ Czas wykonania: 12.34s
```

## Konfiguracja zaawansowana

### Zmiana modelu

W pliku `review-agent.js` możesz zmienić model (linia 146):

```javascript
this.model = 'claude-3-5-sonnet-20241022'; // Aktualny model
```

Dostępne modele:
- `claude-3-5-sonnet-20241022` - Najnowszy, najlepszy (zalecany)
- `claude-3-opus-20240229` - Największy, najdokładniejszy
- `claude-3-sonnet-20240229` - Szybszy, tańszy
- `claude-3-haiku-20240307` - Najszybszy, najtańszy

### Zmiana temperatury

Temperatura kontroluje kreatywność odpowiedzi (linia 225):

```javascript
temperature: 0.2, // 0.0 = deterministyczny, 1.0 = kreatywny
```

### Zmiana max_tokens

Maksymalna długość odpowiedzi (linia 224):

```javascript
max_tokens: 8192, // Maksymalnie 8192
```

## Architektura kodu

```
review-agent.js
├── CodeReviewAgent (główna klasa)
│   ├── constructor(apiKey)
│   ├── readFile(filePath) - wczytuje plik
│   ├── createReviewPrompt(fileInfo) - tworzy prompt
│   ├── performReview(fileInfo) - wywołuje API
│   ├── displayReview(review, fileInfo) - wyświetla wyniki
│   ├── parseReviewSections(review) - parsuje sekcje
│   ├── displaySection(section) - formatuje sekcję
│   ├── formatContent(content) - formatuje zawartość
│   └── run(filePath) - główna metoda
├── Funkcje pomocnicze (formatowanie)
│   ├── printHeader(text)
│   ├── printSubHeader(text)
│   ├── printSuccess(text)
│   ├── printError(text)
│   ├── printWarning(text)
│   └── printInfo(text)
└── main() - funkcja CLI
```

## Obsługa błędów

Agent obsługuje następujące błędy:

- **401 Unauthorized** - Nieprawidłowy klucz API
- **429 Rate Limited** - Przekroczono limit zapytań
- **500 Server Error** - Błąd serwera Anthropic
- **File not found** - Plik nie istnieje
- **Invalid file** - Nie można odczytać pliku

Przykład obsługi błędu:

```bash
✗ Błąd: Nie można wczytać pliku: ENOENT: no such file or directory
```

## Najlepsze praktyki

### 1. Przegląd małych plików
Agent działa najlepiej z plikami do ~500 linii kodu. Dla większych plików rozważ review poszczególnych modułów.

### 2. Iteracyjny proces
- Uruchom review
- Napraw najważniejsze problemy (CRITICAL/HIGH)
- Uruchom ponownie aby sprawdzić poprawki
- Przejdź do średnich/niskich priorytetów

### 3. Context-aware review
Agent ma kontekst tylko pojedynczego pliku. Dla pełnej analizy architektury przejrzyj powiązane pliki.

### 4. Połącz z git hooks
Możesz dodać agent do git pre-commit hook:

```bash
#!/bin/bash
# .git/hooks/pre-commit

FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$')

for FILE in $FILES; do
  echo "Reviewing $FILE..."
  node review-agent.js "$FILE"
done
```

### 5. CI/CD Integration
Przykład w GitHub Actions:

```yaml
name: Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install deps
        run: npm install
      - name: Review changed files
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff --name-only origin/main... | while read file; do
            node review-agent.js "$file"
          done
```

## Ograniczenia

1. **Koszt API**: Każde review kosztuje ~$0.01-0.05 w zależności od rozmiaru pliku
2. **Rate limiting**: Anthropic API ma limity requestów (50/min dla tier 1)
3. **Rozmiar pliku**: Pliki > 1000 linii mogą przekroczyć limit kontekstu
4. **Język**: Agent działa najlepiej z kodem w języku angielskim

## Rozwiązywanie problemów

### Błąd: "ANTHROPIC_API_KEY nie jest ustawiony"

Upewnij się że:
1. Plik `.env` istnieje w głównym katalogu projektu
2. Klucz API jest poprawnie ustawiony: `ANTHROPIC_API_KEY=sk-ant-...`
3. Nie ma spacji wokół znaku `=`

### Błąd: "Przekroczono limit zapytań API"

Poczekaj 1 minutę przed kolejnym requestem lub upgrade swojego tier w Anthropic Console.

### Agent zwraca niepełne wyniki

Zwiększ `max_tokens` do wartości maksymalnej (8192) lub podziel plik na mniejsze moduły.

### Output jest nieczytelny

Sprawdź czy terminal obsługuje kolory ANSI. W Windows użyj Windows Terminal lub Git Bash.

## Rozwój

### Dodawanie nowych języków

W metodzie `getLanguageFromExtension()`:

```javascript
const languageMap = {
  '.js': 'javascript',
  '.tsx': 'tsx',
  '.your-ext': 'your-language', // Dodaj tutaj
};
```

### Dostosowanie promptu

Edytuj metodę `createReviewPrompt()` aby dodać własne kategorie analizy.

### Dodanie zapisu do pliku

```javascript
const fs = require('fs/promises');

async displayReview(review, fileInfo) {
  // ... istniejący kod ...

  // Zapisz do pliku
  const reportPath = `${fileInfo.relativePath}.review.md`;
  await fs.writeFile(reportPath, review);
  printSuccess(`Raport zapisany do: ${reportPath}`);
}
```

## FAQ

**Q: Czy mogę używać agenta offline?**
A: Nie, agent wymaga połączenia z API Anthropic.

**Q: Czy agent modyfikuje moje pliki?**
A: Nie, agent tylko odczytuje i analizuje. Nigdy nie modyfikuje oryginalnych plików.

**Q: Jak długo trwa analiza?**
A: Zazwyczaj 10-30 sekund w zależności od rozmiaru pliku i obciążenia API.

**Q: Czy agent obsługuje TypeScript?**
A: Tak, agent w pełni obsługuje TypeScript, JSX, TSX i inne popularne języki.

**Q: Czy mogę używać agenta komercyjnie?**
A: Tak, ale pamiętaj o kosztach API i Terms of Service Anthropic.

## Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować.

## Wsparcie

Problemy i pytania:
- Otwórz issue w repozytorium projektu
- Sprawdź dokumentację Anthropic: https://docs.anthropic.com/

## Changelog

### v1.0.0 (2025-01-15)
- Pierwsza wersja
- Support dla Claude 3.5 Sonnet
- Kolorowy output w CLI
- 8 kategorii analizy
- Obsługa wielu języków programowania

## Roadmap

- [ ] Wsparcie dla review całego katalogu
- [ ] Generowanie raportów w formacie HTML/PDF
- [ ] Integracja z popularnymi IDE (VS Code extension)
- [ ] Cache dla powtarzających się fragmentów kodu
- [ ] Konfiguracja poziomów severity
- [ ] Auto-fix dla prostych problemów
- [ ] Batch processing wielu plików
- [ ] Integracja z GitHub/GitLab API
