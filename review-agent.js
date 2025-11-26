#!/usr/bin/env node

/**
 * CodeReviewAgent - Zaawansowany agent do code review
 *
 * Użycie:
 *   node review-agent.js <ścieżka-do-pliku>
 *
 * Przykłady:
 *   node review-agent.js src/pages/api/offer.js
 *   node review-agent.js models/User.ts
 *   node review-agent.js lib/mongoose.js
 *   npm run review src/components/Layout.js
 *
 * Agent wykonuje kompleksowe code review:
 * - Analiza błędów i ryzyk
 * - Wykrywanie anty-patternów
 * - Propozycje optymalizacji
 * - Sugestie refaktoryzacji
 * - Konkretne fragmenty kodu do poprawy
 * - Zrefaktoryzowana wersja pliku (opcjonalnie)
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

// Kolory dla terminala
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

// Funkcje pomocnicze do formatowania
function printHeader(text) {
  console.log('\n' + colors.bright + colors.cyan + '═'.repeat(80) + colors.reset);
  console.log(colors.bright + colors.cyan + '  ' + text + colors.reset);
  console.log(colors.bright + colors.cyan + '═'.repeat(80) + colors.reset + '\n');
}

function printSubHeader(text) {
  console.log('\n' + colors.bright + colors.blue + '─'.repeat(80) + colors.reset);
  console.log(colors.bright + colors.blue + '  ' + text + colors.reset);
  console.log(colors.bright + colors.blue + '─'.repeat(80) + colors.reset + '\n');
}

function printSuccess(text) {
  console.log(colors.green + '✓ ' + text + colors.reset);
}

function printError(text) {
  console.log(colors.red + '✗ ' + text + colors.reset);
}

function printWarning(text) {
  console.log(colors.yellow + '⚠ ' + text + colors.reset);
}

function printInfo(text) {
  console.log(colors.blue + 'ℹ ' + text + colors.reset);
}

function printCodeBlock(code, language = '') {
  console.log(colors.dim + '```' + language + colors.reset);
  console.log(code);
  console.log(colors.dim + '```' + colors.reset);
}

// Klasa CodeReviewAgent
class CodeReviewAgent {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY nie jest ustawiony w zmiennych środowiskowych');
    }

    this.client = new Anthropic({
      apiKey: apiKey,
    });

    // Claude Sonnet 4.5 - najnowszy model (styczeń 2025)
    this.model = 'claude-sonnet-4-5-20250929';
  }

  /**
   * Wczytuje zawartość pliku
   */
  async readFile(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const content = await fs.readFile(absolutePath, 'utf-8');
      const stats = await fs.stat(absolutePath);

      return {
        path: absolutePath,
        relativePath: filePath,
        content: content,
        size: stats.size,
        lines: content.split('\n').length,
        extension: path.extname(filePath),
      };
    } catch (error) {
      throw new Error(`Nie można wczytać pliku: ${error.message}`);
    }
  }

  /**
   * Tworzy prompt dla agenta
   */
  createReviewPrompt(fileInfo) {
    return `Jesteś ekspertem code review i starszym inżynierem oprogramowania. Twoim zadaniem jest przeprowadzenie kompleksowej analizy poniższego kodu.

INFORMACJE O PLIKU:
- Ścieżka: ${fileInfo.relativePath}
- Rozmiar: ${fileInfo.size} bajtów
- Linie kodu: ${fileInfo.lines}
- Rozszerzenie: ${fileInfo.extension}

KOD DO PRZEGLĄDU:
\`\`\`${this.getLanguageFromExtension(fileInfo.extension)}
${fileInfo.content}
\`\`\`

Przeprowadź szczegółowe code review według następujących kategorii:

## 1. BŁĘDY I RYZYKA
Znajdź wszystkie potencjalne błędy, luki bezpieczeństwa, race conditions, memory leaks, itp.
Dla każdego problemu podaj:
- Dokładną lokalizację (numer linii lub fragment kodu)
- Opis problemu
- Potencjalne konsekwencje
- Poziom krytyczności (CRITICAL/HIGH/MEDIUM/LOW)

## 2. ANTY-PATTERNY
Zidentyfikuj wszystkie anty-patterny w kodzie:
- Code smells
- Złe praktyki projektowe
- Naruszenia zasad SOLID
- Problemy z czytelności
- Nadmierna złożoność

## 3. OPTYMALIZACJE WYDAJNOŚCI
Zaproponuj konkretne optymalizacje:
- Wydajność algorytmiczna (złożoność czasowa/pamięciowa)
- Optymalizacje bazy danych (indexy, query)
- Caching
- Redukcja alokacji pamięci
- Lazy loading / code splitting (jeśli frontend)

## 4. REFAKTORYZACJA
Zaproponuj refaktoryzację według dobrych praktyk:
- Lepsze nazewnictwo zmiennych/funkcji
- Ekstrakcja funkcji/komponentów
- Redukcja duplikacji kodu (DRY)
- Zastosowanie design patterns
- Lepsze zarządzanie stanem
- Separation of concerns

## 5. KONKRETNE FRAGMENTY DO POPRAWY
Dla każdego problematycznego fragmentu:
- Pokaż oryginalny kod (z numerami linii)
- Wyjaśnij co jest nie tak
- Pokaż poprawioną wersję
- Wyjaśnij dlaczego poprawiona wersja jest lepsza

## 6. TESTY
- Jakie testy powinny być dodane?
- Jakie edge cases nie są pokryte?
- Propozycje unit testów

## 7. DOKUMENTACJA
- Czy kod jest dobrze udokumentowany?
- Czy brakuje ważnych komentarzy?
- Czy JSDoc/TSDoc jest kompletny?

## 8. ZREFAKTORYZOWANA WERSJA (OPCJONALNIE)
Jeśli kod wymaga znaczącej refaktoryzacji, dostarcz kompletną zrefaktoryzowaną wersję pliku z komentarzami wyjaśniającymi zmiany.

UWAGI:
- Bądź szczegółowy i konkretny
- Podawaj przykłady kodu
- Uzasadniaj swoje sugestie
- Priorytetyzuj problemy według ważności
- Skoncentruj się na praktycznych, wykonalnych sugestiach`;
  }

  /**
   * Rozpoznaje język programowania na podstawie rozszerzenia
   */
  getLanguageFromExtension(extension) {
    const languageMap = {
      '.js': 'javascript',
      '.jsx': 'jsx',
      '.ts': 'typescript',
      '.tsx': 'tsx',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.rb': 'ruby',
      '.php': 'php',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.scala': 'scala',
    };

    return languageMap[extension] || '';
  }

  /**
   * Wykonuje code review przy użyciu Claude API
   */
  async performReview(fileInfo) {
    const prompt = this.createReviewPrompt(fileInfo);

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 8192,
        temperature: 0.2,
        stream: false, // WAŻNE: wyłącz streaming aby uniknąć problemów z terminalem
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].text;
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Błąd autoryzacji: Sprawdź czy ANTHROPIC_API_KEY jest poprawny');
      } else if (error.status === 429) {
        throw new Error('Przekroczono limit zapytań API. Spróbuj ponownie za chwilę.');
      } else if (error.status === 500) {
        throw new Error('Błąd serwera Anthropic. Spróbuj ponownie za chwilę.');
      } else {
        throw new Error(`Błąd API: ${error.message}`);
      }
    }
  }

  /**
   * Formatuje i wyświetla wyniki review
   */
  displayReview(review, fileInfo) {
    printHeader('📋 RAPORT CODE REVIEW');

    console.log(colors.bright + 'Plik:' + colors.reset, colors.cyan + fileInfo.relativePath + colors.reset);
    console.log(colors.bright + 'Linie kodu:' + colors.reset, fileInfo.lines);
    console.log(colors.bright + 'Rozmiar:' + colors.reset, (fileInfo.size / 1024).toFixed(2) + ' KB');

    printSubHeader('WYNIKI ANALIZY');

    // Wyświetl wyniki z lepszym formatowaniem
    const sections = this.parseReviewSections(review);

    for (const section of sections) {
      this.displaySection(section);
    }
  }

  /**
   * Parsuje sekcje z odpowiedzi agenta
   */
  parseReviewSections(review) {
    const sections = [];
    const lines = review.split('\n');
    let currentSection = null;

    for (const line of lines) {
      // Wykryj nagłówki sekcji (## 1. TYTUŁ)
      const headerMatch = line.match(/^##\s+(\d+)\.\s+(.+)$/);
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          number: headerMatch[1],
          title: headerMatch[2],
          content: [],
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Wyświetla pojedynczą sekcję
   */
  displaySection(section) {
    const titleColors = {
      'BŁĘDY I RYZYKA': colors.red,
      'ANTY-PATTERNY': colors.yellow,
      'OPTYMALIZACJE WYDAJNOŚCI': colors.green,
      'REFAKTORYZACJA': colors.blue,
      'KONKRETNE FRAGMENTY DO POPRAWY': colors.magenta,
      'TESTY': colors.cyan,
      'DOKUMENTACJA': colors.white,
      'ZREFAKTORYZOWANA WERSJA': colors.green,
    };

    let titleColor = colors.white;
    for (const [key, color] of Object.entries(titleColors)) {
      if (section.title.includes(key)) {
        titleColor = color;
        break;
      }
    }

    console.log('\n' + colors.bright + titleColor + `${section.number}. ${section.title}` + colors.reset);
    console.log(titleColor + '─'.repeat(80) + colors.reset);

    const content = section.content.join('\n').trim();
    if (content) {
      // Formatuj bloki kodu
      const formattedContent = this.formatContent(content);
      console.log(formattedContent);
    } else {
      console.log(colors.dim + '  (brak uwag w tej sekcji)' + colors.reset);
    }
  }

  /**
   * Formatuje zawartość z obsługą bloków kodu
   */
  formatContent(content) {
    // Podświetl bloki kodu
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return colors.dim + '```' + (lang || '') + colors.reset + '\n' +
             colors.green + code + colors.reset + '\n' +
             colors.dim + '```' + colors.reset;
    });

    // Podświetl inline code
    content = content.replace(/`([^`]+)`/g, colors.cyan + '$1' + colors.reset);

    // Podświetl poziomy krytyczności
    content = content.replace(/\b(CRITICAL|HIGH|MEDIUM|LOW)\b/g, (match) => {
      const severityColors = {
        'CRITICAL': colors.bgRed + colors.white,
        'HIGH': colors.red,
        'MEDIUM': colors.yellow,
        'LOW': colors.green,
      };
      return severityColors[match] + match + colors.reset;
    });

    // Podświetl markery
    content = content.replace(/^(\s*[-*+]\s)/gm, colors.blue + '$1' + colors.reset);
    content = content.replace(/^(\s*\d+\.\s)/gm, colors.blue + '$1' + colors.reset);

    return content;
  }

  /**
   * Główna metoda uruchamiająca agenta
   */
  async run(filePath) {
    const startTime = Date.now();

    try {
      printHeader('🤖 CODE REVIEW AGENT');

      // 1. Wczytaj plik
      printInfo('Wczytuję plik...');
      const fileInfo = await this.readFile(filePath);
      printSuccess(`Wczytano: ${fileInfo.relativePath} (${fileInfo.lines} linii)`);

      // 2. Wykonaj review
      printInfo(`Analizuję kod za pomocą ${this.model}...`);
      process.stdout.write(colors.dim + 'Czekam na odpowiedź API (może potrwać 10-30s)...' + colors.reset);

      const review = await this.performReview(fileInfo);

      process.stdout.write('\r' + ' '.repeat(80) + '\r'); // Wyczyść linię
      printSuccess('✓ Analiza zakończona!\n');

      // 3. Wyświetl wyniki
      this.displayReview(review, fileInfo);

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      printHeader('✨ REVIEW ZAKOŃCZONY');
      printSuccess(`Czas wykonania: ${duration}s`);

    } catch (error) {
      printError(`Błąd: ${error.message}`);
      process.exit(1);
    }
  }
}

// Główna funkcja CLI
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(colors.bright + 'CodeReviewAgent' + colors.reset);
    console.log('\nUżycie:');
    console.log('  node review-agent.js ' + colors.cyan + '<ścieżka-do-pliku>' + colors.reset);
    console.log('\nPrzykłady:');
    console.log('  node review-agent.js src/pages/api/offer.js');
    console.log('  node review-agent.js models/User.ts');
    console.log('  npm run review lib/mongoose.js');
    console.log('\nWymaga zmiennej środowiskowej:');
    console.log('  ANTHROPIC_API_KEY - klucz API do Anthropic Claude');
    console.log('\nDodaj do pliku .env:');
    console.log('  ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(0);
  }

  const filePath = args[0];
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    printError('Brak klucza API!');
    console.log('\nUstaw zmienną środowiskową ANTHROPIC_API_KEY w pliku .env:');
    console.log(colors.cyan + 'ANTHROPIC_API_KEY=sk-ant-api03-...' + colors.reset);
    console.log('\nLub uruchom:');
    console.log(colors.cyan + 'export ANTHROPIC_API_KEY=sk-ant-api03-...' + colors.reset);
    process.exit(1);
  }

  const agent = new CodeReviewAgent(apiKey);
  await agent.run(filePath);
}

// Uruchom CLI
if (require.main === module) {
  main().catch(error => {
    printError(`Nieoczekiwany błąd: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { CodeReviewAgent };
