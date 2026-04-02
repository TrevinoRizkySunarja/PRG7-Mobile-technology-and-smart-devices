# Installatie

## Les 1

- [Installatie](#installatie)
  - [Les 1](#les-1)
  - [Les 2](#les-2)
  - [Les 3](#les-3)
  - [Les 6](#les-6)

Check of node en npm de juiste versie hebben:

`node -v` versie 22 of 24

`npm -v` versie 10 of 11

- Installeer node/npm indien nodig: https://nodejs.org/en/download (Scroll naar beneden voor de installer van een
  prebuilt versie)

## Les 2

Als het goed is heb je alle vereisten al om met Expo te werken.

Maak je eerste project aan door het volgende commando uit te voeren (vervang `newproject` voor de naam van jouw
project):

<!-- TODO: in de gaten houden wanneer Expo Go naar 55 gaat -->

`npx create-expo-app newproject --template blank@sdk-54`

Update bij problemen eerst je npm: `npm install -g npm@latest`

Open het zojuist aangemaakte project in PhpStorm. Daarna kun je de app bekijken met de Expo Go app op je telefoon, door
in de terminal van je project het volgende uit te voeren:

`npm run start`

**Let op!** Je telefoon moet verbonden zijn met hetzelfde netwerk als je computer.

Omdat de documentatie van de installatie van een navigator verdeeld is over meerdere pagina's, en ook diverse extra
modules in de documentatie gebruikt worden, vind je hier een overzicht van de essentiële stappen:

## Les 3

**basis navigation** (altijd nodig, voor elk type navigator)

```
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
```

**type navigator**

- `npm install @react-navigation/stack`

**implementatie**

Daarna kan je de navigator implementeren. Voor de stack navigator staat hier een uitgewerkt voorbeeld
['Stack Navigation'](https://reactnavigation.org/docs/stack-navigator/). Je kunt bij de code voorbeelden steeds kiezen
tussen **static**, vergelijkbaar met routing bij PRG6, of **dynamic**, waarbij de configuratie in de `JSX` plaatsvindt.

## Les 6

Volg de stappen voor een stack navigator, en kies in plaats van `@react-navigation/stack` voor een
`@react-navigation/bottom-tabs`.

```shell
npm install @react-navigation/bottom-tabs
```
