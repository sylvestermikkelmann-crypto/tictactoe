# Retro Kryds og Bolle

Et lille website, hvor man kan spille kryds og bolle mod computeren i browseren.

Maalet er at bygge et spil med et gammeldags look: tydelige rammer, klassiske farver, en enkel spilleflade og en computer-modstander, som reagerer hurtigt og spiller korrekt.

## Projektmaal

- Byg et spilbart kryds-og-bolle-spil til browseren.
- Spilleren skal kunne spille mod computeren.
- Designet skal have et gammeldags, bevidst retro udtryk.
- Loesningen skal holdes enkel med ren HTML, CSS og JavaScript.

## Planlagt struktur

- `index.html` - side, layout og UI-struktur
- `styles.css` - retro styling og responsivt layout
- `game.js` - spil-logik, AI og DOM-haandtering
- `readme.md` - projektbeskrivelse
- `tasks.md` - opgaveliste
- `instructions.md` - konkrete udviklingsretningslinjer

## Funktioner

- 3x3 spillebraet
- Spiller mod computer
- Valg af hvem der starter
- Statusfelt for tur, sejr og uafgjort
- Knap til nyt spil
- Resultattavle for sejre og remis
- Retro visuel stil
- Mobilvenligt layout

## Teknisk retning

- Ingen framework
- Ingen backend
- Ingen build step noedvendig
- AI implementeres i browseren, helst med minimax

## Koer lokalt

Aabn projektmappen i en browser-venlig lokal server, fx:

```bash
python3 -m http.server 8000
```

Derefter aabnes:

```text
http://localhost:8000
```

## GitHub

Projektet er forberedt til at blive lagt paa GitHub, men det kraever enten:

- at `gh` er installeret og logget ind, eller
- at der findes en eksisterende GitHub-repository URL, som kan saettes som remote.

## Status

Spillet er implementeret i statiske filer og kan koeres lokalt i browseren.

Lokal git er sat op med et foerste commit. GitHub remote og push afventer stadig en repository-URL.